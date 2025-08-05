# 🔍 Automated Code Review System

A comprehensive automated code review system that integrates with GitHub Actions to provide detailed analysis of pull requests, including security audits, bug detection, and architectural validation.

## ✨ Features

### 🔒 Security Analysis
- **Insecure HTTP URLs**: Detects `http://` calls that should use HTTPS
- **Hardcoded Credentials**: Identifies API keys, passwords, and tokens in code
- **XSS Vulnerabilities**: Flags unsafe `innerHTML` usage
- **Missing Error Handling**: Detects fetch calls without proper error handling

### 🐛 Bug Detection
- **Common Typos**: Identifies misspellings like `usrename` → `username`
- **Debug Code**: Flags `console.log` statements in production code
- **Logical Errors**: Detects potential runtime issues

### 📊 Quality Assurance
- **ESLint Integration**: Runs comprehensive linting checks
- **Security Audits**: Performs `npm audit` for dependency vulnerabilities
- **File Deletion Tracking**: Monitors dangerous file deletions
- **Risk Assessment**: Categorizes issues by severity (High/Medium/Low)

## 🛠️ Setup

### 1. GitHub Actions Workflow
The workflow file `.github/workflows/pre-review-check.yml` automatically runs on:
- Pull request creation
- Pull request updates
- Pull request reopening

### 2. Analysis Script
The `scripts/analyze_diff.py` script performs semantic analysis on changed files and generates an HTML report.

### 3. Configuration
- **Target Branches**: `main`, `master`, `develop`
- **Timeout**: 15 minutes
- **Artifact Retention**: 7 days

## 📋 How It Works

### 1. **Code Checkout & Setup**
```yaml
- Checkout code with full history
- Setup Python and Node.js environments
- Install dependencies
```

### 2. **Static Analysis**
```yaml
- Run ESLint for code quality
- Perform npm audit for security
- Check for dangerous file deletions
```

### 3. **Semantic Analysis**
```python
# Scans changed files for:
- Security vulnerabilities
- Common bugs and typos
- Code quality issues
- Architectural violations
```

### 4. **Report Generation**
- Creates detailed HTML report (`diff.html`)
- Uploads as GitHub artifact
- Comments on PR with summary
- Blocks PR if high-risk issues found

## 🚨 Risk Levels

### 🔴 High Risk (Blocks PR)
- Insecure HTTP URLs
- Hardcoded credentials
- XSS vulnerabilities
- Critical typos affecting functionality

### 🟡 Medium Risk (Warns)
- Console.log in production
- Missing error handling
- Debug code left in

### 🟢 Low Risk (Info)
- Minor code quality issues
- Non-critical warnings

## 📊 Sample Report

The system generates a professional HTML report with:

```html
📊 Summary
- Total Issues Found: 13
- High Risk: 7
- Medium Risk: 6
- Low Risk: 0

📋 Detailed Issues Table
- Issue Type
- Details with file and line number
- Risk Level
- Recommendation
```

## 🔧 Customization

### Adding New Detection Rules
Edit `scripts/analyze_diff.py` to add new patterns:

```python
# Example: Detect SQL injection
if 'SELECT * FROM' in line and 'user_input' in line:
    file_findings.append({
        "Change Type": "Security Issue",
        "Details": f"{filename} (line {i}): Potential SQL injection",
        "Risk Level": "High",
        "Suggestion": "Use parameterized queries"
    })
```

### Modifying Risk Thresholds
Update the workflow's final gate check:

```yaml
if [ "${{ env.RISK_LEVEL }}" == "High" ] || [ "${{ env.DELETIONS_FOUND }}" == "true" ]; then
  echo "::error::Manual review required"
  exit 1
fi
```

## 🧪 Testing

### Intentional Bugs for Testing
The system includes test files with intentional bugs:

- `src/services/api.js`: Contains multiple security issues
- `src/pages/Login.jsx`: Has insecure HTTP URL
- Various files with console.log statements

### Running Locally
```bash
# Test the analysis script
python scripts/analyze_diff.py

# Check generated report
open diff.html
```

## 📈 Benefits

### For Developers
- **Early Feedback**: Catch issues before code review
- **Consistent Standards**: Automated enforcement of coding standards
- **Learning Tool**: Detailed explanations of issues found

### For Teams
- **Reduced Review Time**: Automated checks reduce manual review burden
- **Quality Assurance**: Consistent code quality across the team
- **Security**: Proactive security vulnerability detection

### For Organizations
- **Compliance**: Automated audit trail for code changes
- **Risk Management**: Prevent high-risk code from reaching production
- **Documentation**: Detailed reports for compliance and training

## 🔄 Integration

### Slack/Teams Notifications
Add to workflow for team notifications:

```yaml
- name: Notify Team
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: "Code review completed for PR #${{ github.event.number }}"
```

### Dashboard Integration
The HTML reports can be integrated into dashboards for:
- Team metrics and trends
- Compliance reporting
- Quality improvement tracking

## 🚀 Next Steps

1. **Deploy the workflow** to your repository
2. **Create a test PR** with intentional bugs
3. **Verify the analysis** catches the issues
4. **Customize rules** for your specific needs
5. **Add team notifications** if desired

## 📞 Support

For issues or questions:
1. Check the workflow logs in GitHub Actions
2. Review the generated HTML report
3. Test locally with `python scripts/analyze_diff.py`

---

**🎯 Goal**: Automated, comprehensive code review that catches issues early and maintains high code quality standards.