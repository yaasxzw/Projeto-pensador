//importar pacotes
const express = require("express");
const exhbs = require("express-handlebars");
const session = require("express-session"); //session do user
const FileStore = require("session-file-store")(session); //armazenar a session
const flash = require("express-flash");

const app = express();
//conexão
const conn = require("./db/conn");

//IMPORT Models
const User = require("./models/User");
const Thought = require("./models/Thought");

//IMPORT Rotas
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRouters = require('./routes/authRouters')

//IMPORT Controller
const ToughtController = require("./controllers/ToughtController");
//CONFIGURAR A ENGINE
app.engine("handlebars", exhbs.engine());
app.set("view engine", "handlebars");

//CONFIGURAR JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//MILDDLEWARW PARA SESSÕES
app.use(
  session({
    //obj json,q é de config
    name: "session",
    secret: "nosso_secret", //QUANTO MAIOR A CRYPTO MELHOR
    resave: false, //salvar novamente
    saveUninitialized: false, //tempo limite que vai ficar logado
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"), //pasta que vai armazenar as sessões,o tmpdir é a pasta temporaria de sessões
    }),
    cookie: {
      //obj de config
      secure: false, //ainda não sera config
      maxAge: 360000, //tempo limite para está logado na cofig
      expires: new Date(Date.now() + 360000), //determina depois de quanto tempo o login irá expirar
      httpOnly: true, //para aquisição de empréstimo de servidores
    },
  })
);

//IMPORTAR AS FLASH
app.use(flash());

//IMPORTAR OS ARQUIVOS ESTÁTICOS
app.use(express.static("public"));

//ARMAZENAR AS SESSÕES NAS ROTAS

//vaai criar um middleware que quando o user for fazer algum registro na aplicação seja registrado,esse middleware vai abstrair esses contextos
app.use((request, response, next) => {
  if (request.session.userId) {
    response.locals.session = request.session;
  }
  next();
});

//ROTAS DA APLICAÇÃO
app.use("/toughts", toughtsRoutes);
//MILDDLEWARE DAS ROTAS
app.use("/", authRouters)

app.get("/", ToughtController.showThoughts);//home


//CONEXÃO E CRIAÇÃO DAS TABELAS DO BANCO
conn
  .sync()
  .then(() => {
    app.listen(3333);
  })
  .catch((err) => console.log(err));
