const express = require("express");
const router = express.Router();

//CTODAS AS ROTAS DEPENDEM DE UM CONTROLADOR
//CONTROLLER
const ToughtController = require("../controllers/ToughtController");
//importar milddleware de importação de usuário
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/dashboard",checkAuth, ToughtController.dashboard);
router.get("/add",checkAuth, ToughtController.createTought);
router.post("/add",checkAuth, ToughtController.createToughtSave);
router.get("/", ToughtController.showThoughts);

router.post("/remove",checkAuth,ToughtController.removeTought);

//Vai mostrar o formulario
router.get("/edit/:id",checkAuth,ToughtController.editTought);
//vai editar o comentario
router.post("/edit/",checkAuth,ToughtController.editToughtSave);//id não é necessário,porém funcionou assim




module.exports = router;
