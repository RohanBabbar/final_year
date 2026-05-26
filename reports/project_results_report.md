# Project Results: Software Vulnerability Classification

---

## 1. Sample Code Snippets

**Preprocessing Code**
```python
import re

def clean_code(code):
    if not isinstance(code, str): return ""
    
    # Remove single-line and multi-line comments
    code = re.sub(r"//.*", "", code)
    code = re.sub(r"/\*.*?\*/", "", code, flags=re.DOTALL)
    
    # Normalize whitespace
    code = re.sub(r"\s+", " ", code)
    return code.strip()
```

**Tokenizer Usage**
```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("Salesforce/codet5-small")

def tokenize_batch(batch):
    return tokenizer(
        batch["code_clean"].tolist(),
        padding="max_length",
        truncation=True,
        max_length=256,
        return_tensors="pt"
    )
```

**Model Training Snippet**
```python
def train_one_epoch(model, dataloader, optimizer, device):
    model.train()
    # Using Class-Weighted Cross Entropy to handle dataset imbalance
    loss_fn = nn.CrossEntropyLoss(weight=class_weights)
    
    for batch in dataloader:
        outputs = model(
            input_ids=batch["input_ids"].to(device), 
            attention_mask=batch["attention_mask"].to(device)
        )
        loss = loss_fn(outputs.logits, batch["labels"].to(device))
        
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
```

---

## 2. Model Configuration

*   **Model Architecture:** CodeT5-small
*   **Learning Rate:** 5e-5
*   **Batch Size:** 4
*   **Epochs:** 2
*   **Optimizer:** AdamW
*   **Loss Function:** Weighted Cross-Entropy Loss

---

## 3. Sample Dataset Entry

```c
#include "std_testcase.h" #ifndef _WIN32 #include <wchar.h> #endif #ifdef _WIN32 #include <winsock2.h> #include <windows.h> #include <direct.h> #pragma comment(lib, "ws2_32") #define CLOSE_SOCKET closesocket #else #include <sys/types.h> #include <sys/socket.h> #include <netinet/in.h> #include <arpa/inet.h> #include <unistd.h> #define INVALID_SOCKET -1 #define SOCKET_ERROR -1 #define CLOSE_SOCKET closesocket
void CWE114_Process_Control__w32_char_connect_socket_11_bad() { ... }
```
**Label:** CWE-114

---

## 4. Additional Results

*   **Macro F1:** 0.9880
*   **Weighted F1:** 0.9984
*   **Overall Accuracy:** 0.9984

---

## 5. Extra Graph Reference

> [!NOTE]
> *Instructions for document compiler: Insert the **Training vs Validation Loss Curve** (from `12_visuals.ipynb` showing convergence at 2 epochs) and the **Precision-Recall Curve** for the minority classes here.*

---

## 6. List of CWE Classes

*   **CWE-114:** Process Control
*   **CWE-121:** Stack-based Buffer Overflow
*   **CWE-122:** Heap-based Buffer Overflow
*   **CWE-188:** Reliance on Data/Memory Layout
*   **CWE-190:** Integer Overflow or Wraparound
*   **CWE-244:** Improper Clearing of Heap Memory Before Release
