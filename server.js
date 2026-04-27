import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

let licensesData = [];

// Initialize - Parse all PDFs on startup
async function initializeLicenses() {
  console.log('🔄 Initializing license database from PDFs...');
  const dataDir = path.join(__dirname, 'data');
  
  console.log(`📁 Data directory: ${dataDir}`);
  
  if (!fs.existsSync(dataDir)) {
    console.log('⚠️  Data directory not found');
    return;
  }

  const allFiles = fs.readdirSync(dataDir);
  console.log(`📊 Total files in data folder: ${allFiles.length}`);
  
  const pdfFiles = allFiles.filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`📄 Found ${pdfFiles.length} PDF files\n`);

  for (const pdfFile of pdfFiles) {
    try {
      const pdfPath = path.join(dataDir, pdfFile);
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdfParse(dataBuffer);
      
      let licenseCount = 0;
      
      // Extract collection point from PDF filename
      const collectionPoint = extractCollectionPointFromFilename(pdfFile);
      console.log(`   📍 Collection Point: ${collectionPoint}`);
      
      // Try to extract from tables first
      if (data.version && data.text) {
        const text = data.text;
        const lines = text.split('\n').map(line => line.trim()).filter(l => l.length > 0);
        
        for (const line of lines) {
          // Extract license numbers with names from this line
          const licensesWithNames = extractLicensesWithNames(line);
          
          for (const item of licensesWithNames) {
            licensesData.push({
              name: item.name,
              license_number: item.license_number,
              printed: true,
              collection_point: collectionPoint
            });
            licenseCount++;
            
            if (licenseCount <= 3) {
              console.log(`   Found: ${item.license_number} (${item.name})`);
            }
          }
        }
      }
      
      console.log(`✅ ${pdfFile}: ${licenseCount} licenses\n`);
    } catch (error) {
      console.error(`❌ Error parsing ${pdfFile}:`, error.message);
    }
  }

  // Remove duplicates
  licensesData = Array.from(new Map(
    licensesData.map(l => [l.license_number, l])
  ).values());

  console.log(`✨ Total unique licenses: ${licensesData.length}`);
  console.log(`📊 Collection Points: ${[...new Set(licensesData.map(l => l.collection_point))].join(', ')}`);
  console.log(`📊 Sample licenses (first 5):`);
  licensesData.slice(0, 5).forEach((l, i) => {
    console.log(`   ${i + 1}. ${l.license_number} - ${l.name} (${l.collection_point})`);
  });
  console.log();
}

// Extract collection point from PDF filename
function extractCollectionPointFromFilename(filename) {
  // Remove file extension
  let name = filename.replace(/\.pdf$/i, '');
  
  // Remove the random suffix at the end (e.g., "_ixwizke")
  name = name.replace(/_[a-z0-9]+$/i, '');
  
  // List of keywords to remove (as separate operations to ensure all are caught)
  const keywords = ['Printed', 'printed', 'License', 'license', 'Card', 'card', 'List', 'list', 
                   'Details', 'details', 'Office', 'office', 'Cards', 'cards', 'Driving', 'driving',
                   'Desk', 'desk', 'Bureau', 'bureau'];
  
  // Remove each keyword (at any position)
  for (const keyword of keywords) {
    name = name.replace(new RegExp(`\\s*${keyword}\\s*`, 'g'), ' ');
  }
  
  // Remove numbers at the end
  name = name.replace(/\s+\d+\s*$/, '');
  
  // Clean up extra spaces
  name = name.trim().replace(/\s+/g, ' ');
  
  // If empty after cleanup, return default
  if (!name || name.length < 2) {
    return 'Collection Center';
  }
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return name;
}

// Helper function to identify license numbers
function isLikelyLicenseNumber(text) {
  // Pattern: contains numbers and hyphens, looks like an ID
  // e.g., "04-06-01453435", "LIC123456", etc.
  const text_clean = text.replace(/\s/g, '');
  
  // Should have at least some digits
  const digitCount = (text_clean.match(/\d/g) || []).length;
  
  // Should be reasonable length and contain mostly digits
  if (digitCount >= 4 && text_clean.length <= 50 && text_clean.length >= 4) {
    // Should not be pure text
    return !(/^[a-zA-Z\s]+$/.test(text_clean));
  }
  
  return false;
}

// Extract license numbers with names from a line (handles merged table cells)
function extractLicensesWithNames(line) {
  const results = [];
  
  // Pattern: optional leading digits/characters, then NAME (letters/spaces), then LICENSE (DD-DD-DDDDD)
  // This captures name and license together from merged table cells
  // Handles cases like: "1AABART K.C.01-06-00811452"
  const nameAndLicensePattern = /\d*\s*([A-Z][A-Z\s.]*?)(\d{2}[-\s]?\d{2}[-\s]?\d{5,})/g;
  
  let match;
  while ((match = nameAndLicensePattern.exec(line)) !== null) {
    const name = match[1].trim().replace(/\.$/, ''); // Remove trailing period
    const licenseNum = match[2].replace(/\s/g, '').toUpperCase();
    
    // Only include if both name and license are valid
    if (name.length > 0 && licenseNum.length >= 8) {
      results.push({
        name: name,
        license_number: licenseNum
      });
    }
  }
  
  return results;
}

// API: Search license
app.post('/api/search', (req, res) => {
  try {
    const { license_number } = req.body;

    if (!license_number || license_number.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid license number'
      });
    }

    // Normalize search term - remove spaces, convert to uppercase
    const searchTerm = license_number.toUpperCase().trim().replace(/\s/g, '');
    
    // Try exact match only - strict matching
    let found = licensesData.find(l => {
      const dbTerm = l.license_number.toUpperCase().replace(/\s/g, '');
      return dbTerm === searchTerm;
    });

    if (found) {
      return res.json({
        success: true,
        found: true,
        data: found
      });
    } else {
      // Not found - return clear not-found response
      return res.json({
        success: true,
        found: false,
        message: `License number "${license_number}" not found in database. Please verify and try again.`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API: Get stats
app.get('/api/stats', (req, res) => {
  res.json({
    total_licenses: licensesData.length,
    locations: [...new Set(licensesData.map(l => l.collection_point))]
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

// Start server
initializeLicenses().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Open your browser to see the application\n`);
  });
}).catch(error => {
  console.error('Failed to initialize:', error);
  process.exit(1);
});
