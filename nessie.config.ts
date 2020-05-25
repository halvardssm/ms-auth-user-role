const configPg = {
  migrationFolder: `./db/migrations`,
  connection: {
    database: "ms-auth",
    hostname: "localhost",
    port: 5000,
    user: "root",
    password: "pwd",
  },
  dialect: "pg",
};

export default configPg;
