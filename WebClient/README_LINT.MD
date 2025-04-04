# 📦 Lint & Fix Guide

This project uses [ESLint](https://eslint.org/) with [@angular-eslint](https://github.com/angular-eslint/angular-eslint) and Nx to ensure code quality across all libraries and the host application.

---

## 🧹 Lint All Projects

To check code style and lint all projects at once:

```bash
npm run lint
```

To automatically fix lint issues (where possible) across all projects:

```bash
npm run lint:fix
```

---

## ✅ Lint Individual Projects

You can also lint and fix specific libraries individually:

| Project                | Lint Command                            | Fix Command                                 |
|------------------------|------------------------------------------|---------------------------------------------|
| Host App              | `npm run lint:host-app`                 | `npm run lint:host-app:fix`                 |
| Animations            | `npm run lint:amarty-animations`        | `npm run lint:amarty-animations:fix`        |
| API                   | `npm run lint:amarty-api`               | `npm run lint:amarty-api:fix`               |
| Assets                | `npm run lint:amarty-assets`            | `npm run lint:amarty-assets:fix`            |
| Common                | `npm run lint:amarty-common`            | `npm run lint:amarty-common:fix`            |
| Components            | `npm run lint:amarty-components`        | `npm run lint:amarty-components:fix`        |
| Dictionaries          | `npm run lint:amarty-dictionaries`      | `npm run lint:amarty-dictionaries:fix`      |
| Directives            | `npm run lint:amarty-directives`        | `npm run lint:amarty-directives:fix`        |
| Localizations         | `npm run lint:amarty-localizations`     | `npm run lint:amarty-localizations:fix`     |
| Models                | `npm run lint:amarty-models`            | `npm run lint:amarty-models:fix`            |
| Pipes                 | `npm run lint:amarty-pipes`             | `npm run lint:amarty-pipes:fix`             |
| Services              | `npm run lint:amarty-services`          | `npm run lint:amarty-services:fix`          |
| Store                 | `npm run lint:amarty-store`             | `npm run lint:amarty-store:fix`             |
| Utils                 | `npm run lint:amarty-utils`             | `npm run lint:amarty-utils:fix`             |
