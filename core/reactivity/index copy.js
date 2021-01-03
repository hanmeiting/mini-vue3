/**
 * !vue3的更新源码机制
 * mini-vue源码要实现的功能
 * 1、优化点：没必要把之前的dom都干掉
 * 2、如何去优化=》diff
 * 3、vdom => js对象 =》diff
 * 
 * 
 * todo 响应式 如何实现
 * 1、收集依赖
 * 2、触发依赖
 * 
 * ref   reactive   effect
 * 
 * todo 依赖
 * 
 * 类 Dep // 实现ref
 * * depend()  收集依赖
 * 
 * ? 收集依赖流程
 * 1、 
 * 
 * 
 * * notice()  触发依赖
 * 
 * 
 * * reactive实现 ，对象响应式
 * 1、使用proxy()
 * 
 */


// 全局变量 存effect
let effectContainer = null
class Dep {
  constructor(val) {
    this._val = val
    // this.container = [] // 这样容易重复，但是我们不要重复的依赖
    // !修改依赖存放容器
    this.container = new Set()
  }
  get value() {
    this.depend(effectContainer)
    return this._val
  }
  set value(val) {
    this._val = val
    this.notice()
  }
  // !收集依赖,需要一个容器存放
  depend(fn) {
    if (!fn) {
      this.container.add(fn)
    }
  }
  // ! notice 触发依赖
  notice() {
    // 遍历容器执行容器中的fn
    this.container.forEach(fn => fn())
  }
}

// 使用
function watchEffect(effect) {
  effectContainer = effect
  effect()
  effectContainer = null
}


let dep = new Dep(10)

watchEffect(() => {
  console.log("dep " + dep.value);
})

dep.value = 20