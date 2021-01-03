import {
    reactive
} from "./core/reactivity/index.js"

export default {
    render(context) {
        let ele = document.createElement("h1")
        ele.innerHTML = context.state.count
        return ele
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

// App.render(App.setup())