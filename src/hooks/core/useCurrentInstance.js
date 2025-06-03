import { getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useCurrentInstance = () => {
  const router = useRouter()
  const route = useRoute()

  // 获取当前实例
  const currentInstance = getCurrentInstance()

  if (!currentInstance) {
    throw new Error('useCurrentInstance必须在setup函数中调用💘')
  }

  // 解构出proxy
  const { proxy } = currentInstance

  /**
   * utils
   * @param {*} $is 类型判断
   * @param {*} $dataHelpers 数据处理
   * @param {*} $common 常用方法
   * @param {*} $api 接口请求
   * @param {*} $dict 字典数据
   * */   

  const $is = proxy.$is
  const $dataHelpers = proxy.$dataHelpers
  const $common = proxy.$common
  // const $api = proxy.$api => axios实例
  // const $dict = proxy.$dict => 字典数据

  return {
    currentInstance,
    proxy,

    router,
    route,

    $is,
    $dataHelpers,
    $common,
    // $api,
    // $dict
  }
}
