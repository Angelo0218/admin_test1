# Contributing

Thanks for your interest in contributing to `admin_test1`.

## Development setup

```bash
git clone https://github.com/Angelo0218/admin_test1.git
cd admin_test1
pnpm install
pnpm dev
```

## Before opening a PR

Run all checks locally:

```bash
pnpm typecheck    # TypeScript
pnpm build        # production build
pnpm test:mock    # mock + alova end-to-end smoke test
```

CI runs the same three commands on every push / PR.

## Code style

- **Vue components**: PascalCase filenames (`MyComponent.vue`); `<script setup lang="ts">` syntax.
- **TypeScript files**: kebab-case filenames (`my-helper.ts`).
- **Path alias**: use `@/` for `src/`, no deep relative imports (`../../../`).
- **Imports** for `vue`, `vue-router`, `pinia`, Element Plus, Iconify are auto-imported — no need to import manually.
- **i18n**: every UI string must go through `$t(...)`. Add the key to **both** `src/locales/langs/zh-tw.ts` and `src/locales/langs/en-us.ts`.
- **Colours**: use Element Plus CSS variables (`var(--el-color-primary)` etc.), never hardcoded hex.
- **Inline styles**: don't use `style="..."` in templates — write a class instead.
- **Accessibility**: icon-only buttons must have `aria-label` (also i18n-bound).
- **No `console.log` / `any` / `TODO`** committed.

## Project structure

See [README — 專案結構](README.md#專案結構).

## Adding a new menu / route

1. Add route record in `src/router/routes.ts` with `meta.title` (i18n key), `meta.icon` (Iconify name), and optional `meta.roles`.
2. Add the matching `route.<name>` key to both locale files.
3. Create the page under `src/views/<name>/index.vue`.

## Adding a new language

1. Create `src/locales/langs/<lang-code>.ts` mirroring all keys from `zh-tw.ts`.
2. Register it in `src/locales/index.ts` `messages`.
3. Add it to `SUPPORTED_LANGS` in `src/enum/index.ts` with its flag icon name.

## License

By contributing you agree your contributions are licensed under [MIT](LICENSE).
