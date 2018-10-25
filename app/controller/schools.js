'use strict';

const Controller = require('egg').Controller;

class SchoolsController extends Controller {
    async findAll() {
        const { ctx } = this

        const result = await ctx.model.Schools.findAll({
            where: {
                status: 1
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

    async addSchool() {
        const { ctx } = this
        let {
            schoolName,
            schoolDiscribe,
            status
        } = ctx.request.body

        ctx.status = 200

        if (!schoolName) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入学校英文名称',
            }
            return
        }

        if (!schoolDiscribe) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入学校中文名称',
            }
            return
        }

        status = status || 1
        const result = await ctx.model.Schools.create({
            schoolName,
            schoolDiscribe,
            status
        })

        if (typeof (result) != 'object') {
            ctx.body = {
                errorCode: 1,
                errorMessage: '添加学校失败',
            }
            return
        }

        ctx.body = {
            errorMessage: 0,
            errorMessage: '添加学校成功'
        }
    }
}

module.exports = SchoolsController;
