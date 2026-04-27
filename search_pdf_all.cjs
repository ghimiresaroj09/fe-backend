
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const directoryPath = "C:\\Users\\Dell\\Desktop\\Licence Check\\data";
const searchTerm = "01-06-00811452";

async function searchInPDFs() {
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith(".pdf"));
    for (const file of files) {
        process.stdout.write(`Checking: ${file}... `);
        const filePath = path.join(directoryPath, file);
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            if (data.text.includes(searchTerm)) {
                console.log(`\nMATCH FOUND in ${file}!`);
                const index = data.text.indexOf(searchTerm);
                const start = Math.max(0, index - 50);
                const end = Math.min(data.text.length, index + 100);
                console.log("Context:");
                console.log(data.text.substring(start, end).replace(/\n/g, " "));
                console.log("-----------------------------------------");
            } else {
                process.stdout.write("Not found\n");
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
}

searchInPDFs();
