// 程序的入口

// App.render(App.setup())
import {
  watchEffect
} from "./reactivity/index.js"

export function createApp(rootElement) {
  return {
    mount(rootContainer) {
      const rootApp = document.querySelector(rootContainer)
      const setup = rootElement.setup()
      watchEffect(() => {
        rootApp.innerHTML = ''
        const ele = rootElement.render(setup)
        rootApp.appendChild(ele)
      })
    }
  }
}