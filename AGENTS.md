# Neon workflow

This project is linked to Neon through `.neon`. Use the Neon CLI for project and database operations when it is available.

- At the start of a feature, create or select a matching Neon branch with `neon checkout <branch-name>` alongside `git checkout -b <branch-name>`.
- Prefer project-scoped API keys for automation: `neon api-keys create --project-id <project-id>`.
- Review schema changes with `neon diff` before merging them.
- Use `neon inspect db` for read-only database diagnostics.
- Keep database credentials in environment files or the platform secret store. Never commit credentials.
- Install or refresh the Neon agent skills with `neon skills` or `neon skills update`.

The repository currently uses Neon packages and has a linked Neon project. Check the existing runtime and schema before changing database architecture.
