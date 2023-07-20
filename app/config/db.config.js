module.exports = {
    HOST: "127.0.0.1",
    USER: "postgres",
    PASSWORD: "123456",//password de la bd como user root
    DB: "ppbd",//nombre de la bd
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  };