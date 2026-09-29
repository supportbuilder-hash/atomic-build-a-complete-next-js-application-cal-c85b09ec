# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
Build a complete Next.js application called "TeamBoard", a collaborative project management application.

Implement:

* Sign up
* Login
* Logout
* Forgot password
* Reset password
* Protected dashboard
* User profile

The application should have:

* Projects
* Tasks
* Team members
* Comments
* Activity feed

Requirements:

* Unauthenticated users must be redirected to /login when accessing protected pages.
* Authenticated users must not be shown the login page when already logged in.
* Persist authentication state across page refreshes.
* Add form validation for all authentication forms.
* Show loading states while authentication is being checked.
* Show proper error messages for invalid credentials.
* Project pages should use dynamic routes.
* Users should be able to create, edit, delete, and complete tasks.
* Add task status: Todo, In Progress, Review, Done.
* Add task priority: Low, Medium, High, Urgent.
* Add filters and search.
* Make the UI responsive.
* Structure the code so authentication logic is separated from UI components.
* Use mock authentication/data if a backend is unavailable, but keep the architecture ready for a real API.

## Goal
Build TeamBoard, a collaborative project management app with mock authentication (signup, login, logout, forgot/reset password), a protected dashboard, and project/task/team/comment/activity data structures, using a corporate-clean design system.

## Project type
saas-app

## Design system — match this exactly
- Color tokens: `--foreground: 240 10% 3.9%`, `--card: 0 0% 100%`, `--border: 240 5.9% 90%`, `--muted-foreground: 240 3.8% 46.1%`, `--accent: #F5A524`, `--primary: #3730E0`, `--background: #F6F7FB`
- Fonts: Plus_Jakarta_Sans

## Existing components — reuse these, don't create near-duplicates
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`footer`, `home`, `nav`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.
