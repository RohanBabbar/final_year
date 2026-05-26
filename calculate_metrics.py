import pandas as pd
import numpy as np
from sklearn.metrics import matthews_corrcoef, accuracy_score, precision_score, recall_score, f1_score

# Try to find the true and predicted labels if they were saved, or calculate from confusion matrix
try:
    cm = pd.read_csv('reports/confusion_matrix_cwe.csv', index_col=0)
    cm_matrix = cm.values
    
    # Reconstruct y_true and y_pred from confusion matrix
    y_true = []
    y_pred = []
    
    for i in range(cm_matrix.shape[0]):
        for j in range(cm_matrix.shape[1]):
            count = cm_matrix[i, j]
            y_true.extend([i] * count)
            y_pred.extend([j] * count)
            
    accuracy = accuracy_score(y_true, y_pred)
    macro_p = precision_score(y_true, y_pred, average='macro', zero_division=0)
    macro_r = recall_score(y_true, y_pred, average='macro', zero_division=0)
    macro_f1 = f1_score(y_true, y_pred, average='macro', zero_division=0)
    mcc = matthews_corrcoef(y_true, y_pred)
    
    print(f"Metrics from confusion_matrix_cwe.csv:")
    print(f"Accuracy:        {accuracy:.4f}")
    print(f"Macro Precision: {macro_p:.4f}")
    print(f"Macro Recall:    {macro_r:.4f}")
    print(f"Macro F1:        {macro_f1:.4f}")
    print(f"MCC:             {mcc:.4f}")
except Exception as e:
    print(f"Could not calculate from confusion matrix: {e}")
