'use strict'

module.exports = app => {
    const {
        STRING,
        INTEGER,
        DATE,
    } = app.Sequelize

    const Schools = app.model.define('Schools', {
        schoolName: {
            type: STRING,
            field: 'school_name',
        },
        schoolDiscribe: {
            type: STRING,
            field: 'school_discribe'
        },
        status: INTEGER
    }, {
            tableName: 'schools'
        })

    return Schools
}