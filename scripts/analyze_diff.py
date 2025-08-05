import os
import re
import subprocess
import sys

# Get changed files from git diff
def get_changed_files():
    try:
        # Get the base branch from GitHub context
        base_branch = os.environ.get('GITHUB_BASE_REF', 'main')
        
        # Get list of changed files
        result = subprocess.run(
            ['git', 'diff', '--name-only', f'origin/{base_branch}...HEAD'],
            capture_output=True, text=True
        )
        
        if result.returncode == 0:
            files = result.stdout.strip().split('\n')
            return [f for f in files if f and os.path.exists(f)]
        else:
            print(f"Error getting changed files: {result.stderr}")
            return []
    except Exception as e:
        print(f"Error in get_changed_files: {e}")
        return []

# Fallback to common files if git diff fails
FALLBACK_FILES = [
    "src/pages/Register.jsx", 
    "src/pages/Dashboard.jsx", 
    "src/pages/Login.jsx",
    "src/services/api.js"
]

findings = []

def scan_file(filename):
    file_findings = []
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')

        for i, line in enumerate(lines, 1):
            # Check for insecure HTTP URLs
            if re.search(r'http://[^\s\'"]+', line, re.IGNORECASE):
                file_findings.append({
                    "Change Type": "Security Issue",
                    "Details": f"{filename} (line {i}): Insecure HTTP URL detected.",
                    "Risk Level": "High",
                    "Suggestion": "Use HTTPS instead of HTTP to avoid exposing credentials."
                })

            # Check for common typos
            if 'usrename' in line or 'usernmae' in line:
                file_findings.append({
                    "Change Type": "Logical Bug",
                    "Details": f"{filename} (line {i}): Typo in 'username' field.",
                    "Risk Level": "High",
                    "Suggestion": "Fix typo in name mapping to 'username'."
                })

            # Check for console.log in production code
            if 'console.log(' in line and not line.strip().startswith('//'):
                file_findings.append({
                    "Change Type": "Debug Code",
                    "Details": f"{filename} (line {i}): Console.log found in production code.",
                    "Risk Level": "Medium",
                    "Suggestion": "Remove console.log or add proper logging."
                })

            # Check for hardcoded credentials
            if re.search(r'(password|secret|key|token)\s*[:=]\s*[\'"][^\'"]+[\'"]', line, re.IGNORECASE):
                file_findings.append({
                    "Change Type": "Security Issue",
                    "Details": f"{filename} (line {i}): Hardcoded credentials detected.",
                    "Risk Level": "High",
                    "Suggestion": "Use environment variables for sensitive data."
                })

            # Check for potential XSS vulnerabilities
            if 'dangerouslySetInnerHTML' in line:
                file_findings.append({
                    "Change Type": "Security Issue",
                    "Details": f"{filename} (line {i}): Potential XSS vulnerability with dangerouslySetInnerHTML.",
                    "Risk Level": "High",
                    "Suggestion": "Sanitize HTML content before rendering."
                })

            # Check for missing error handling
            if 'fetch(' in line and 'catch' not in content[i:i+10]:
                file_findings.append({
                    "Change Type": "Error Handling",
                    "Details": f"{filename} (line {i}): Fetch call without proper error handling.",
                    "Risk Level": "Medium",
                    "Suggestion": "Add try-catch block around fetch calls."
                })

        findings.extend(file_findings)

    except Exception as e:
        findings.append({
            "Change Type": "File Error",
            "Details": f"{filename}: Error reading file – {e}",
            "Risk Level": "High",
            "Suggestion": "Check if file exists and has correct permissions."
        })

# Get files to scan
files_to_scan = get_changed_files()
if not files_to_scan:
    print("No changed files detected, using fallback files")
    files_to_scan = [f for f in FALLBACK_FILES if os.path.exists(f)]

print(f"Scanning files: {files_to_scan}")

# Scan all target files
for file in files_to_scan:
    if os.path.exists(file):
        scan_file(file)
    else:
        findings.append({
            "Change Type": "Missing File",
            "Details": f"{file} does not exist.",
            "Risk Level": "Medium",
            "Suggestion": "Ensure the file is tracked and committed."
        })

# Generate HTML report
html_content = """<html>
<head>
    <title>Code Review Analysis Report</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin-top: 20px;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background-color: #f8f9fa; 
            font-weight: 600;
            color: #333;
        }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f0f0f0; }
        .risk-high { color: #dc3545; font-weight: bold; }
        .risk-medium { color: #fd7e14; font-weight: bold; }
        .risk-low { color: #28a745; font-weight: bold; }
        .summary {
            background: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .no-issues {
            text-align: center;
            padding: 40px;
            color: #28a745;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Code Review Analysis Report</h1>
        </div>
        <div class="content">"""

# Add summary
total_issues = len(findings)
high_risk = len([f for f in findings if f['Risk Level'] == 'High'])
medium_risk = len([f for f in findings if f['Risk Level'] == 'Medium'])
low_risk = len([f for f in findings if f['Risk Level'] == 'Low'])

html_content += f"""
            <div class="summary">
                <h3>📊 Summary</h3>
                <p><strong>Total Issues Found:</strong> {total_issues}</p>
                <p><strong>High Risk:</strong> <span class="risk-high">{high_risk}</span></p>
                <p><strong>Medium Risk:</strong> <span class="risk-medium">{medium_risk}</span></p>
                <p><strong>Low Risk:</strong> <span class="risk-low">{low_risk}</span></p>
            </div>
"""

if findings:
    html_content += """
            <table>
                <thead>
                    <tr>
                        <th>Issue Type</th>
                        <th>Details</th>
                        <th>Risk Level</th>
                        <th>Recommendation</th>
                    </tr>
                </thead>
                <tbody>
    """
    
    for finding in findings:
        risk_class = f"risk-{finding['Risk Level'].lower()}"
        html_content += f"""
                    <tr>
                        <td>{finding['Change Type']}</td>
                        <td>{finding['Details']}</td>
                        <td class="{risk_class}">{finding['Risk Level']}</td>
                        <td>{finding['Suggestion']}</td>
                    </tr>
        """
    
    html_content += """
                </tbody>
            </table>
    """
else:
    html_content += """
            <div class="no-issues">
                <h3>✅ No Issues Found</h3>
                <p>Great job! No security issues, bugs, or code quality problems were detected.</p>
            </div>
    """

html_content += """
        </div>
    </div>
</body>
</html>
"""

# Write the report
with open("diff.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Analysis complete. Found {len(findings)} issues.")
print(f"High risk: {high_risk}, Medium risk: {medium_risk}, Low risk: {low_risk}")
