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
    Can be extended with LLM API (OpenAI/GPT).
    """
    risk_level = "Low"
    findings = []

    if "DROP" in diff_text or "DELETE" in diff_text:
        findings.append("⚠️ Potential database destructive operations found.")
        risk_level = "High"

    if "eval(" in diff_text or "exec(" in diff_text:
        findings.append("⚠️ Use of unsafe functions like eval/exec.")
        risk_level = "Medium"

    if len(diff_text) > 10000:
        findings.append("Large code change detected, potential refactor risk.")
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
    print(diff[:2000])  # Print first 2000 chars of diff
