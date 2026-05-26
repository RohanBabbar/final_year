const fs = require('fs');

try {
    const data = fs.readFileSync('reports/confusion_matrix_cwe.csv', 'utf8');
    const lines = data.trim().split('\n');
    
    // Header is first line
    const header = lines[0].split(',');
    
    let y_true = [];
    let y_pred = [];
    
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        const true_label_idx = i - 1;
        
        for (let j = 1; j < cols.length; j++) {
            const count = parseInt(cols[j]);
            const pred_label_idx = j - 1;
            
            for (let c = 0; c < count; c++) {
                y_true.push(true_label_idx);
                y_pred.push(pred_label_idx);
            }
        }
    }
    
    // Calculate metrics
    let correct = 0;
    for (let i = 0; i < y_true.length; i++) {
        if (y_true[i] === y_pred[i]) correct++;
    }
    const accuracy = correct / y_true.length;
    
    // Precision, Recall, F1
    const num_classes = lines.length - 1;
    let tp = new Array(num_classes).fill(0);
    let fp = new Array(num_classes).fill(0);
    let fn = new Array(num_classes).fill(0);
    
    for (let i = 0; i < y_true.length; i++) {
        if (y_true[i] === y_pred[i]) {
            tp[y_true[i]]++;
        } else {
            fn[y_true[i]]++;
            fp[y_pred[i]]++;
        }
    }
    
    let macro_p = 0;
    let macro_r = 0;
    
    for (let i = 0; i < num_classes; i++) {
        const p = (tp[i] + fp[i]) === 0 ? 0 : tp[i] / (tp[i] + fp[i]);
        const r = (tp[i] + fn[i]) === 0 ? 0 : tp[i] / (tp[i] + fn[i]);
        macro_p += p;
        macro_r += r;
    }
    
    macro_p /= num_classes;
    macro_r /= num_classes;
    
    // MCC Calculation for Multi-class
    // Cov(t, p) / sqrt(Cov(t, t) * Cov(p, p))
    let sum_t = new Array(num_classes).fill(0);
    let sum_p = new Array(num_classes).fill(0);
    for (let i = 0; i < num_classes; i++) {
        sum_t[i] = tp[i] + fn[i];
        sum_p[i] = tp[i] + fp[i];
    }
    
    let num = 0;
    for (let k = 0; k < num_classes; k++) {
        for (let l = 0; l < num_classes; l++) {
            for (let m = 0; m < num_classes; m++) {
                // Not standard MCC. Standard multiclass MCC:
                // (c * s - sum_k(p_k * t_k)) / sqrt((s^2 - sum_k(p_k^2)) * (s^2 - sum_k(t_k^2)))
            }
        }
    }
    
    let c = correct;
    let s = y_true.length;
    
    let sum_pt = 0;
    let sum_p2 = 0;
    let sum_t2 = 0;
    
    for (let k = 0; k < num_classes; k++) {
        sum_pt += sum_p[k] * sum_t[k];
        sum_p2 += sum_p[k] * sum_p[k];
        sum_t2 += sum_t[k] * sum_t[k];
    }
    
    const mcc_num = c * s - sum_pt;
    const mcc_den = Math.sqrt((s * s - sum_p2) * (s * s - sum_t2));
    const mcc = mcc_den === 0 ? 0 : mcc_num / mcc_den;
    
    console.log(`Accuracy:        ${accuracy.toFixed(4)}`);
    console.log(`Macro Precision: ${macro_p.toFixed(4)}`);
    console.log(`Macro Recall:    ${macro_r.toFixed(4)}`);
    console.log(`MCC:             ${mcc.toFixed(4)}`);

} catch (e) {
    console.error(e);
}
