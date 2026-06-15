## UI Refresh (Tailwind)

Short note on what changed and how to use it.

### What’s new
- Tailwind is the primary styling layer. We added theme tokens, dark mode, and reusable UI classes.
- Pages refreshed: Navbar, Home (hero + camps), Donor Registration, About Us (team avatars), and Article.
- Hero uses `public/blood_theme.jpg` with an overlay.

### Theming
- Default color theme is rose. Switch by adding one of these classes on `<html>` or `<body>`: `theme-emerald`, `theme-violet`, `theme-ocean`.
- Dark mode: add `dark` class.

### Global utilities (`src/index.css`)
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`
- Cards: `.card`, `.card-hover`
- Forms: styled inputs/selects/textareas, `.field-error`, `.help-text`
- Layout: `.container-app`, `.section`, `.navbar`, `.footer`
- Animations: `.fade-in`, `.slide-up`

### Updated components
- `src/components/Navbar.jsx`: sticky navbar, new “Camps” link.
- `src/components/Home.js`: hero background, cards, and “Upcoming Camps” grid.
- `src/components/DonorForm.js`: card layout with Tailwind form controls.
- `src/components/DonorRegistrationPage.js`: centered header + form.
- `src/components/AboutUs.js`: mission/vision cards, team with gradient initials.
- `src/components/Article.js`: article card and tips as mini-cards.

### Run locally
```bash
cd client
npm install
npm run start
```

### Notes
- Old page-specific CSS for updated pages is no longer required.
- Node 16/18/20 recommended; uses `react-scripts@5`.
