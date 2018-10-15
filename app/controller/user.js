'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    async passwordLogin() {
        //用户名密码登陆，可以使用 电话 邮箱 用户名登陆
        const { ctx } = this
        const {
            username,
            password
        } = this.requset.body

        ctx.status = 200

        if (!username) {
            //判断用户名是否为空
            ctx.body = {
                errorCode: 1,
                errorMessage: '用户名不能为空',
                data: {}
            }
            return
        }

        if (!password) {
            // 判断密码是否为空
            ctx.box = {
                errorCode: 1,
                errorMessage: '密码不能为空',
                data: {}
            }
            return
        }

        const result = await ctx.model.User.findUserByName(username)

        if (result.length <= 0) {
            // 判断是否可以查到次用户
            ctx.body = {
                errorCode: 1,
                errorMessage: '无此用户名',
                data:{}
            }
            return
        } else if (result.length > 1) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '登陆失败，请稍后重试或联系管理员',
                data:{}
            }
            return
        }

        const salt = result[0]



    }
}

module.exports = UserController;