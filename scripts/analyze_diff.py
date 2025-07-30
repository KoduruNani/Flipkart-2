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
    Perform a simple heuristic analysis.
    """
    risk_level = "Low"
    findings = []

    if any(x in diff_text for x in ["DROP", "DELETE", "TRUNCATE", "rm ", "unlink", "localStorage.clear"]):
        findings.append("⚠️ Potential destructive operation found (SQL/File/Storage).")
        risk_level = "High"

    if "eval(" in diff_text or "exec(" in diff_text:
        findings.append("⚠️ Use of unsafe functions like eval/exec.")
        risk_level = "Medium"

    if len(diff_text) > 10000:
        findings.append("⚠️ Large code change detected, may require manual review.")
        risk_level = "Medium"

    return findings, risk_level

if __name__ == "__main__":
    diff = get_git_diff()
    if not diff:
        print("No changes detected.")
        exit(0)

    findings, risk = analyze_diff(diff)
    print("=== Semantic Diff Analysis ===")
    print(f"Risk Level: {risk}")
    print("Findings:")
    for f in findings:
        print(f"- {f}")
    print("\n--- Diff Preview ---")
    print(diff[:2000])
