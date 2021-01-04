// 程序的入口
import {
  watchEffect
} from "./reactivity/index.js"
import {
  mountElement
} from "./renderer.js"
import {
  diff
} from "./diff.js"
export function createApp(rootElement) {
  return {
    mount(rootContainer) {
      const rootApp = document.querySelector(rootContainer)
      const setup = rootElement.setup()
      let isMount = true // 用来判断是初始化函数update
      let oldChildren = null
      watchEffect(() => {
        // !update期间在diff时候需要新旧两个节点
        if (!isMount) { // update要执行的
          const subTree = rootElement.render(setup)
          diff(subTree, oldChildren)
          oldChildren = subTree
        } else { // 初始化要执行的
          rootApp.innerHTML = ''
          const subTree = rootElement.render(setup)
          isMount = false
          oldChildren = subTree;
          mountElement(subTree, rootApp) // mountElement 将vnode转化成真实dom
        }
        // rootContainer 父容器
        // // !这里的ele是真实的dom
        // rootApp.appendChild(ele)
      })
    }
  }
}