const User = require("../models/User");

const bcrypt = require("bcryptjs"); //CRIPTOGRAFAR A SENHA

module.exports = class AuthController {
  static async login(request, response) {
    return response.render("auth/login");
  }
  static async loginPost(request, response) {
    const { email, password } = request.body;

    const user = await User.findOne({ where: { email: email } });
//Validar email

    if(!user){
      request.flash("message", "Usuário não encontrado");
      response.redirect('/login')
      // return
    }
    //Validar senha
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if(!passwordMatch){
      request.flash("message", "Senha inválida");
      response.redirect('/login')
    }
    //se o usuário está logado
    request.session.userId = user.id;

    request.flash("message", "Autenticação realizado com sucesso");
    request.session.save(() => {
      response.redirect("/");
    });
  }

  static async register(request, response) {
    return response.render("auth/register");
  }
  static async registerPost(request, response) {
    const { name, email, password, confirmpassword } = request.body;

    if (password != confirmpassword) {
      request.flash("message", "As senhas não conferem,tente novamente");
      return response.render("auth/register");
    }

    //VALIDAÇÃO NOME
    // if(name === ''||!name||name.lenght< 3){}
    //VALIDAÇÃO DE EMAIL- VERIFICAR SE JÁ ESTÁ CADASTRADO
    const checkIfUserExist = await User.findOne({ where: { email: email } });
    if (checkIfUserExist) {
      request.flash("message", "O e-mail já está em uso");
      response.render("auth/register");
      return;
    }

    //CRIPTOGRAFAR A SENHA SO USUÁRIO - antes de verificar email
    //criar o rash -padrões de criptografia que não pode ser descriptografados
    const salt = bcrypt.genSaltSync(10);
    //salto sincronizado kkkkkk /sal sincronizado
    const hashedPassword = bcrypt.hashSync(password, salt);

    //CRIAR O OBJ USUÁRIO PARA CADASTRO  NO BANCO
    const user = {
      name,
      email,
      password: hashedPassword,
    };

    //TRY - PARA INSERIR O USER NO BANCO E TRABALHAR COM SESSÃO
    try {
      const createdUser = await User.create(user);
      request.session.userId = createdUser.id;

      request.flash("message", "Cadastro realizado com sucesso");
      request.session.save(() => {
        response.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }
  }
  static async logout(request, response) {
    request.session.destroy();
    response.redirect("/login");
  }

};
