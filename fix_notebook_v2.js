const fs = require('fs');
const path = 'notebooks/19_sard116.ipynb';
const nb = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Update SARD_ZIP_URL in Cell 1 (index 2)
const cell1 = nb.cells[2];
if (cell1 && cell1.source) {
    cell1.source = cell1.source.map(line => {
        if (line.includes('SARD_ZIP_URL')) {
            return "SARD_ZIP_URL  = 'https://samate.nist.gov/SARD/downloads/test-suites/2022-11-23-C-Testcases-TS116.zip'\\n";
        }
        return line;
    });
}

// 2. Update Cell 3 (index 6) to be more robust
// Cell 3 is index 6 based on:
// 0: markdown, 1: markdown, 2: code (Cell 1), 3: markdown, 4: code (Cell 2), 5: markdown, 6: code (Cell 3)
const cell3 = nb.cells[6];
if (cell3 && cell3.source) {
    const newSource = [];
    for (const line of cell3.source) {
        if (line.includes("print('Scanning SARD 116 files...')")) {
            newSource.push(line);
            newSource.push("if not os.path.exists(SARD_DIR):\\n");
            newSource.push("    raise FileNotFoundError(f'Directory {SARD_DIR} not found. Did you run Cell 2 successfully?')\\n");
        } else if (line.includes("df_sard = pd.DataFrame(records)")) {
            newSource.push(line);
            newSource.push("if df_sard.empty:\\n");
            newSource.push("    raise ValueError('No usable records found. Check if CWE labels were correctly extracted.')\\n");
        } else {
            newSource.push(line);
        }
    }
    cell3.source = newSource;
}

fs.writeFileSync(path, JSON.stringify(nb, null, 1));
console.log('Notebook updated with correct URL and robustness checks.');
