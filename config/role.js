'use strict'
const Token = require('../utils/token')

module.exports = app => {
    app.role.use('login', ctx => {
        const token = ctx.headers['server-token']
        return token ? true : false
    })

    app.role.use('admin', ctx => {
        const token = ctx.headers['server-token']
        if (!token) {
            return false
        }
        const tokenData = Token().exportToken(token)
        const { data } = tokenData
        return data.userRoleName == '123' ? true : false
    })
}