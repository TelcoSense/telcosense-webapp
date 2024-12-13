# telcorain-webapp

Web app for raingrid and temperature map visualization.

## Backend

```bash
cd api
# Preparing the environment
python3 -m venv .venv
. .venv/bin/activate
# if using fish run this instead
. .venv/bin/activate.fish

pip install python-dotenv
pip install Flask
pip install flask-cors
pip install mariadb

# if pointer error run this instead
CFLAGS="-Wno-error=incompatible-pointer-types" pip install mariadb
```

create a .env file with your credentials, host ip and the jwt secret key

```
MARIADB_USER=username
MARIADB_PASSWD=password
MARIADB_HOST=128.0.0.1
JWT_SECRET_KEY=jwtsecret
```

```bash
# Run the app
# VPN connection is required
# Don't forget to activate venv if not active
flask --app api run
```

## Frontend

```bash
cd frontend
# Install dependencies
bun install
# Run the app
bun run dev
```

create a config.ts file in the src/ directory

```typescript
// the url shouldn't have a '/' at the end
export const API_HOST_URL: string = "https://YOUR_URL";
```
