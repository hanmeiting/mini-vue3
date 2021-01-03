import {
  reactive
} from "./core/reactivity/index.js"
import {
  h
} from "./core/h.js"

export default {
  render(context) {
    // let ele = document.createElement("h1")
    // ele.innerHTML = context.state.count
    // return ele

    // return h("div", {
    //     id: 'box'
    // }, "children is test")

    return h("div", {
      id: 'box'
    }, [h("p", {
      class: 'text'
    }, 'Tom'), h("h2", null, "Bob")])
  },
  setup() {
    window.state = reactive({
      count: 0
    })
    return {
      state
    }
  }
}