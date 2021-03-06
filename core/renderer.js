// 自定义创建element节点，vue3中的跨平台自定义渲染器就是这么实现的
// custom Renderer
export function createElement(type) {
  // 传入的type是dom就用domapi
  return document.createElement(type)
}

// 插入容器dom
function insert(parent, childEle) {
  parent.appendChild(childEle)
}

// 设置props
export function patchProp(el, key, prevValue, nextValue) {
  if (!nextValue) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, nextValue);
  }
}

// ! 将虚拟dom转化成真实dom
export function mountElement(vnode, parent) {
  const {
    type,
    props,
    children
  } = vnode
  const ele = (vnode.el = createElement(type))

  // 渲染props
  if (props) {
    for (let key in props) {
      const val = props[key];
      patchProp(ele, key, null, val);
    }
  }

  // 渲染子节点,子节点是数组的时候需要递归
  if (typeof children === "string") {
    const textEle = document.createTextNode(children)
    ele.appendChild(textEle)
  } else if (Array.isArray(children)) {
    // ! 递归
    children.forEach(child => {
      mountElement(child, ele)
    })
  } else {
    console.error('children must is string or Array');
  }

  insert(parent, ele) // 插入根容器
}