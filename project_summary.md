# Project Summary: Software Vulnerability Classification (CWE)

**Objective:** Developing a state-of-the-art ML pipeline to detect and classify security vulnerabilities in source code (Juliet C/C++ Test Suite) using Transformer-based linguistic models.

---

## Phase 1: Core ML Pipeline (Foundational Work)
*Established the baseline infrastructure and verified the feasibility of the classification task.*

1.  **Dataset Extraction**: Sourcing and consolidating the Juliet C/C++ Test Suite, encompassing thousands of labeled vulnerability instances.
2.  **Code Preprocessing**: Implementation of normalization routines to clean source code while preserving semantic structure.
3.  **Template Identification**: A critical architectural step where code samples were grouped by structural "templates" to identify overlapping logic.
4.  **Template-Aware Train-Test Split**: Implemented a rigorous split strategy ensuring that specific code templates in the test set were entirely unseen during training, preventing data leakage and ensuring true model generalization.
5.  **Label Encoding**: Mapping complex CWE identifiers to a numerical format suitable for multi-class classification.
6.  **Tokenization**: Utilizing specialized tokenizers (CodeBERT/CodeT5) to convert raw code into high-dimensional vector representations.
7.  **Model Training**: Initial fine-tuning of baseline models (RoBERTa, CodeBERT) and the proposed CodeT5 architecture.
8.  **Initial Evaluation**: Establishing baseline performance metrics (Accuracy, Precision, Recall, and F1-score).

---

## Phase 2: Advanced Research & Optimization
*Addressing mentor feedback and optimizing the model for production-grade robustness.*

1.  **Weighted Training Strategies**:
    *   **Problem**: Significant class imbalance in the Juliet dataset (some CWEs have thousands of samples, others have <50).
    *   **Solution**: Engineered a custom Weighted Cross-Entropy Loss to penalize misclassifications of rare but critical vulnerability classes, substantially improving Macro-F1 scores.

2.  **Comparative Model Benchmarking**:
    *   **Performance vs. Efficiency**: Proved that **CodeT5-small (~60M params)** outperforms or matches **CodeBERT (~125M params)** while being 50% smaller and 30% faster to train.
    *   **Metric Achievement**: Achieved a final Accuracy of **0.9984** and Weighted F1 of **0.9984**.

3.  **Data Leakage & Split Validation**:
    *   Performed an empirical comparison between **Random Splits** and **Template Splits**.
    *   Demonstrated that Random Splits provide "artificially high" metrics by allowing the model to memorize templates, justifying the necessity of Phase 1's Template-Aware approach.

4.  **Deep Linguistic & Error Analysis**:
    *   **Confusion Analysis**: Identified "Critical Confusions" (e.g., Buffer Overflows vs. Out-of-Bounds memory) and mapped them to specific code patterns.
    *   **Pattern Extraction**: Identified top linguistic features that drive the model’s decision-making process for different vulnerability types.

5.  **Reporting & Visualization**:
    *   Generated high-fidelity confusion matrices and precision-recall dynamics for the final project documentation.
    *   Consolidated all metrics into structured CSVs (e.g., `classification_report_updated.csv`) for transparency and peer review.

---
