## Rule: Disable Deletion of Files or Code

**Intent:** Prevent accidental or unsafe deletion of source files, modules, or database entities.

**Copilot Guidance Prompt:**
"If I attempt to delete any code, file, or database table, stop me and explain why deletion should be avoided. Recommend safer alternatives such as feature flags, deprecation, or soft-delete patterns."

**Applies To:**
- File system operations (e.g., `rm`, `unlink`, `localStorage.clear`)
- SQL statements (e.g., `DROP TABLE`, `DELETE FROM`)
- Code removals in pull requests

**Expected Copilot Behavior:**
- Warn the user
- Suggest alternatives
- Refuse to auto-complete destructive commands if safer alternatives exist
