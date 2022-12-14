'use strict';

const Controller = require('egg').Controller;

// 默认头像
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

class UserController extends Controller {
  async register() {
    // app 是全局上下文中的一个属性，config/plugin.js 中挂载的插件，可以通过 app.xxx 获取到，如 app.mysql、app.jwt 等。config/config.default.js 中抛出的属性，可以通过 app.config.xxx 获取到，如 app.config.jwt.secret。
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    // 验证数据库内是否已经有该账户名
    const userInfo = await ctx.service.user.getUserByName(username); // 获取用户信息
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号或密码不能为空',
        data: null,
      };
      return;
    }
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '每天学习',
      avatar: defaultAvatar,
      ctime: new Date(), // + 转换为时间戳
    });
    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }
  async login() {
    // app为全局属性，相当于所有的插件方法都植入到了app对象
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找相应的id操作
    const userInfo = await ctx.service.user.getUserByName(username); // 数据库的userInfo
    // 没找到说明没有该用户
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }
    // 找到用户，判断输入密码和数据库的用户密码是否一致
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null,
      };
      return;
    }
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串，
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // token有效期为24小时
    });
    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        token,
      },
    };
  }
  // 验证token
  async test() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization; // 请求头获取 authorization 属性，值为 token
    // 通过 app.jwt.verify + 加密字符串 解析出 token 的值
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 响应接口
    ctx.body = {
      code: 200,
      message: '获取成功',
      data: {
        ...decode,
      },
    };
  }
}

module.exports = UserController;
