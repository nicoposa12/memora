# Workspace Rules

## Git Workflow Rule
- **Always suggest Git Commit & Push**: Upon completing any feature, fix, or code modification requested by the user, always suggest committing and pushing the changes (providing suggested commit message and git commands).

## Minimalist UI & No Unnecessary Status Indications Rule
- **Strictly Avoid Cluttered Status Indicators**: Never introduce redundant or noisy status pills, flashing live dots, synchronization chips, or badges (e.g., avoid "Live Sync", "LIVE", "ACTIVE", "Live Event", "Presets", or companion pulsing dots) across page headers, cards, navigation items, or breadcrumbs.
- **Pure Minimalism**: Maintain Memora's clean, distraction-free aesthetic. Present essential content and actions directly without decorating headers or cards with obvious or self-evident status labels. Only display status indicators when an item is in an abnormal, non-default, or critical state (e.g., "Archived", "Draft", or "Failed").

## Professional Humanized Copy Rule
- **Always Write Natural, Professional & Humanized Text**: Ensure all user-facing text, labels, button copy, descriptions, confirmations, empty states, and notification modals are written in clear, polished, human English that is easily readable and understandable.
- **Strictly Avoid AI Buzzwords & Pretentious Jargon**: Never use generic AI filler words, cliché marketing fluff, or exaggerated adjective salads (e.g., avoid "haute", "bespoke", "atelier", "seamlessly", "unleash", "delve", "elevate", "celluloid", "privilege" for access, or technical misnomers like "aperture" for photo frames).
- **Clarity, Usability & Minimalism**: Keep copy concise, grounded, transparent, and purposeful. Match Memora's minimalist, premium SaaS aesthetic with natural, authentic tone rather than machine-generated text.

## Zero Sample Data & No Mock Records Rule
- **Strictly Prohibit Injected Mock / Sample Data**: Never add, seed, hardcode, or inject sample, fake, demo, or placeholder records (e.g., sample events, mock users, fake transactions, demo photos, or placeholder customer profiles) anywhere in client-side storage, state, components, or database seeders.
- **Real User Creation Only**: The workspace must rely exclusively on genuine user input and real accounts. If no records exist, always display an intuitive, minimalist empty state with a direct call to action (e.g., "No events created yet — Create an event"), never pre-populated or fallback sample entries.
- **Clean Fallbacks & No Mock Credentials**: Never inject placeholder usernames, hardcoded mock email addresses, sample venues, or demo credentials/autofill buttons into forms, fallbacks, or test helpers.

## Coding Principle
Act like a senior full-stack developer: understand the existing codebase first, reuse what already exists, and only change what is necessary to solve the task. **Seeder-Safety Exception: Never modify, recreate, reset, delete, or run database seeders/migrations that may alter existing data unless I explicitly ask you to do so; if a task requires one, stop and ask for my permission first.** Keep the code clean, simple, secure, maintainable, and production-ready without over-engineering or adding unnecessary code.