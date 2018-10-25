'use strict'

module.exports = app => {
    const {
        STRING,
        INTEGER,
        DATE,
    } = app.Sequelize

    const Teachers = app.model.define('Teacher', {
        roleId: {
            type: INTEGER,
            field: 'role_id'
        },
        username: STRING,
        password: STRING,
        name: STRING,
        avatar: STRING,
        address: STRING,
        phoneNumber: {
            type: STRING,
            field: 'phone_number'
        },
        email: STRING,
        salt: STRING,
        state: INTEGER,
        delFlg: {
            type: INTEGER,
            field: 'del_flg'
        },
        schoolId: {
            type: STRING,
            field: 'school_id'
        },
        updatedAt: {
            type: DATE,
            field: 'updated_at'
        }
    }, {
            tableName: 'teachers'
        })

    // 通过搜索条件查找用户
    Teachers.findUserBySearchContent = ({ searchContent, limit, limitStart, }) => {
        const limSql = limit ? `LIMIT :limitStart,:limit ` : ''
        const searchSql = searchContent ?
            `AND t.username = :searchContent OR 
        t.phone_number = :searchContent OR
        t.name = :searchContent OR
        t.email = :searchContent` : ''

        return Teachers.sequelize.query(
            `SELECT 
            t.id AS userId,
            t.role_id as roleId,
            t.school_id as schoolId,
            t.username as username,
            t.password as password,
            t.name as name,
            t.avatar as avatar,
            t.address as address,
            t.phone_number as phoneNumber,
            t.email as email,
            t.remark as remark,
            t.salt as salt,
            t.state as state,
            t.del_flg as delFlg,
            t.updated_at as updatedAt,
            t.created_at as createdAt,
            ur.role_name as roleName,
            ur.role_discribe as roleDiscribe,
            s.school_name as schoolName,
            s.school_discribe as schoolDiscribe
            FROM teachers t 
            LEFT JOIN user_role ur ON ur.id = t.role_id AND ur.enabled = 1
            LEFT JOIN schools s ON s.id = t.school_id AND s.status = 1 
            WHERE (
                t.state = 1 AND
                t.del_flg = 1
                ${searchSql}
            )
            ${limSql}
            `, {
                replacements: {
                    searchContent,
                    limitStart: parseInt(limitStart),
                    limit: parseInt(limit),
                },
                type: Teachers.sequelize.QueryTypes.SELECT
            }

        )
    }

    Teachers.findUserById = (userId) => {
        return Teachers.sequelize.query(
            `SELECT t.id AS userId,
            t.role_id as roleId,
            t.school_id as schoolId,
            t.username as username,
            t.password as password,
            t.name as name,
            t.avatar as avatar,
            t.address as address,
            t.phone_number as phoneNumber,
            t.email as email,
            t.remark as remark,
            t.salt as salt,
            t.state as state,
            t.del_flg as delFlg,
            t.updated_at as updatedAt,
            t.created_at as createdAt,
            ur.role_name as roleName,
            ur.role_discribe as roleDiscribe,
            s.school_name as schoolName,
            s.school_discribe as schoolDiscribe
            FROM teachers t
            LEFT JOIN user_role ur ON ur.id = t.role_id AND ur.enabled = 1
            LEFT JOIN schools s ON s.id = t.school_id AND s.status = 1
            WHERE (
                t.state = 1 AND
                t.del_flg = 1 AND
                t.id = :userId
            )`, {
                replacements: {
                    userId,
                },
                type: Teachers.sequelize.QueryTypes.SELECT
            }
        )
    }

    // 获取查找的用户数量个数
    Teachers.findBySearchContentCount = (searchContent) => {

        const searchSql = searchContent ?
            `AND t.username = :searchContent OR 
        t.phone_number = :searchContent OR
        t.name = :searchContent OR
        t.email = :searchContent` : ''

        return Teachers.sequelize.query(
            `SELECT COUNT(*) FROM(
                SELECT
                t.id AS userId,
                t.role_id as roleId,
                t.school_id as schoolId,
                t.username as username,
                t.password as password,
                t.name as name,
                t.avatar as avatar,
                t.address as address,
                t.phone_number as phoneNumber,
                t.email as email,
                t.remark as remark,
                t.salt as salt,
                t.state as state,
                t.del_flg as delFlg,
                t.updated_at as updatedAt,
                t.created_at as createdAt,
                ur.role_name as roleName,
                ur.role_discribe as roleDiscribe,
                s.school_name as schoolName,
                s.school_discribe as schoolDiscribe
                FROM teachers t
                LEFT JOIN user_role ur ON ur.id = t.role_id AND ur.enabled = 1
                LEFT JOIN schools s ON s.id = t.school_id AND s.status = 1
                WHERE (
                    t.state = 1 AND
                    t.del_flg = 1 
                    ${searchSql}
                )
            )t` , {
                replacements: {
                    searchContent,
                },
                type: Teachers.sequelize.QueryTypes.SELECT
            }
        )
    }

    // 判断是否存在电话
    Teachers.findByPhoneNumberCount = (phoneNumber) => {
        return Teachers.sequelize.query(
            `SELECT COUNT(*) FROM(
                SELECT * FROM teachers t WHERE t.phone_number = :phoneNumber
            )t`, {
                replacements: {
                    phoneNumber,
                },
                type: Teachers.sequelize.QueryTypes.SELECT
            }
        )
    }

    // 判断是否存在邮箱
    Teachers.findByEmailCount = (email) => {
        return Teachers.sequelize.query(
            `SELECT COUNT(*) FROM(
                SELECT * FROM teachers t WHERE t.email = :email
            )t`, {
                replacements: {
                    email,
                },
                type: Teachers.sequelize.QueryTypes.SELECT
            }
        )
    }

    // 判断是否存在用户名
    Teachers.findByUsernameCount = (username) => {
        return Teachers.sequelize.query(
            `SELECT COUNT(*) FROM(
                SELECT * FROM teachers t WHERE t.username = :username
            )t`, {
                replacements: {
                    username,
                },
                type: Teachers.sequelize.QueryTypes.SELECT
            }
        )
    }




    return Teachers
}