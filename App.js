import {
  reactive,
  h
} from "./core/vue.js"

export default {
  render(context) {

    return h("div", {
      id: 'box'
    }, context.children.text)

    // return h('div', context.props, [h("p", {
    //   id: 'text'
    // }, `Tom:${context.state.count}`), h("h2", null, "Bob")])
  },
  setup() {
    const state = reactive({
      count: 1,
      type: 'div'
    });
    const props = reactive({
      id: "box",
      class: "hanting"
    })
    const children = reactive({
      text: [
        h("p", {
          id: 'text'
        }, `Tom`)
      ]
    })
    // const children = reactive({
    //   text: [
    //     h("p", {
    //       id: 'text'
    //     }, `Tom`), h("h2", null, "Bob"), h("h2", null, "Bob"), h("h2", null, "Bob")
    //   ]
    // })

    function handler() {
      children.text = [
        h("p", {
          id: 'text'
        }, `Tom1`), h("h2", null, "Bob")
      ]
    }
    window.state = state;
    window.props = props;
    window.children = children;
    window.addEventListener('click', handler)
    return {
      state,
      props,
      children
    }
  }
}