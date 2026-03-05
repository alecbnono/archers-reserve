# archers-reserve


# Contents of this project
- [Used Technologies](#used-technologies)
- [Postgresql Setup](#postgresql-download-if-not-downloaded-yet-(windows))
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
```
cd server
```

```
npm install express sequelize pg cors nodemon dotenv
```

```
npm install -D typescript @types/node @types/express @types/pg @types/cors ts-node nodemon
```

## Make a .env file and copy paste this
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



