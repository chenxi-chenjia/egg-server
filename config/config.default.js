'use strict';

const Token = require('../utils/token')

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1539417791551_3991';

    // add your config here
    config.cors = {
        //origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        credentials: true
    }

    config.sequelize = {
        dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
        // timestamps: false,
        // freezeTableName: true,
        // underscored: true,
        database: 'server',
        host: 'localhost',
        port: '3306',
        username: 'root',
        password: 'yan37719615',
    };

    config.joi = {
        options: {}, // Joi options [https://github.com/hapijs/joi/blob/v11.0.1/API.md#validatevalue-schema-options-callback]
        locale: {
            'zh-cn': {}
        }
    };

    config.security = {
        csrf: false,
        domainWhiteList: ['localhost:9528'],
    };

    // config.session = {
    //     maxAge: 24 * 3600 * 1000, // ms
    //     key: 'lidengData-session',
    //     httpOnly: false
    // };

    config.userservice = {
        service: {
            async getUser(ctx) {
                // Retrieve your user data from cookie, redis, db, whatever
                // For common web applications using cookie, you may get session id with ctx.cookies
                let token = ctx.headers['server-token']
                if (!token) {
                    return null;
                }

                const tokenData = Token().exportToken(token)
                const userData = tokenData.data
                return { ...userData }
            },

            getUserId(ctx) {
                // The way to get userId
                // eg. return ctx.user && ctx.user.userId
                return ctx.user && ctx.user.userId;
            }
        }
    }


    config.cluster = {
        listen: {
            port: 8010,
            hostname: '0.0.0.0',
        }
    }


    // add your config here
    config.middleware = [
        'token'
    ]

    config.token = {

    }



    return config;
};
