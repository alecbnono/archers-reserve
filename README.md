# archers-reserve


# Contents of this project
- [Used Technologies](#used-technologies)
- [Postgresql Setup](#postgresql-download-if-not-downloaded-yet-windows)
- [Running the backend](#running-the-backend)


## Used Technologies
- ### frontend
    - React w/ Routers
    - TailwindCSS
    - TypeScript
- ### backend
    - Typescript
    - PostgreSQL
    - Express

## PostgreSQL download if not downloaded yet (windows)
- [Return to top](#archers-reserve)
```
https://www.postgresql.org/download/
```

1. After downloading go to C:Program Files and look for PostgreSQL
2. Go inside the PostGreSQL folder and look for bin folder
3. Go inside the bin folder and copy the file path
4. Open Environment Variables
5. Select PATH then click Edit
6. Click New then paste address of the bin folder
7. Click ok and finish

## Dependancies for PostGresq setup
- [Return to top](#archers-reserve)
1. switch directories to server
```
cd server
```
2. copy paste into terminal
```
npm install express sequelize pg cors nodemon dotenv
```

```
npm install -D typescript @types/node @types/express @types/pg @types/cors ts-node nodemon
```

3. Make a .env file, copy paste, and edit
```
POSTGRESQL_PORT= 5432 or whichever port you used during download
DB_USER   = postgres
DB_PASS   = *replace_with_your_password*
DB_NAME   = *replace_with_DB_name*
DB_HOST   = localhost
```


## Running the backend
- [Return to top](#archers-reserve)
```
cd server
```

```
npm run dev
```


## Using Jest for Unit Tests
- [Return to top](#archers-reserve)

### Set up packages if not yet installed
1. switch to client and use npm install 

```
npm i --save-dev jest @types/jest ts-jest jest-environment-jsdom @testing-library/react
```
2. switch to server and use npm install
```
npm i --save-dev jest @types/jest ts-jest supertest
```
if an error shows looking for funding use
```
npm audit fix
```

### Using cmd to use Jest
Using either client or server input
```
npm run test
```

