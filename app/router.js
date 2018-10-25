'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app

    const needLogin = app.role.can('login')
    const needAdmin = app.role.can('admin')



    router.get('/', controller.home.index)

    // 员工登录
    router.post('/api/teacherLogin', controller.teachers.teacherPasswordLogin)

    // 获取员工信息
    router.get('/api/getTeacherInfo', needLogin, controller.teachers.getTeacherInfo)
    // 获取员工列表
    router.get('/api/searchTeacherBySearchContent', controller.teachers.searchTeacherBySearchContent)
    // 添加员工
    router.post('/api/addTeacher', controller.teachers.addTeacher)
    // 管理员修改修改员工信息
    router.put('/api/updateTeacherInfoByAdmin', controller.teachers.updateTeacherInfoByAdmin)
    // 员工自己修改员工信息
    router.put('/api/updateTeacherInfoBySelf', controller.teachers.updateTeacherInfoBySelf)
    // 管理员删除员工
    router.delete('/api/deleteTeacher', controller.teachers.deleteTeacher)
    // 验证员工username是否可用
    router.get('/api/searchUsernameCount', controller.teachers.searchUsernameCount)
    // 验证员工phoneNumber是否可用
    router.get('/api/searchPhoneNumberCount', controller.teachers.searchPhoneNumberCount)
    // 验证员工email是否可用
    router.get('/api/searchEmailCount', controller.teachers.searchEmailCount)
    // 验证员工姓名是否可用
    router.get('/api/searchNameCount', controller.teachers.searchNameCount)
    // 获取通过员工Id查询员工信息
    router.get('/api/getTeacherInfoById', controller.teachers.getTeacherInfoById)

    // 查找权限
    router.get('/api/findAllUserRole', controller.userRole.findAll)
    // 添加权限
    router.post('/api/addUserRole', controller.userRole.addUserRole)

    // 查找学校
    router.get('/api/findAllSchools', controller.schools.findAll)
    // 添加学校
    router.post('/api/addSchool', controller.schools.addSchool)
}
