# Spelling Bee Practice (Vite + React)

This project is a small Spelling Bee practice app built with Vite + React and prepared to use Tailwind CSS and shadcn UI components.

## What's included

- Responsive practice UI (`src/components/SpellingApp.tsx`) with score tracking, difficulty/category filters, audio playback using the Web Speech API, and session dedup (stored in `sessionStorage`).
- Theme toggle (`src/components/ThemeToggle.tsx`) that persists theme in `localStorage`.
- Word data split into 10 JSON files under `src/words/` (200 words total). Add/remove JSON files to change the word pool.
- Tailwind scaffolding (`tailwind.config.cjs`, `postcss.config.cjs`) and updated `src/index.css` with Tailwind directives.

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Start dev server

```powershell
npm run dev
```

## Tailwind & shadcn notes

- Tailwind is already scaffolded (see `tailwind.config.cjs`). If you want to re-initialize Tailwind via CLI, run:

```powershell
npx tailwindcss init -p
```

- To add shadcn UI components (optional), follow the official instructions. Typical flow:

```powershell
# install shadcn UI tool (global/local)
npm install -D @shadcn/ui
# then initialize (this will ask interactive questions)
npx shadcn-ui init
# optionally add individual components
npx shadcn-ui add button
```

After running `npx shadcn-ui init`, follow its prompts and then run the dev server again.

## Developer notes

- Words are loaded via `import.meta.glob('../words/*.json')` so any files you add under `src/words/` will be picked up automatically.
- Session dedup uses `sessionStorage` under key `seen`. To reset, clear session storage or open a new browser tab.
- If you experience issues with missing Tailwind directives in your editor, ensure node modules are installed and your editor picks up PostCSS/Tailwind.

Want me to:

- Add a colorful child-friendly theme and theme presets? (I can implement several theme tokens and a nicer UI.)
- Wire shadcn UI components into the UI (requires running `npx shadcn-ui init` locally).

## Theme presets (kid-friendly)

This project includes a few colorful presets you can select from the header: `Sunny`, `Ocean`, `Forest`, and `Candy`. These correspond to CSS classes applied to the `documentElement`.
