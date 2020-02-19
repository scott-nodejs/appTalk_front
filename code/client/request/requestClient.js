import {cookie} from '../../server/utils/cookie'

const objToStr = cookies => {
    let cookie = ''
    Object.keys(cookies).forEach(item => {
        cookie += item + '=' + cookies[item] + '; '
    })
    return cookie
}

export function requestConfig () {
  return {
      url: '/api',
  }
}
