// const baseUrl = 'https://mock.yonyoucloud.com/mock/19838/dddcz-game-house'
// export const baseUrl = 'http://106.15.32.115:8095/api'
export const baseUrl = 'http://127.0.0.1:8080/api'

function http(url, params, headers, method) {
  const fParams = params || {}
  const fHeaders = headers || new Headers()

  const config = {
    method,
    mode: 'cors',
    headers: fHeaders,
  }
  if (method !== 'GET') {
    config.body = JSON.stringify(fParams)
  }
  const result = fetch(baseUrl + url, config)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw new Error('Network response was not ok.')
    })
    .catch(error => {
      console.log('There has been a problem with your fetch operation: ', error.message)
      return error
    })
    .then(data => {
      if (data.success) {
        if (data?.msg) console.log(data.msg)
      } else {
        if (data?.msg) console.log(data.msg)
        if (data?.state === 701) {
          window.location.hash = '#/login'
          return null
        }
      }
      return data
    })

  return result
}

export function get({ url, params, headers }) {
  let rUrl = url
  if (params) {
    let paramsArray = []
    paramsArray = Object.keys(params).map(key => {
      return `${key}=${params[key]}`
    })
    if (url.search(/\?/) === -1) {
      rUrl += `?${paramsArray.join('&')}`
    } else {
      rUrl += `&${paramsArray.join('&')}`
    }
  }
  return http(rUrl, {}, headers, 'GET')
}

export function post({ url, params, headers }) {
  let fHeaders = new Headers()

  fHeaders.append('Content-Type', 'application/json')
  fHeaders.append('Accept', 'application/json')
  fHeaders = headers || fHeaders

  return http(url, params, fHeaders, 'POST')
}

export function put({ url, params, headers }) {
  let fHeaders = new Headers()

  fHeaders.append('Content-Type', 'application/json')
  fHeaders.append('Accept', 'application/json')
  fHeaders = headers || fHeaders

  return http(url, params, fHeaders, 'PUT')
}
