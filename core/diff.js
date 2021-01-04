/**
 * 
 * @param {*} newVnode 
 * @param {*} oldVnode 
 * diff比较
 * ? 1、比较type，type不一样直接替换
 * ? 2、比较props，props有删除，新增，修改
 * ? 3、比较children
 * ! children有多种情况
 */
import {
  createElement,
  patchProp,
  mountElement
} from "./renderer.js"
export function diff(newVnode, oldVnode) {
  // ? 如果type不一样，直接替换旧的节点type
  if (newVnode.type !== oldVnode.type) {
    oldVnode.el.replaceWith(createElement(newVnode.type))
  }
  const el = (newVnode.el = oldVnode.el);

  // 比较props
  /** 
   * ? 1、新的节点 {id:'test'} 旧的节点 {id:'test'} // 没有修改
   * ? 2、新的节点 {id:'test'} 旧的节点 {id:'test1'} // 只修改了属性值
   * ? 3、新的节点 {id:'test',"class":'box'} 旧的节点 {id:'test'} // 新增了属性
   * ? 4、新的节点 {id:'test'} 旧的节点 {id:'test',"class":'box'} // 删除了属性
   */
  const newProps = newVnode.props || []
  const oldProps = oldVnode.props || []
  // 处理新值
  Object.keys(newProps).forEach(prop => {
    if (newProps[prop] !== oldProps[prop]) {
      patchProp(el, prop, oldProps[prop], newProps[prop])
    }
  })
  // 处理老值
  // 如果老的props 里面有，而新的props 里面没有的话 那么就需要删除
  Object.keys(oldProps).forEach(prop => {
    if (!newVnode[prop]) {
      patchProp(el, prop, oldProps[prop], newProps[prop])
    }
  })

  /** 
   * !比较children
   * ? 1、新值是string，老值也是string
   * ? 2、新值是string，老值是Array
   * ? 3、新值是Array，老值是string
   * ? 4、新值是Array，老值也是Array
   */

  const newChildren = newVnode.children || []
  const oldChildren = oldVnode.children || []

  if (typeof newChildren === "string") {
    if (typeof oldChildren === "string") {
      // 如果相等则不做修改
      if (newChildren !== oldChildren) {
        el.textContent = newChildren
      }
    } else if (Array.isArray(oldChildren)) {
      el.textContent = newChildren
    }
  } else if (Array.isArray(newChildren)) {
    if (typeof oldChildren === "string") {
      el.innerHTML = '' // 将之前老值清空
      newChildren.forEach(child => {
        console.log(child);
        mountElement(child, el)
      })

    } else if (Array.isArray(oldChildren)) {
      // ! 这里需要比较的就多了
      // ? 1、新值老值长度相等：new:{a,b,c} old:{a,b,d}
      const length = Math.min(newChildren.length, oldChildren.length);
      for (let i = 0; i < length; i++) {
        diff(newChildren[i], oldChildren[i])
      }

      // ? 2、新值比老值少：new:[a,c] old:[a,b,d]

      const oldLength = oldChildren.length
      if (oldLength > length) {
        for (let i = length; i < oldLength; i++) {
          el.removeChild(oldChildren[i].el)
        }
      }

      // ? 3、新值比老值多
      const newLength = newChildren.length
      if (newLength > length) {
        for (let i = length; i < newLength; i++) {
          const vnode = newChildren[i];
          mountElement(vnode, el);
        }
      }
    }
  }
}