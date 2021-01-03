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
  // !收集依赖,需要一个容器存放
  depend() {
    if (effectContainer) {
      this.container.add(effectContainer)
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


// let dep = new Dep(10)

// watchEffect(() => {
//   console.log("dep " + dep.value);
// })

// dep.value = 20


/**
 * 对象响应式
 * ? 1、需要一个map存对象的deps：对象作为key，deps作为value
 *   !执行get的时候是收集依赖
 * ? 2、deps里面存着每一个属性的dep，属性作为key，dep作为value
 *    !执行set的时候是触发依赖
 */

let user = {
  name: 'tom',
  age: 27
}
const targetsMap = new Map() // 存对象的deps

function getDepMap(target, key) {
  let depsMap = targetsMap.get(target)
  // 有可能没有
  if (!depsMap) {
    depsMap = new Map()
    targetsMap.set(target, depsMap)
  }
  // 从depsMap中取出dep执行dep.depend()
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}


function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      let dep = getDepMap(target, key)
      // * 这里收集依赖
      dep.depend()
      // return target[key] // !写法被废弃
      return Reflect.get(target, key) // * 官方推荐
    },
    set(target, key, val) {
      let dep = getDepMap(target, key)
      // 触发依赖
      const result = Reflect.set(target, key, val)
      dep.notice()
      return result
    }
  })
}
let obj = reactive(user)
watchEffect(() => {
  console.log(obj.name);
})
obj.name = 'qitianm'