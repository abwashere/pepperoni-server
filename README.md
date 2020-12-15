# Pepperoni App (Back-End)

## Getting started

### 1. Install Dependencies

### 2. Set Environment Variables

Set up those variables in a .env file before first running the scripts.

- PORT = your-backend-localhost-url

- CLIENT_URL = http://localhost:3000

- MONGODB_URL = your-mongo-db-cluster-url

- SESSION_SECRET = "your_secret_session_string"

### 3. Launch Server

#### `npm run dev`

## Available Scripts

In the project directory, you can run:

#### 1 : `npm run tables`

Generates fake tables (for later booking) in a tables.json file located in the data folder.

Running this command requires running the seeds command below.\
If you want to change tables content manually, do it in the tables.json file and run the seeds command again.

#### 2 : `npm run seeds`

Generates fake users, tables, and the restaurant menu, and saves them in your database.\
The **npm run tables** command has to be run at least one time before.
