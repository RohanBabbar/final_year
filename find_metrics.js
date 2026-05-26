const fs = require('fs');
const path = require('path');

function searchNotebooks() {
    const files = fs.readdirSync('notebooks').filter(f => f.endsWith('.ipynb'));
    
    for (const file of files) {
        try {
            const nb = JSON.parse(fs.readFileSync(`notebooks/${file}`, 'utf8'));
            let cellCounter = 0;
            for (const cell of nb.cells) {
                cellCounter++;
                if (cell.outputs) {
                    for (const output of cell.outputs) {
                        if (output.text) {
                            const text = Array.isArray(output.text) ? output.text.join('') : output.text;
                            if (text.includes('0.9605') || text.includes('0.960') || text.includes('macro avg') || text.includes('MCC')) {
                                console.log(`\n--- Match found in ${file} (Cell ${cellCounter}) ---`);
                                const lines = text.split('\n');
                                lines.forEach(line => {
                                    if (line.match(/accuracy|macro|weighted|mcc|0\.960|precision|recall/i)) {
                                        console.log(line);
                                    }
                                });
                            }
                        }
                    }
                }
            }
        } catch (e) {
            // Ignore parse errors for broken notebooks
        }
    }
}

searchNotebooks();
