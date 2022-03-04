/**
 * 日期格式化 gqr
 * @param {*} dateStr
 * @param {*} fmt
 */
 export const formatDate = (dateStr: string, fmt: string): string => {
  const date = new Date(dateStr)
  if (dateStr !== '' && !date.getFullYear()) {
    console.error('时间格式错误！')
    return ''
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  type oType = {[key: string]: number};
  const o: oType = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

// 补零函数
const padLeftZero = (str: string) => {
  return ('00' + str).substr(str.length)
}

export const getTopicTab = (isTop: boolean, tab: string): string => {
  if (isTop) return '置顶';
  switch (tab) {
    case 'good':
      return '精华';
    case 'share':
      return '分享';
    case 'ask':
      return '问答';
    case 'job':
      return '招聘';
    case 'dev':
      return '客户端测试';
    default:
      return '全部';
  }
}