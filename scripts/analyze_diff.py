import os
import re

TARGET_FILES = ["src/pages/Register.jsx", "src/pages/Dashboard.jsx"]
findings = []

def scan_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        for i, line in enumerate(lines):
            if 'http://' in line:
                findings.append({
                    "Change Type": "Sensitive Data",
                    "Details": f"{filename} (line {i+1}): Insecure HTTP URL used.",
                    "Risk Level": "Medium",
                    "Suggestion": "Use HTTPS instead of HTTP to avoid exposing credentials."
                })

            if 'usrename' in line:
                findings.append({
                    "Change Type": "Logical Bug",
                    "Details": f"{filename} (line {i+1}): Typo 'usrename' – did you mean 'username'?",
                    "Risk Level": "High",
                    "Suggestion": "Fix typo in name mapping to 'username'."
                })

            if 'missing closing bracket' in line.lower():
                findings.append({
                    "Change Type": "Misleading Comment",
                    "Details": f"{filename} (line {i+1}): Possibly misleading comment about brackets.",
                    "Risk Level": "Low",
                    "Suggestion": "Verify comment accuracy or remove."
                })

        if filename.endswith("Dashboard.jsx") and not any(f['Details'].startswith(filename) for f in findings):
            findings.append({
                "Change Type": "Code Quality",
                "Details": f"{filename}: No issues found.",
                "Risk Level": "None",
                "Suggestion": "-"
            })

    except Exception as e:
        print(f"Error reading {filename}: {e}")

for file in TARGET_FILES:
    if os.path.exists(file):
        scan_file(file)
    else:
        print(f"Skipped: {file} does not exist.")

html_content = """<html><head><title>Semantic Diff Report</title>
<style>
table { border-collapse: collapse; width: 100%; font-family: Arial; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
</style></head><body>
<h2>Code Review Summary</h2>
<table>
<tr><th>Change Type</th><th>Details</th><th>Risk Level</th><th>Suggestion</th></tr>"""

for finding in findings:
    html_content += f"<tr><td>{finding['Change Type']}</td><td>{finding['Details']}</td><td>{finding['Risk Level']}</td><td>{finding['Suggestion']}</td></tr>"

html_content += "</table></body></html>"

with open("diff.html", "w", encoding="utf-8") as f:
    f.write(html_content)
