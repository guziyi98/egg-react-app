'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    const { app } = this;
    const QUERY_STR = 'id, name';
    const sql = `select ${QUERY_STR} from list`; // 获取id的sql语句
    try {
      const result = await app.mysql.query(sql); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
    // 假设从数据库获取的用户信息
    // return {
    //   name: '张三',
    //   title: '张三是帅哥',
    // };
  }
  async addUser(name) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('list', { name }); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async editUser(id, name) {
    const { app } = this;
    try {
      const result = await app.mysql.update('list', { name }, {
        where: {
          id,
        },
      }); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async deleteUser(id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('list', { id }); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = HomeService;
