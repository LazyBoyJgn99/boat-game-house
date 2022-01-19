import localStorage from 'localStorage'
import { message } from 'antd'

let webSocketUrl = 'ws://127.0.0.1:8080/imserver/'
// let webSocketUrl = 'ws://106.15.32.115:8095/imserver/'

let socket = null

export default function getSocket() {
  if (typeof WebSocket === 'undefined') {
    message.warning('您的浏览器不支持websocket')
  } else {
    // 获取本地存储的user信息
    const user = JSON.parse(localStorage.getItem('user'))
    if (typeof user?.id === 'undefined') return
    webSocketUrl += user?.id
    if (socket != null) {
      return socket
    }
    socket = new WebSocket(webSocketUrl)
    // 打开事件
    socket.onopen = () => {
      console.log('websocket已打开')
    }
    socket.onclose = () => {
      console.log('websocket已关闭')
    }
    socket.onerror = () => {
      console.log('websocket发生错误')
    }
  }

  return socket
}
