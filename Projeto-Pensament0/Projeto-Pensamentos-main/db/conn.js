const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pensador", "aluno_medio", "@lunoSenai23.", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
});
try {
  sequelize.authenticate();
  console.log("CONECTADO MOROU AO MYSQL");
} catch (error) {
  console.log(` ERRO AO CONECTAR ${error}`);
}
module.exports = sequelize;
