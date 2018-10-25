'use strict'

module.exports = app => {
    const {
        STRING,
        INTEGER,
        DATE,
    } = app.Sequelize

    const UserRole = app.model.define('UserRole', {
        roleName: {
            type: STRING,
            field: 'role_name',
        },
        roleDiscribe: {
            type: STRING,
            field: 'role_discribe'
        },
        enabled: INTEGER
    }, {
            tableName: 'user_role'
        })
    
    return UserRole
}