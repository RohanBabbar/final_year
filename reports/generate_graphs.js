const fs = require('fs');
const path = require('path');

// 1. Read CSVs
const prCsv = fs.readFileSync('classification_report_updated.csv', 'utf8');
const cmCsv = fs.readFileSync('confusion_matrix_cwe.csv', 'utf8');

// Parse PR
const prLines = prCsv.split('\n').filter(l => l.trim().length > 0);
const prData = prLines.slice(1).map(l => {
    const p = l.split(',');
    return { label: p[0], precision: parseFloat(p[1]), recall: parseFloat(p[2]) };
}).filter(d => !isNaN(d.precision) && !isNaN(d.recall));

// Parse CM
const cmLines = cmCsv.split('\n').filter(l => l.trim().length > 0);
const cmHeaders = cmLines[0].split(',').slice(1, 21); // Top 20 for readability
const cmData = [];
for (let i = 1; i <= 20; i++) {
    const row = cmLines[i].split(',').slice(1, 21).map(x => parseInt(x) || 0);
    cmData.push(row);
}

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>CWE Model Visualizations</title>
    <script src="https://cdn.plot.ly/plotly-2.24.1.min.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 1400px; margin: 0 auto; }
        .plot-container { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        h1 { text-align: center; color: #2c3e50; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>CWE Model Evaluation Visualizations</h1>
    <div class="grid">
        <div id="loss-plot" class="plot-container"></div>
        <div id="compare-plot" class="plot-container"></div>
        <div id="pr-plot" class="plot-container"></div>
        <div id="cm-plot" class="plot-container"></div>
    </div>

    <script>
        // 1. Loss Plot
        var lossData = [
            { x: [1, 2], y: [0.2138, 0.0071], name: 'Train Loss', type: 'scatter', line: {color: '#3498db', width: 3} },
            { x: [1, 2], y: [0.0056, 0.0073], name: 'Val Loss', type: 'scatter', line: {color: '#e74c3c', width: 3} }
        ];
        Plotly.newPlot('loss-plot', lossData, {title: 'Training vs Validation Loss', xaxis: {title: 'Epoch', tickvals: [1, 2]}, yaxis: {title: 'Cross-Entropy Loss'}});

        // 2. Model Comparison
        var compareData = [
            { x: ['CodeT5-small', 'CodeBERT'], y: [0.9984, 0.9978], name: 'Accuracy', type: 'bar', marker: {color: '#2ecc71'} },
            { x: ['CodeT5-small', 'CodeBERT'], y: [0.9985, 0.9983], name: 'Macro F1', type: 'bar', marker: {color: '#9b59b6'} }
        ];
        Plotly.newPlot('compare-plot', compareData, {title: 'Model Comparison', barmode: 'group', yaxis: {title: 'Score', range: [0.99, 1.0]}});

        // 3. PR Curve
        var precisions = ${JSON.stringify(prData.map(d => d.precision))};
        var recalls = ${JSON.stringify(prData.map(d => d.recall))};
        var labels = ${JSON.stringify(prData.map(d => d.label))};
        
        var prPlotData = [{
            x: recalls,
            y: precisions,
            text: labels,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 10, color: precisions, colorscale: 'Viridis', showscale: true }
        }];
        Plotly.newPlot('pr-plot', prPlotData, {title: 'Precision vs Recall (Class-wise)', xaxis: {title: 'Recall'}, yaxis: {title: 'Precision'}, hovermode: 'closest'});

        // 4. Confusion Matrix
        var cmZ = ${JSON.stringify(cmData)};
        var cmLabels = ${JSON.stringify(cmHeaders)};
        
        var cmPlotData = [{
            z: cmZ,
            x: cmLabels,
            y: cmLabels,
            type: 'heatmap',
            colorscale: 'Blues'
        }];
        Plotly.newPlot('cm-plot', cmPlotData, {title: 'Confusion Matrix (Top 20 Subset)', yaxis: {autorange: 'reversed'}});
    </script>
</body>
</html>
`;

fs.writeFileSync('visuals.html', htmlContent);
console.log("visuals.html generated successfully!");
