// 程序的入口

// App.render(App.setup())
import {
  watchEffect
} from "./reactivity/index.js"
import {
  mountElement
} from "./renderer.js"

export function createApp(rootElement) {
  return {
    mount(rootContainer) {
      const rootApp = document.querySelector(rootContainer)
      const setup = rootElement.setup()
      watchEffect(() => {
        rootApp.innerHTML = ''
        const sunTree = rootElement.render(setup)

        // rootContainer 父容器
        mountElement(sunTree, rootApp) // mountElement 将vnode转化成真实dom
        // // !这里的ele是真实的dom
        // rootApp.appendChild(ele)
      })
    }
  }
}