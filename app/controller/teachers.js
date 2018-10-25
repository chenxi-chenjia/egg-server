'use strict';
const Crypto = require('crypto')
const Token = require('../../utils/token')

const Controller = require('egg').Controller

class UserController extends Controller {

    // 通过用户名 邮箱 手机号 密码登录
    async teacherPasswordLogin() {
        //教师用户名密码登陆，可以使用 电话 邮箱 用户名登陆
        const { ctx } = this
        const {
            username,
            password
        } = ctx.request.body

        ctx.status = 200

        if (!username) {
            //判断用户名是否为空
            ctx.body = {
                errorCode: 1,
                errorMessage: '用户名不能为空',
                data: {}
            }
            return
        }

        if (!password) {
            // 判断密码是否为空
            ctx.box = {
                errorCode: 1,
                errorMessage: '密码不能为空',
                data: {}
            }
            return
        }

        const result = await ctx.model.Teachers.findUserBySearchContent({ searchContent: username })

        if (result.length <= 0) {
            // 判断是否可以查到次用户
            ctx.body = {
                errorCode: 1,
                errorMessage: '无此用户名',
                data: {}
            }
            return
        } else if (result.length > 1) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '登陆失败，请稍后重试或联系管理员',
                data: {}
            }
            return
        }

        const salt = result[0].salt
        const md5password = Crypto.createHash('md5').update(`${password}:${salt}`).digest('hex')

        if (md5password == result[0].password) {
            const userId = result[0].userId
            const userRoleName = result[0].roleName
            const userRoleId = result[0].roleId
            const token = Token().generateToken({
                userId,
                userRoleId,
                userRoleName,
            })
            ctx.body = {
                errorCode: 0,
                errorMessage: "登录成功",
                data: {
                    token,
                }
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: "用户名密码错误",
                data: {}
            }
        }
    }

    // 获取用户信息
    async getTeacherInfo() {
        //获取员工个人信息
        const { ctx } = this
        const {
            userId,
            roleId
        } = ctx
        ctx.status = 200
        const userResutl = await ctx.model.Teachers.findUserById(userId)
        if (userResutl.length < 1) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '未查到用户，请联系管理员'
            }
            return
        }
        ctx.body = {
            errorMessage: '查找成功',
            errorCode: 0,
            data: {
                ...userResutl[0],
                roles: [userResutl[0].roleName]
            }
        }
    }

    // 管理员查询用户信息 
    async getTeacherInfoById() {
        const { ctx } = this
        const {
            userId,
        } = ctx.request.query
        ctx.status = 200
        const userResutl = await ctx.model.Teachers.findUserById(userId)
        if (userResutl.length < 1) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '查询失败'
            }
            return
        }
        ctx.body = {
            errorMessage: '查找成功',
            errorCode: 0,
            data: {
                ...userResutl[0],
                roles: [userResutl[0].roleName]
            }
        }
    }

    // 通过查找信息查找员工
    async searchTeacherBySearchContent() {
        // 查询全部员工信息
        const { ctx } = this
        let {
            searchContent,
            limit,
            limitStart,
        } = ctx.request.query

        const result = await ctx.model.Teachers.findUserBySearchContent({
            searchContent,
            limit,
            limitStart,
        })
        const resultCount = await ctx.model.Teachers.findBySearchContentCount(searchContent)

        ctx.status = 200

        if (!result || result.length == 0) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '查询失败，请重试',
            }
            return
        }

        ctx.body = {
            errorCode: 0,
            errorMessage: '查询成功',
            data: {
                list: result,
                total: resultCount[0]['COUNT(*)'],
            }
        }
    }

    // 查询用户名是否被注册
    async searchUsernameCount() {
        const { ctx } = this
        let { username } = ctx.request.query

        ctx.status = 200

        const result = await ctx.model.Teachers.findAll({
            where: {
                username
            }
        })

        if (result.length > 0) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '用户名已注册'
            }
        } else {
            ctx.body = {
                errorCode: 0,
                errorMessage: '用户名未注册'
            }
        }
    }

    //查询电话是否被注册
    async searchPhoneNumberCount() {
        const { ctx } = this
        let { phoneNumber } = ctx.request.query

        ctx.status = 200

        const result = await ctx.model.Teachers.findAll({
            where: {
                phoneNumber
            }
        })

        if (result.length > 0) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '电话已注册'
            }
        } else {
            ctx.body = {
                errorCode: 0,
                errorMessage: '电话未注册'
            }
        }
    }

    //查询邮箱是否被注册
    async searchEmailCount() {
        const { ctx } = this
        let { email } = ctx.request.query

        ctx.status = 200

        const result = await ctx.model.Teachers.findAll({
            where: {
                email
            }
        })

        if (result.length > 0) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '邮箱已注册'
            }
        } else {
            ctx.body = {
                errorCode: 0,
                errorMessage: '邮箱未注册'
            }
        }
    }

    //查询姓名是否被注册
    async searchNameCount() {
        const { ctx } = this
        let { name } = ctx.request.query

        ctx.status = 200

        const result = await ctx.model.Teachers.findAll({
            where: {
                name
            }
        })

        if (result.length > 0) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '姓名已注册'
            }
        } else {
            ctx.body = {
                errorCode: 0,
                errorMessage: '姓名未注册'
            }
        }
    }

    // 添加员工
    async addTeacher() {
        const { ctx } = this
        let {
            username,
            password,
            roleId,
            name,
            avatar,
            address,
            phoneNumber,
            email,
            state,
            delFlg,
            remark,
            schoolId,
        } = ctx.request.body

        ctx.status = 200
        if (!username) {
            ctx.body = {
                errorMessage: '请输入用户名',
                errorCode: 1,
            }
            return
        }

        password = password || 'password'
        roleId = roleId || 1
        name = name || ''
        avatar = avatar || ''
        phoneNumber = phoneNumber || ''
        email = email || ''
        address = address || ''
        state = state || ''
        delFlg = delFlg || ''
        remark = remark || ''

        // 判断用户名是否注册
        const usernameCount = await ctx.model.Teachers.findAll({
            where: {
                username
            }
        })
        if (usernameCount.length > 0) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '用户名已注册'
            }
            return
        }

        // 判断电话是否被注册
        if (phoneNumber) {
            const phoneNumberCount = await ctx.model.Teachers.findAll({
                where: {
                    phoneNumber
                }
            })
            if (phoneNumberCount.length > 0) {
                ctx.body = {
                    errorCode: 1,
                    errorMessage: '电话已注册'
                }
                return
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入电话'
            }
            return
        }

        // 判断邮箱是否被注册
        if (email) {
            const emailCount = await ctx.model.Teachers.findAll({
                where: {
                    email
                }
            })
            if (emailCount.length > 0) {
                ctx.body = {
                    errorCode: 1,
                    errorMessage: '邮箱已注册'
                }
                return
            }

        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入邮箱'
            }
            return
        }

        // 判断姓名是否被注册
        if (name) {
            const nameCount = await ctx.model.Teachers.findAll({
                where: {
                    name
                }
            })
            if (nameCount.length > 0) {
                ctx.body = {
                    errorCode: 1,
                    errorMessage: '姓名已注册'
                }
                return
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入员工姓名'
            }
            return
        }

        const salt = ctx.generateSalt
        const Md5Password = Crypto.createHash('md5').update(`${password}:${salt}`).digest('hex')
        const userResult = await ctx.model.Teachers.create({
            username,
            password: Md5Password,
            roleId,
            name,
            avatar,
            phoneNumber,
            email,
            salt,
            address,
            delFlg: 1,
            state: 1,
            remark,
            schoolId,
        })

        if (typeof (userResult) !== 'object') {
            ctx.body = {
                errorCode: 1,
                errorMessage: '添加用户失败，请重试'
            }
            return
        }

        ctx.body = {
            errorCode: 0,
            errorMessage: '添加用户成功'
        }
    }

    // 修改用户密码
    async updateUserPassword() {
        //修改用户名密码 
        //登陆后使用userId进行修改密码
        const { ctx } = this
        const {
            userId,
            password,
            salt,
            newPassword
        } = ctx.body

        if (!userId) {
            ctx.bod = {
                errorCode: 1,
                errorMessage: '您还没有登录',
                data: {}
            }
            return
        }

        if (password == newPassword) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '新密码与旧密码相同',
                data: {}
            }
            return
        }

        const userResult = ctx.model.Teachers.findById(userId).dataValues

        if (!suerResult) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '账户有误，请确认后重试或联系管理员',
                data: {}
            }
            return
        }

        if (salt != userResult['salt']) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '无法修改密码，请确认后重试',
                data: {}
            }
            return
        }

        const Md5Password = Crypto.createHash('md5').update(`${password}:${userResult['salt']}`).digest('hex')

        if (Md5Password != userResult['password']) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '密码输入错误，请确认后重试',
                data: {}
            }
            return
        }

        const newSalt = ctx.generateSalt;
        const newMd5Password = Crypto.createHash('md5').update(`${newPassword}:${newSalt}`).digest('hex')
        const userUpdateResult = await ctx.model.Teachers.update({
            password: newMd5Password,
            salt: newSalt
        }, {
                where: {
                    id: userId
                }
            })

        ctx.bod = {
            errorCode: 0,
            errorMessage: '修改成功',
        }

    }

    // 管理员修改员工信息
    async updateTeacherInfoByAdmin() {
        //修改员工信息
        const { ctx } = this

        const {
            userId,
            roleId,
            name,
            avator,
            phoneNumber,
            address,
            email,
            remark,
            schoolId,
        } = ctx.request.body

        ctx.status = 200

        const userInfo = await ctx.model.Teachers.findById(userId)

        // 判断电话是否被注册
        if (phoneNumber) {
            if (userInfo.phoneNumber != phoneNumber) {
                const phoneNumberCount = await ctx.model.Teachers.findAll({
                    where: {
                        phoneNumber
                    }
                })
                if (phoneNumberCount.length > 0) {
                    ctx.body = {
                        errorCode: 1,
                        errorMessage: '电话已注册'
                    }
                    return
                }
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入电话'
            }
            return
        }

        // 判断邮箱是否被注册
        if (email) {
            if (userInfo.email != email) {
                const emailCount = await ctx.model.Teachers.findAll({
                    where: {
                        email
                    }
                })
                if (emailCount.length > 0) {
                    ctx.body = {
                        errorCode: 1,
                        errorMessage: '邮箱已注册'
                    }
                    return
                }
            }

        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入邮箱'
            }
            return
        }

        // 判断姓名是否被注册
        if (name) {
            if (userInfo.name != name) {
                const nameCount = await ctx.model.Teachers.findAll({
                    where: {
                        name
                    }
                })
                if (nameCount.length > 0) {
                    ctx.body = {
                        errorCode: 1,
                        errorMessage: '姓名已注册'
                    }
                    return
                }
            }

        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入员工姓名'
            }
            return
        }


        const teacherUpdateResult = await ctx.model.Teachers.update({
            userId,
            roleId,
            name,
            avator,
            phoneNumber,
            address,
            email,
            remark,
            schoolId,
        }, {
                where: {
                    id: userId
                }
            })

        if (teacherUpdateResult[0] == 1) {
            ctx.body = {
                errorCode: 0,
                errorMessage: '修改成功',
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '修改失败，请重试',
            }
        }

    }

    // 个人修改员工信息
    async updateTeacherInfoBySelf() {
        const { ctx } = this
        const {
            userId,
            roleId,
        } = ctx
        const {
            password,
            newPassword,
            name,
            avator,
            phoneNumber,
            address,
            email,
        } = ctx.request.body

        // 判断电话是否被注册
        if (phoneNumber) {
            const phoneNumberCount = await ctx.model.Teachers.findAll({
                where: {
                    phoneNumber
                }
            })
            if (phoneNumberCount.length > 0) {
                ctx.body = {
                    errorCode: 1,
                    errorMessage: '电话已注册'
                }
                return
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入电话'
            }
            return
        }

        // 判断邮箱是否被注册
        if (email) {
            const emailCount = await ctx.model.Teachers.findAll({
                where: {
                    email
                }
            })
            if (emailCount.length > 0) {
                ctx.body = {
                    errorCode: 1,
                    errorMessage: '邮箱已注册'
                }
                return
            }

        } else {

        }

        // 判断姓名是否被注册
        if (name) {
            const nameCount = await ctx.model.Teachers.findAll({
                where: {
                    name
                }
            })
            if (nameCount.length > 0) {
                ctx.body = {
                    errorCode: 1,
                    errorMessage: '邮箱已注册'
                }
                return
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '请输入员工姓名'
            }
            return
        }

        const teacherUpdateResult = await ctx.model.Teachers.update({
            password,
            newPassword,
            name,
            avator,
            phoneNumber,
            address,
            email,
        }, {
                where: {
                    id: userId
                }
            })

        ctx.bod = {
            errorCode: 0,
            errorMessage: '修改成功',
            data: {
                ...teacherUpdateResult
            }
        }
    }

    // 管理员删除员工信息
    async deleteTeacher() {
        const { ctx } = this
        const {
            userId
        } = ctx.request.query

        const result = await ctx.model.Teachers.update({
            delFlg: 0,
        }, {
                where: {
                    id: userId
                }
            })

        ctx.status = 200
        if (result[0] == 1) {
            ctx.body = {
                errorCode: 0,
                errorMessage: '删除成功'
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: '删除失败'
            }
        }
    }
}

module.exports = UserController;