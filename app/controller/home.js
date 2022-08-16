'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // const { id } = this.ctx.query;
    // ctx.body = id;
    // ctx.render 默认会去 view 文件夹寻找 index.html，这是 Egg 约定好的。
    await ctx.render('index.html', {
      title: '我是gzy', // 将 title 传入 index.html
    });
  }
  async user() {
    const { ctx } = this;
    const res = await ctx.service.home.user();
    ctx.body = res;
  }
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    ctx.body = {
      title,
    };
  }
  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      const res = await ctx.service.home.addUser(name);
      console.log(res);
      // return res;
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '添加失败',
        data: null,
      };
      console.log(err);
    }
  }
  async editUser() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    try {
      const res = await ctx.service.home.editUser(id, name);
      console.log(res);
      // return res;
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '添加失败',
        data: null,
      };
      console.log(err);
    }
  }
  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const res = await ctx.service.home.deleteUser(id);
      console.log(res);
      // return res;
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null,
      };
      console.log(err);
    }
  }
}

module.exports = HomeController;
