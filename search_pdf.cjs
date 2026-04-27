
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const directoryPath = "C:\\Users\\Dell\\Desktop\\Licence Check\\data";
const searchTerm = "00811452";

async function searchInPDFs() {
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith(".pdf"));
    for (const file of files) {
        console.log(`Checking: ${file}`);
        const filePath = path.join(directoryPath, file);
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            if (data.text.includes(searchTerm)) {
                console.log(`\nMATCH FOUND in ${file}!\n`);
                const index = data.text.indexOf(searchTerm);
                const start = Math.max(0, index - 100);
                const end = Math.min(data.text.length, index + 100);
                console.log("Context:");
                console.log(data.text.substring(start, end));
                process.exit(0);
            }
        } catch (error) {
            console.error(`Error processing ${file}: ${error.message}`);
        }
    }
    console.log("License not found in any PDF.");
}

searchInPDFs();
