# ClientNest

A responsive starter CRM for freelancers and small businesses. Built with plain HTML, CSS and JavaScript so it can be hosted cheaply and edited from a phone.

## Included features
- Responsive overview dashboard and sidebar navigation
- Client list with statuses, editing, deletion, searching and CSV export
- Lead pipeline with stages and value tracking
- Task management with priority, due dates and completion
- Follow-up reminders and due/overdue labels
- Summary reports
- JSON backup/restore and workspace preferences
- Keyboard quick search (`Ctrl`/`⌘` + `K`)
- Browser-local persistence via `localStorage`

## Deploy frontend with GitHub Pages
1. Upload `index.html`, `styles.css`, `app.js`, and this README to the root of `Ratanpawar77/clientnest-saas`.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then save.
4. After publishing, visit `https://ratanpawar77.github.io/clientnest-saas/`.

## Important production limitation
This version is a functioning frontend prototype, not a hosted multi-user SaaS backend. It stores records only in the current browser using `localStorage`; data does not sync across devices or users and there is no login, hosted database, email delivery, payment processing or server-side access control. Do not use it for sensitive client data until authentication, database rules, backups and privacy/security controls are implemented. GitHub Pages can host these static files but cannot run a persistent Node/Express server. A backend can be added with an easy-to-host service such as Supabase (database/auth) or a Node API deployed to Render/Railway, with secrets stored server-side.
