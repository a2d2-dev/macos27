# Contributing

Thanks for helping improve macOS27 Claude. This project is a front-end macOS simulator, so most contributions are React components, app surfaces, state handling, styling, or interaction polish.

## Run Locally

```bash
npm install
npm run dev
```

For the same fixed port used by maintainers:

```bash
npm run dev -- --port 5181
```

Before opening a pull request, run:

```bash
npx tsc --noEmit
```

## Project Structure

- `src/apps/`: app implementations and the app registry.
- `src/apps/<app>/`: per-app React components and app definition exports.
- `src/apps/registry.ts`: imports app definitions, applies window sizing, and exports the ordered `apps` list used by the Dock and launcher flows.
- `src/components/`: desktop shell components such as the Dock, menu bar, windows, boot/login screens, widgets, Spotlight, and Control Center.
- `src/store/`: zustand stores for system, file-system, and window state.
- `src/styles/`: global styles and Liquid Glass styling.
- `src/assets/`: static visual assets.

## Add a New App

1. Create a new folder under `src/apps/<app-id>/`.
2. Export an `AppDefinition` from that folder's `index.tsx` or `index.ts`. The definition should include `id`, `title`, a lucide icon, `iconGradient`, `defaultWindow`, and `Component`.
3. Import the new definition in `src/apps/registry.ts`.
4. Add it to the exported `apps` array. Use the existing `withWindowSizing(app)` helper when the default window should share registry-level sizing overrides.
5. Keep app state local unless it must coordinate with desktop, window, file-system, or system state. Shared behavior should use the zustand stores in `src/store/`.

Use existing apps such as `calculator`, `finder`, `music`, or `notes` as references before adding a new pattern.

## PR Conventions

- Use focused branches such as `feat/calculator-keyboard`, `fix/dock-hover`, or `docs/readme-screenshots`.
- Keep commits small and descriptive. Conventional-style prefixes such as `feat:`, `fix:`, `docs:`, and `chore:` are preferred.
- Do not include build outputs or unrelated formatting churn.
- Include screenshots for visible UI changes.
- Run `npx tsc --noEmit` before submitting.

## Good First Issues

New contributors can start with issues labeled [`good first issue`](https://github.com/a2d2-dev/macos27-claude/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22). These are scoped to one app or interaction and include file hints.
