'use strict';

const Controller = require('egg').Controller;

class UserRoleController extends Controller {
    async findAll() {
        const { ctx } = this

        const result = await ctx.model.UserRole.findAll({
            where: {
                enabled: 1
            }
        })

        ctx.status = 200

        if (typeof (result) != 'object') {
            ctx.body = {
                errorMessage: '查询失败',
                errorCode: 1,
            }
        }
        ctx.body = {
            errorMessage: '查询成功',
            errorCode: 0,
            data: result
        }
    }

    async addUserRole() {
        const { ctx } = this
        let {
            roleName,
            roleDiscribe,
            enabled
        } = ctx.request.body

        ctx.status = 200

        if (!roleName) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入权限名称',
            }
            return
        }

        if (!roleDiscribe) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入权限描述',
            }
            return
        }

        enabled = enabled || 1
        const result = await ctx.model.UserRole.create({
            roleName,
            roleDiscribe,
            enabled
        })

        if (typeof (result) != 'object') {
            ctx.body = {
                errorCode: 1,
                errorMessage: '添加权限失败',
            }
            return
        }

        ctx.body = {
            errorMessage: 0,
            errorMessage: '添加权限成功'
        }
    }
}

module.exports = UserRoleController;
