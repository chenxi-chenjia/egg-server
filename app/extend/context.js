'use strict';
const Chance = require('chance');
const moment = require('moment');
moment.locale('zh-cn');

let chance = new Chance()

module.exports = {
    get generateSalt() {
        let result = chance.string({ length: 32, pool: 'abcdefghijklmnopqrstuvwxyz0123456789' })
        return result
    },
    get generateOrderNumber() {
        let result = "01" + moment(new Date()).format("YYYYMMDDHHmmss") + chance.integer({ min: 100, max: 999 })
        return result
    },
    get generateInvitationCode() {
        let result = chance.integer({ min: 1000, max: 9999 })
        return result
    },
    get generateAlias() {
        let result = "alias" + moment(new Date()).format("YYYYMMDDHHmmss")
        return result
    },
    get generateTag() {
        let result = "tag" + moment(new Date()).format("YYYYMMDDHHmmss") + chance.string({ length: 2, pool: 'abcdefghijklmnopqrstuvwxyz0123456789' })
        return result
    }
};