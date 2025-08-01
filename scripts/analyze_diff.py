import subprocess
import os

def get_git_diff():
    """Return the diff between current HEAD and base branch."""
    base_branch = os.getenv("GITHUB_BASE_REF", "main")
    diff = subprocess.run(
        ["git", "diff", f"origin/{base_branch}...HEAD"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
    )
    return diff.stdout

def analyze_diff(diff_text):
    """
    Perform a simple heuristic analysis and generate HTML table.
    """
    with open("diff.html", "w") as f:
        f.write("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>Diff Analysis Report</title>")
        f.write("<style>table { border-collapse: collapse; width: 100%; max-width: 800px; margin: 20px 0; }")
        f.write("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }")
        f.write("th { background-color: #f2f2f2; }")
        f.write("tr:nth-child(even) { background-color: #f9f9f9; }")
        f.write("tr:hover { background-color: #f1f1f1; }")
        f.write("</style></head><body><h2>Semantic Diff Analysis</h2><table>")
        f.write("<tr><th>Change</th><th>Description</th><th>Risk Level</th></tr>")

        risk_level = "Low"
        findings = []

        if any(x in diff_text for x in ["DROP", "DELETE", "TRUNCATE", "rm ", "unlink", "localStorage.clear"]):
            findings.append(("Destructive Operation", "⚠️ Potential destructive operation found (SQL/File/Storage).", "High"))
            risk_level = "High"

        if "eval(" in diff_text or "exec(" in diff_text:
            findings.append(("Unsafe Function", "⚠️ Use of unsafe functions like eval/exec.", "Medium"))
            risk_level = "Medium"

        if len(diff_text) > 10000:
            findings.append(("Large Change", "⚠️ Large code change detected, may require manual review.", "Medium"))
            risk_level = "Medium"

        for change, desc, risk in findings:
            f.write(f"<tr><td>{change}</td><td>{desc}</td><td>{risk}</td></tr>")

        f.write(f"<tr><td>Overall Risk</td><td></td><td>{risk_level}</td></tr>")
        f.write("</table><p>If risk is High, request manual review before merging.</p></body></html>")

    return findings, risk_level

if __name__ == "__main__":
    diff = get_git_diff()
    if not diff:
        with open("diff.html", "w") as f:
            f.write("<!DOCTYPE html><html><body><p>No changes detected.</p></body></html>")
        exit(0)

    findings, risk = analyze_diff(diff)
    print("Analysis complete. Check diff.html for details.")