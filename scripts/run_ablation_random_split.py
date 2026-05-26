import os
import pandas as pd
import torch
import torch.nn as nn
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from torch.optim import AdamW
from tqdm import tqdm

CSV_PATH = "/Users/rohanbabbar/Documents/Final Year/cwe/Archive/juliet_cwe_dataset.csv"
MODEL_NAME = "Salesforce/codet5-small"
MAX_LENGTH = 256
BATCH_SIZE = 4
EPOCHS = 2
LR = 5e-5
SAVE_DIR = "/Users/rohanbabbar/Documents/Final Year/cwe/Archive/models/ablation_random_split"

device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"
print(f"🚀 Using device: {device}")

# 1. Load Data
# ABLATION: Using Random Split instead of Template-Aware Split
print("Loading dataset...")
df = pd.read_csv(CSV_PATH)
df = df[["code_clean", "cwe_index"]].dropna()
df["cwe_index"] = df["cwe_index"].astype(int)

# RANDOM SPLIT: This causes 96% structural data leakage
train_df, val_df = train_test_split(
    df,
    test_size=0.2,
    random_state=42,
    stratify=df["cwe_index"]
)

# 2. Tokenizer & Dataset
class JulietDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=256):
        self.texts = list(texts)
        self.labels = list(labels)
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        code = str(self.texts[idx])
        label = int(self.labels[idx])
        encoding = self.tokenizer(
            code,
            truncation=True,
            padding="max_length",
            max_length=self.max_len
        )
        item = {k: torch.tensor(v) for k, v in encoding.items()}
        item["labels"] = torch.tensor(label)
        return item

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=False)
train_dataset = JulietDataset(train_df["code_clean"], train_df["cwe_index"], tokenizer, MAX_LENGTH)
val_dataset = JulietDataset(val_df["code_clean"], val_df["cwe_index"], tokenizer, MAX_LENGTH)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)

# 3. Model & Optimizer
num_classes = int(df["cwe_index"].max()) + 1
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=num_classes)
model.to(device)
optimizer = AdamW(model.parameters(), lr=LR)

# Compute class weights
class_counts = train_df["cwe_index"].value_counts().sort_index()
weights = torch.zeros(num_classes, dtype=torch.float32)
for idx, count in class_counts.items():
    weights[idx] = len(train_df) / (num_classes * count)
class_weights = weights.to(device)

# 4. Training Loop
def train_one_epoch(model, dataloader, optimizer, device):
    model.train()
    loss_fn = nn.CrossEntropyLoss(weight=class_weights)
    total_loss = 0.0
    for batch in tqdm(dataloader, desc="Training (Random Split Ablation)"):
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["labels"].to(device)

        optimizer.zero_grad()
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        loss = loss_fn(outputs.logits, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(dataloader)

def eval_model(model, dataloader, device):
    model.eval()
    all_preds, all_labels = [], []
    with torch.no_grad():
        for batch in tqdm(dataloader, desc="Evaluating"):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            preds = torch.argmax(outputs.logits, dim=-1)
            all_preds.extend(preds.cpu().numpy().tolist())
            all_labels.extend(labels.cpu().numpy().tolist())
    return all_labels, all_preds

for epoch in range(EPOCHS):
    print(f"\n================= EPOCH {epoch+1}/{EPOCHS} =================")
    train_loss = train_one_epoch(model, train_loader, optimizer, device)
    print(f"📉 Train loss: {train_loss:.4f}")

    y_true, y_pred = eval_model(model, val_loader, device)
    print("\n📊 Classification Report (Validation):")
    print(classification_report(y_true, y_pred, digits=4, zero_division=0))

print("\n✅ Ablation Study Training complete!")
os.makedirs(SAVE_DIR, exist_ok=True)
model.save_pretrained(SAVE_DIR)
tokenizer.save_pretrained(SAVE_DIR)
