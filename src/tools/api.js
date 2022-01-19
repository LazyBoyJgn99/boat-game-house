import { post, get, put, baseUrl } from './myFetch'
// 登录接口
export function login(data) {
  return post({ url: '/user/login', params: data })
}
// 修改用户信息
export function editUser(data) {
  return put({ url: '/user/users', params: data })
}

// 上传头像
export function upload() {
  return `${baseUrl}/user/upload`
}
// 获取聊天用户列表
export function getMemberList() {
  return get({ url: '/group-chat/users' })
}
// 获取聊天记录
export function getChatHis(data) {
  return get({ url: '/group-chat/his', params: data })
}
// 发送聊天信息
export function sendChat(data) {
  return post({ url: '/group-chat/send', params: data })
}
// // 加载首页数据
// export function dashboard(token) {
//     let headers = new Headers()

//     headers.append('Content-Type', 'application/json')
//     headers.append('Accept', 'application/json')
//     headers.append('Authorization', token)

//     return post( {url: '/dashboard', headers: headers} )
// }
