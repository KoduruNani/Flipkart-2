import subprocess
import os
import json
import re
from datetime import datetime

def get_git_diff():
    """Return the diff between current HEAD and base branch."""
    base_branch = os.getenv("GITHUB_BASE_REF", "main")
    diff = subprocess.run(
        ["git", "diff", f"origin/{base_branch}...HEAD"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
    )
    return diff.stdout

def parse_diff(diff_text):
    """Parse the diff and extract file, line, change type, and risk."""
    findings = []
    current_file = None
    current_line = 0
    for line in diff_text.splitlines():
        if line.startswith("+++ b/"):
            current_file = line[6:]
        elif line.startswith("@@"):
            m = re.match(r"@@ -\d+,\d+ \+(\d+),", line)
            if m:
                current_line = int(m.group(1))
        elif line.startswith("+") and not line.startswith("+++ "):
            content = line[1:]
            change_type = None
            risk = "Low"
            desc = ""
            if re.search(r"DROP|DELETE|TRUNCATE|rm |unlink|localStorage.clear", content):
                change_type = "Destructive Operation"
                desc = "Potential destructive operation found (SQL/File/Storage)."
                risk = "High"
            elif re.search(r"eval\(|exec\(|Function\(", content):
                change_type = "Unsafe Function"
                desc = "Use of unsafe functions detected."
                risk = "Medium"
            elif re.search(r"password|secret|token|api_key|private_key", content, re.IGNORECASE):
                change_type = "Sensitive Data"
                desc = "Sensitive data found in code."
                risk = "Medium"
            if change_type:
                findings.append({
                    "file": current_file or "-",
                    "line": current_line,
                    "change_type": change_type,
                    "description": desc,
                    "risk_level": risk,
                    "suggestion": "Review this change."
                })
            current_line += 1
    return findings

def parse_lint():
    if not os.path.exists("lint-output.json"):
        return []
    try:
        with open("lint-output.json") as f:
            data = json.load(f)
        issues = []
        for file_result in data:
            file_path = file_result.get("filePath", "-")
            for msg in file_result.get("messages", []):
                issues.append({
                    "file": file_path,
                    "line": msg.get("line", "-"),
                    "message": msg.get("message", "-"),
                    "rule": msg.get("ruleId", "-")
                })
        return issues
    except Exception:
        return []

def parse_audit():
    if not os.path.exists("audit-output.json"):
        return []
    try:
        with open("audit-output.json") as f:
            data = json.load(f)
        issues = []
        advisories = data.get("advisories", {})
        for adv in advisories.values():
            issues.append({
                "package": adv.get("module_name", "-"),
                "vulnerability": adv.get("title", "-"),
                "severity": adv.get("severity", "-"),
                "recommendation": adv.get("recommendation", "-")
            })
        return issues
    except Exception:
        return []

def generate_html(findings, lint_issues, audit_issues):
    now = datetime.now().strftime('%I:%M %p IST, %A, %B %d, %Y')
    html = [
        "<!DOCTYPE html>",
        "<html lang='en'><head><meta charset='UTF-8'><title>Semantic Diff Analysis Report</title>",
        "<style>body{font-family:sans-serif;}table{border-collapse:collapse;width:100%;margin:20px 0;}th,td{border:1px solid #ddd;padding:12px;}th{background:#f5f5f5;}tr:nth-child(even){background:#fafafa;}tr:hover{background:#f0f0f0;}h2{margin-top:2em;} .risk-high{color:#d73a49;font-weight:bold;} .risk-medium{color:#e36209;font-weight:bold;} .risk-low{color:#28a745;font-weight:bold;}</style></head><body>",
        f"<h1>Semantic Diff Analysis Report</h1>",
        "<table><tr><th>Change Type</th><th>Details</th><th>Risk Level</th></tr>"
    ]
    if findings:
        for f in findings:
            html.append(f"<tr><td>{f['change_type']}</td><td>{f['file']} (line {f['line']}): {f['description']}</td><td class='risk-{f['risk_level'].lower()}'>{f['risk_level']}</td></tr>")
    else:
        html.append("<tr><td colspan='3'>No significant findings</td></tr>")
    html.append("</table>")
    html.append("<h2>Lint Report</h2><table><tr><th>File</th><th>Line</th><th>Message</th><th>Rule</th></tr>")
    if lint_issues:
        for l in lint_issues:
            html.append(f"<tr><td>{l['file']}</td><td>{l['line']}</td><td>{l['message']}</td><td>{l['rule']}</td></tr>")
    else:
        html.append("<tr><td colspan='4'>No lint issues</td></tr>")
    html.append("</table>")
    html.append("<h2>Audit Report</h2><table><tr><th>Package</th><th>Vulnerability</th><th>Severity</th><th>Recommendation</th></tr>")
    if audit_issues:
        for a in audit_issues:
            html.append(f"<tr><td>{a['package']}</td><td>{a['vulnerability']}</td><td>{a['severity']}</td><td>{a['recommendation']}</td></tr>")
    else:
        html.append("<tr><td colspan='4'>No audit issues</td></tr>")
    html.append("</table>")
    html.append(f"<p>Report generated on: {now}</p>")
    html.append("</body></html>")
    return '\n'.join(html)

if __name__ == "__main__":
    diff = get_git_diff()
    findings = parse_diff(diff) if diff else []
    lint_issues = parse_lint()
    audit_issues = parse_audit()
    html = generate_html(findings, lint_issues, audit_issues)
    with open("diff.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Analysis complete. Check diff.html for details.")