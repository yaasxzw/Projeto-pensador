// const { request } = require("express");
// const { where } = require("sequelize");

const Tought = require("../models/Thought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ToughtController {
  static async showThoughts(request, response) {
    let search = "";
    if (request.query.search) {
      search = request.query.search;
    }
    // console.log(search)
    // ordenação
    let order = "DESC";
    if (request.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order:[['createdAt',order]]
    });

    const toughts = toughtsData.map((result) => result.get({ plain: true })); //pega o array e transformar ele para trabalhar ele - no caso foi pra mostrar as info do user do pensamento
    // console.log(toughts);
    const toughtQty = toughts.length
    return response.render("toughts/home", { toughts, search ,toughtQty});
  }
  static async dashboard(request, response) {
    const userId = request.session.userId;

    //SELECT com join SEQUELIZE
    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });
    if (!user) {
      response.redirect("/login");
    }
    // console.log(user.Thoughts) -pensamentos
    const toughts = user.Thoughts.map((result) => result.dataValues);
    // console.log(toughts)
    let emptyTought = false;
    if (emptyTought.lenght == 0) {
      emptyTought = true;
    }

    return response.render("toughts/dashboard", { toughts, emptyTought });
  }
  static createTought(request, response) {
    return response.render("toughts/create");
  }

  static async createToughtSave(request, response) {
    const tought = {
      title: request.body.title,
      UserId: request.session.userId,
    };
    try {
      await Tought.create(tought);
      request.flash("message", "Pensamento criado com sucesso 🐼");

      request.session.save(() => {
        response.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(`Aconteceu um erro:${error}`);
    }
  }
  static async removeTought(request, response) {
    const id = request.body.id;
    const userId = request.session.userId;
    try {
      await Tought.destroy({ where: { id: id, UserId: userId } });

      request.flash("message", "Pensamento removido com sus");
      request.session.save(() => {
        return response.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(`Erro encontrado: ${error}`);
    }
  }
  static async editTought(request, response) {
    const id = request.params.id;
    const tought = await Tought.findOne({ where: { id: id }, raw: true });
    console.log(tought);

    response.render("toughts/edit", { tought });
  }

  static async editToughtSave(request, response) {
    const { title, id } = request.body;

    try {
      const tought = await Tought.findByPk(id); // procurara pela chave primaria- find by primary key
      if (!tought) {
        return response
          .status(404)
          .json({ message: "Pensament não encontrado" });
      }
      tought.title = title;

      await tought.save();

      request.flash("message", "Pensamento atualizado com sucesso 🐼");
      request.session.save(() => {
        response.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(`Deu erro: ${error}`);
      return response.status(500).json({ message: "Erro interno" });
    }
  }
};
