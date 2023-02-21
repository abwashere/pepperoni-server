# Pepperoni app
API

## Description
This app was created for training purposes.

It is a fake restaurant website that is also used to make/edit reservations, change the menu, and add/edit staff members.


## Getting started
This app has 2 repositories : [Api](https://github.com/abwashere/pepperoni-server),
[Front](https://github.com/abwashere/pepperoni-client).


### 1. Install Dependencies

Use npm to install packages.
```bash
cd pepperoni-server
npm install
```

### 2. Set Environment Variables - server side

Set up those variables in a **`.env`** file before first running the scripts.

PORT = "your-backend-port"

CLIENT_URL = http://localhost:3000

MONGODB_URL = "your-mongo-db-cluster-url" 

NODE_ENV = "dev" 
or 
NODE_ENV = "production" 

If you are part of the project : MONGODB_URL = "mongodb+srv://<username>:<password>@cluster0.ncc59.mongodb.net/pepperoni-db?retryWrites=true&w=majority"

SESSION_SECRET = "some-random-string"

### 3. Launch Server

```bash
npm run dev
```

## Available Scripts

In the project directory, you can run:

#### 1 : `npm run tables`

Generates fake tables (for later booking) in a tables.json file located in the data folder.

Running this command requires running the seeds command below.\
If you want to change tables content manually, do it in the tables.json file and run the seeds command again.

#### 2 : `npm run seeds`

Generates fake users, tables, and the restaurant menu, and saves them in your database.\
The **npm run tables** command has to be run at least one time before.
