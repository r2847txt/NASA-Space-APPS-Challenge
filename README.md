HABiT — Habitat Interactive Tool

This repository contains a small React + Vite app for interactively designing a habitat layout and evaluating a habitability score. The UI supports English and Spanish and includes a language toggle. The default language is English.

## Contents

- `src/` — application source
- `public/` — static assets (favicon, etc.)
- `package.json` — scripts and dependencies

---

## Quick start (English)

Prerequisites:

- Node.js 18+ (recommended)
- VS Code (optional but recommended)

1) Install dependencies

```bash
npm install
```

2) Run the dev server

```bash
npm run dev
```

3) Open the app in the browser

Vite will print a local URL (usually http://localhost:5173). Open that in your browser.

4) Toggle language

Click the small language button next to the Settings icon in the header to switch between English (EN) and Spanish (ES).

5) Notes

- Saved designs are stored in your browser's localStorage.
- The `STRINGS` dictionary is in `src/App.jsx` for quick editing; if you plan to add more languages I can extract it to separate JSON files.

---

## Tutorial: Run and debug in Visual Studio Code (English)

1) Open the project folder in VS Code:

File → Open Folder → select this repository.

2) Install recommended extensions (optional):

- ESLint
- Tailwind CSS IntelliSense

3) Run the dev server from the built-in terminal:

Terminal → New Terminal

```bash
npm install
npm run dev
```

4) Use the Run and Debug view (optional):

- Create a small launch configuration if you want to attach a browser debugger. Example `launch.json` snippet (Chrome):

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"type": "pwa-chrome",
			"request": "launch",
			"name": "Launch Chrome against localhost",
			"url": "http://localhost:5173",
			"webRoot": "${workspaceFolder}/src"
		}
	]
}
```

5) Inspect console logs and network via the browser DevTools while running.

---

## Instrucciones (Español)

Este repositorio contiene una pequeña aplicación React con Vite para diseñar interactivamente un hábitat y evaluar una puntuación de habitabilidad. La interfaz admite Inglés y Español; el idioma por defecto es Inglés.

### Inicio rápido (Español)

Requisitos:

- Node.js 18+ (recomendado)
- VS Code (opcional pero recomendado)

1) Instalar dependencias

```bash
npm install
```

2) Ejecutar el servidor de desarrollo

```bash
npm run dev
```

3) Abrir la aplicación en el navegador

Vite mostrará una URL local (usualmente http://localhost:5173). Ábrela en el navegador.

4) Alternar idioma

Haz clic en el botón de idioma junto al icono de Configuración en la cabecera para alternar entre English (EN) y Español (ES).

5) Notas

- Los diseños guardados se almacenan en localStorage del navegador.
- El diccionario `STRINGS` está en `src/App.jsx` para edición rápida; si planeas añadir más idiomas puedo extraerlo en archivos JSON separados.

### Tutorial: Ejecutar y depurar en Visual Studio Code (Español)

1) Abrir la carpeta del proyecto en VS Code:

Archivo → Abrir carpeta → selecciona este repositorio.

2) Extensiones recomendadas (opcional):

- ESLint
- Tailwind CSS IntelliSense

3) Ejecutar el servidor desde el terminal integrado:

Terminal → Nuevo Terminal

```bash
npm install
npm run dev
```

4) Usar la vista Ejecutar y Depurar (opcional):

- Agrega una configuración `launch.json` similar a la mostrada arriba para abrir Chrome apuntando a `http://localhost:5173`.

5) Revisa la consola y la pestaña de red en las DevTools del navegador para depuración.

---

If you want, I can also:

- Extract `STRINGS` to language files to make adding languages easier.
- Add a small `tasks.json` to run `npm run dev` from the VS Code Run Task list.
- Move unused assets to `archive/unused/` as discussed earlier.

---

License: MIT (or choose another)

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
