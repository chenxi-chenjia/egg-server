'use strict'
const jwt = require('jsonwebtoken')

module.exports = () => {
    const sgin = 'shhhhh'
    const exp = Math.floor(Date.now() / 1000 + (60 * 60))
    return {
        generateToken(data) {
            return jwt.sign({
                exp: exp,
                data,
            }, sgin)
        },
        exportToken(token) {
            try {
                return jwt.verify(token, sgin)
            } catch (e) {
                return false
            }
        }
    }

}
