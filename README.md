# River
WooHack '25

## Setting Up

To manage dependencies, Python uses virtual environments to prevent packages from being installed globally.

### Windows (PowerShell)

1. Within nextjs-flask folder: If necessary, install virtualenv with ```pip install virtualenv```
2. Create a virtual environment with ```py -3 -m venv .venv```
3. Activate using ```.venv\bin\activate\```
4. Install Flask with ```pip install flask```
5. Install dependencies ```npm install```

### Mac OSX / Linux / WSL

1. Within nextjs-flask folder: If necessary, install virtualenv with ```sudo apt-get install virtualenv```
2. Create a virtual environment with ```python3 -m venv .venv```
3. Activate using ```source .venv/bin/activate```
4. Install Flask with ```pip install flask```
5. Install dependencies ```npm install```

## Testing

```npm run dev``` starts the server on ```localhost:3000```.
