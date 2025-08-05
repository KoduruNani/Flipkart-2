import os
import re

# Configure files to scan (customize as needed)
TARGET_FILES = ["src/pages/Register.jsx", "src/pages/Dashboard.jsx"]

# Store issues
findings = []

# Define issue rules
def scan_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        for i, line in enumerate(lines):
            # Rule 1: Detect insecure http URLs
            if 'http://' in line:
                findings.append({
                    "Change Type": "Sensitive Data",
                    "Details": f"{filename} (line {i+1}): Insecure HTTP URL used.",
                    "Risk Level": "Medium"
                })

            # Rule 2: Detect typo in form mapping
            if 'usrename' in line:
                findings.append({
                    "Change Type": "Logical Bug",
                    "Details": f"{filename} (line {i+1}): Typo 'usrename' – did you mean 'username'?",
                    "Risk Level": "High"
                })

            # Rule 3: Detect misleading bracket comment
            if 'missing closing bracket' in line.lower():
                findings.append({
                    "Change Type": "Misleading Comment",
                    "Details": f"{filename} (line {i+1}): Possibly misleading comment about brackets.",
                    "Risk Level": "Low"
                })

        # Fallback if nothing detected
        if filename.endswith("Dashboard.jsx") and not any(f['Details'].startswith(filename) for f in findings):
            findings.append({
                "Change Type": "Code Quality",
                "Details": f"{filename}: No issues found.",
                "Risk Level": "None"
            })

    except Exception as e:
        print(f"Error reading {filename}: {e}")

# Run scan
for file in TARGET_FILES:
    if os.path.exists(file):
        scan_file(file)
    else:
        print(f"Skipped: {file} does not exist.")

# Generate HTML report
html_content = """<html><head><title>Semantic Diff Report</title></head><body>
<h2>Code Review Summary</h2>
<table border="1" cellpadding="5" cellspacing="0">
<tr><th>Change Type</th><th>Details</th><th>Risk Level</th></tr>"""

for finding in findings:
    html_content += f"<tr><td>{finding['Change Type']}</td><td>{finding['Details']}</td><td>{finding['Risk Level']}</td></tr>"

html_content += "</table></body></html>"

# Save HTML
with open("diff.html", "w", encoding="utf-8") as f:
    f.write(html_content)
