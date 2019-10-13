module.exports = {
  development: {
    username: 'postgres',
    password: 'admin',
    database: 'vxtel',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: {
      freezeTableName: true
    }
  },
  test: {
    username: 'postgres',
    password: 'admin',
    database: 'vxtel',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: null,
    define: {
      freezeTableName: true
    }
  },
  production: process.env.DATABASE_URL
};
