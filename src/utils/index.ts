import { topicTypeList } from "@/constant"
import router, { prefix } from "@/router"
import { RouteLocationRaw } from "vue-router"

/**
 * 日期格式化
 * @param {*} dateStr 日期字符串
 * @param {*} fmt 日期格式
 * @returns 格式化后的日期
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

/**
 * 获取置顶及话题类型
 * @param isTop 是否置顶
 * @param tab 类型标识
 * @returns 类型名称
 */
export const getTopicTab = (isTop: boolean, tab: string): string => {
  if (isTop) return '置顶';
  return topicTypeList.find(item => item.key === tab)?.name ?? '未知';
}

/**
 * 生成从minNum到maxNum的随机数
 * @param minNum 最小值
 * @param maxNum 最大值
 * @returns 随机数
 */
export const randomNum = (minNum: number, maxNum?: number): number => {
  if (minNum !== undefined && maxNum !== undefined) {
    return parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10);
  } else if (minNum !== undefined) {
    return parseInt(String(Math.random() * minNum + 1), 10);
  } else {
    return 0;
  }
}

/**
 * 将&lt转成<、&gt转成>、“或”转成"
 * @param content 需转换的字符串
 * @returns 转换后结果
 */
export const changeLtGt = (content: string): string => {
  let str = content.replace(/“|”/g, '"');
  str = str.replace(/href="+(\/.?user.?\/|user.?\/)/g, 'href="./#/user/');
  str = str.replace(/&lt;/g, '<');
  return str.replace(/&gt;/g, '>');
};

/**
 * 处理qiankun子模块非根目录部署路由问题
 * @param params 路由参数
 */
export const routerPush = (params: RouteLocationRaw): void => {
  // 解构路由路径
  const { path } = typeof params === 'string'
    ? { path: undefined, }
    : { path: undefined, ...params };
  // 为 path 加上主应用前缀 prefix
  const routerParms = typeof params === 'string' ? prefix + params : {
    ...params,
    ...(path ? { path: prefix + path } : {})
  };
  router.push(routerParms);
};