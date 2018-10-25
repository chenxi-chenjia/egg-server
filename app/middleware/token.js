'use strict'
const Token = require('../../utils/token')

module.exports = (options) => async (ctx, next) => {
    const token = ctx.headers['server-token']
    if (!token) {
        await next()
        return
    }
    if (Token().exportToken(token)) {
        await next()
    } else {
        ctx.status = 200
        ctx.body = {
            errorCode: 2,
            errorMessage: '登录超时，请刷新页面后重新登录',
        }
    }
}