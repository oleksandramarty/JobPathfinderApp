## 📦 Build and Pack All Libraries

```bash
npm run build:libs
cd dist/amarty
npm run pack:libs
```

---

```bash
npm run build:libs
```

---

## 🌳 Lib Tree

```bash
cd projects/amarty/ &&
tree -I "node_modules" > amarty-tree.txt
```

---

## 🚀 Dev Watch (Individual Libs)

```bash
ng build @amarty/models --watch
```
```bash
ng build @amarty/utils --watch
```
```bash
ng build @amarty/store --watch
```
```bash
ng build @amarty/api --watch
```
```bash
ng build @amarty/animations --watch
```
```bash
ng build @amarty/common --watch
```
```bash
ng build @amarty/dictionaries --watch
```
```bash
ng build @amarty/localizations -- watch
```
```bash
ng build @amarty/services --watch
```
```bash
ng build @amarty/directives --watch
```
```bash
ng build @amarty/pipes --watch
```
```bash
ng build @amarty/components --watch
```
```bash
ng build @amarty/assets --watch
```

---

## 🧩 Install Shared Lib in Host/MFE

```bash
npm install ../Shared/dist/amarty/shared
```

_(or any other required lib from `dist/amarty/`)_

---

## 📚 Build Order (dependency order)

```bash
npm run build:models
```
```bash
npm run build:utils
```
```bash
npm run build:store
```
```bash
npm run build:api
```
```bash
npm run build:animations
```
```bash
npm run build:common
```
```bash
npm run build:dictionaries
```
```bash
npm run build:localizations
```
```bash
npm run build:services
```
```bash
npm run build:directives
```
```bash
npm run build:pipes
```
```bash
npm run build:components
```
```bash
npm run build:assets
```

---

## 📦 Pack Individually

```bash
npm run pack:models
```
```bash
npm run pack:utils
```
```bash
npm run pack:store
```
```bash
npm run pack:api
```
```bash
npm run pack:animations
```
```bash
npm run pack:common
```
```bash
npm run pack:services
```
```bash
npm run pack:dictionaries
```
```bash
npm run pack:localizations
```
```bash
npm run pack:directives
```
```bash
npm run pack:pipes
```
```bash
npm run pack:components
```
```bash
npm run pack:assets
```
