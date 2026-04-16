# 🛡️ Software Vulnerability Classification (CWE) via Linguistic Models

![Build Status](https://img.shields.io/badge/Status-Complete-brightgreen.svg)
![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg)
![HuggingFace](https://img.shields.io/badge/Transformers-HuggingFace-FCC624.svg)

> A Recruiter-Ready ML Research Project aimed at detecting, identifying, and mitigating security vulnerabilities (Common Weakness Enumeration - CWE) in source code using advanced Natural Language Processing programming models.

---

## 📖 Project Overview

As modern software complexity scales, zero-day vulnerabilities and hidden security flaws remain critical challenges. This research tackles automated vulnerability identification by treating source code as mathematical sequences, employing state-of-the-art transformer architectures.

We utilize the **Juliet C/C++ Test Suite** to map raw code to its corresponding CWE category, turning a classical cybersecurity auditing task into a large-scale Multi-Class Classification problem.

## ✨ Key Contributions & Features

- **Large-Scale Data Processing**: Curated, preprocessed, and balanced the massive Juliet test dataset into rigorous train/test template splits to prevent data leakage.
- **Advanced Language Models**: Fine-tuned specialized models including **CodeBERT**, **RoBERTa**, and **CodeT5** on semantic code structures to understand vulnerability context.
- **Handling Class Imbalance**: Deployed dynamic **Weighted Training** techniques precisely engineered to tackle imbalanced and under-represented vulnerability classes (e.g., extremely rare CWEs).
- **Extensive Error Analysis**: Comprehensive Code Pattern Analysis, and deep-dive Visualizations mapping out inter-class confusion matrices.

## 📂 Repository Structure

The repository is modularly scoped for readability and scalability.

```text
📦 cwe-vulnerability-classification
 ┣ 📂 notebooks                # Jupyter Notebooks detailing the entire ML pipeline
 ┃ ┣ 📜 02_eda.ipynb             # Exploratory Data Analysis & Statistics
 ┃ ┣ 📜 03_preprocessing.ipynb   # Tokenization & Data Cleansing
 ┃ ┣ 📜 08_template_split.ipynb  # Preventing Leakage via Safe Templating
 ┃ ┣ 📜 11_weighted_training.ipynb # Class Imbalance Strategies
 ┃ ┗ ... (Visuals, Pattern Analysis, Baseline Comparisons)
 ┣ 📂 data                     # (Git-ignored) Juliet Datasets and CSV splits
 ┣ 📂 models                   # (Git-ignored) Local HuggingFace weights & tensors
 ┃ ┣ 📂 baseline_models          # CodeBERT & RoBERTa checks
 ┃ ┣ 📂 codet5_juliet_multiclass # Standard CodeT5 Outputs
 ┃ ┗ 📂 codet5_juliet_weighted   # Weighted-Class Loss CodeT5 
 ┣ 📂 reports                  # Raw metrics, logs, and structural analysis
 ┃ ┣ 📜 classification_report.csv
 ┃ ┗ 📜 cwe_metrics_summary_weighted.csv
 ┗ 📂 docs                     # Original project documentation & plots
 ┗ 📜 README.md
```

## 📈 Methodology

1. **Exploratory Data Analysis (EDA)**: Profiling dataset sparsity, evaluating sequence limits, and capturing feature distribution across the C/C++ inputs.
2. **Train/Test Splicing**: Isolating standard templates to guarantee the models learn implicit semantic bugs rather than memorizing syntactical boilerplates.
3. **Training & Architecture**:
   - Baseline Benchmarking: RoBERTa and CodeBERT to set metric thresholds.
   - Generative & Sequence-to-Sequence Modeling: Utilizing **CodeT5** to interpret the Abstract Syntax and implicit flow of code.
   - Adjusting Loss Functions iteratively to penalize misclassification of high-severity, low-frequency bugs.
4. **Evaluation**: Visualizing confusion limits between conceptually similar anomalies (e.g., Buffer Overflows vs Out-of-Bounds memory allocations).

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RohanBabbar/final_year.git
   cd final_year
   ```

2. **Load Dataset / Models:**
   *Note: Due to Git limits, the massive 1GB+ dataset CSVs within `data/` and large tensors in `models/` are skipped. For local setups, populate the respective local HuggingFace caches and CSV locations manually.*

3. **Explore the Code**: Check out the notebooks locally inside the `notebooks/` directory sequentially.

## 📊 Results Summary

Using the weighted CodeT5 approach substantially boosted our baseline Macro Average Precision for under-represented CWEs by effectively reducing cross-class masking. Extensive classification reports mapping precision, recall, and F1-score dynamics for all classes can be evaluated in `reports/classification_report_updated.csv`.

---
*Created by Rohan Babbar as part of an academic final year engineering project.*
