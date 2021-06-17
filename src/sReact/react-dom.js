import { TEXT, PLACEMENT, UPDATE, DELETION } from './const';

// 下一个单元任务 fiber
let nextUnitOfWork = null;

// work in progress fiber root （正在执行的根fiber）
let wipRoot = null;

// 当前的根节点
let currentRoot = null;

// work in progress fiber 当前执行的fiber
let wipFiber = null;

let deletions = null;

/**
 * fiber架构
 * type: 标记类型
 * key: 标记当前层级下的唯一性
 * child : 第一个子元素 fiber
 * sibling ： 下一个兄弟元素 fiber
 * return： 父fiber
 * node： 真实dom节点
 * props：属性值
 * base: 上次的节点 fiber
 * effectTag: 标记要执行的操作类型（删除、插入、更新）
 */

function render(vNode, container) {
  // const node = createNode(vNode);
  // container.appendChild(node);
  // 初始值
  wipRoot = {
    node: container,
    props: {
      children: [vNode],
    },
  };
  nextUnitOfWork = wipRoot;

  deletions = [];

}

function createNode(vNode) {
  const { type, props } = vNode;
  let node = null;
  if (type === TEXT) {
    node = document.createTextNode('');
  } else if (typeof type === 'string') {
    node = document.createElement(type);
  } else if (typeof type === 'function') {
    node = type.prototype.isReactComponent ? updateClassComponent(vNode) : updateFunctionComponent(vNode);
  } else {
    node = document.createDocumentFragment();
  }
  // 把props.children遍历，转成真实dom节点 ，再插入node
  // reconcileChildren(props.children, node);

  // 更新属性节点
  updateNode(node, {}, props);
  return node;
}

// function updateClassComponent_old(vNode) {
//   const { type, props } = vNode;
//   // 添加defaultProps
//   if (type.defaultProps) {
//     Object.keys(type.defaultProps).forEach((prop) => {
//       if (props[prop] === undefined) {
//         props[prop] = type.defaultProps[prop];
//       }
//     });
//   }
//   // if (type)
//   const cmp = new type(props);
//   const vvNode = cmp.render();
//   // 生成node节点
//   const node = createNode(vvNode);
//   return node;
// }

// function updateFunctionComponent_old(vNode) {
//   const { type, props } = vNode;
//   const vvNode = type(props);
//   // 生成node节点
//   const node = createNode(vvNode);
//   return node;
// }

// 更新属性值，如className、nodeValue等
function updateNode(node, prevValue, nextValue) {
  // 如果说prevVal, nextVal里有相同的属性值，这个时候不用管
  // 如果说prevVal里有， nextVal没有，需要遍历prevVal执行删除操作
  // 如果说prevVal里没有， nextVal有，这个时候不用管
  Object.keys(prevValue)
    .filter((k) => k !== 'children')
    .forEach((k) => {
      if (k.slice(0, 2) === "on") {
        // 简单粗暴 这是个事件
        let eventName = k.slice(2).toLowerCase();
        node.removeEventListener(eventName, prevValue[k]);
      } else {
        console.log(k , nextValue);
        if (!(k in nextValue)) {
          node[k] = "";
        }
      }
    });
  Object.keys(nextValue)
    .filter((k) => k !== 'children')
    .forEach((k) => {
      // ! 源码中为合成事件
      if (k.slice(0, 2) === 'on') {
        let eventName = k.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, nextValue[k]);
      } else {
        node[k] = nextValue[k];
      }
    });
}

// 把props.children遍历，转成真实dom节点 ，再插入node
function reconcileChildren_old(children, node) {
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    // 兼容数组形式写法 {[1, 2, 3].map(v => <>{v}</>)}
    if (Array.isArray(child)) {
      for (let j = 0; j < child.length; j++) {
        render(child[j], node);
      }
    } else {
      render(child, node);
    }
  }
}
// workInProgressFiber Fiber ->child->sibling
// children 数组
function reconcileChildren(workInProgressFiber, children) {
  let prevSlibling = null;
  // 构建fiber节点

  // 获取old fiber的第一个子节点
  let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    // 现在只考虑初次渲染
    // 创建一个新的fiber
    // if (Array.isArray(child)) {
    //   // {[].map}的情况
    //   for (let j = 0; j < child.length; j++) {
    //     let insideChild = child[j];
    //     let insideNewFiber = {
    //       type: insideChild.type,
    //       props: insideChild.props,
    //       node: null,
    //       base: null,
    //       return: workInProgressFiber,
    //       effectTag: PLACEMENT,
    //     };

    //     if (i === 0) {
    //       // i === 0 则将第一个插入到child中
    //       if (j === 0) {
    //         workInProgressFiber.child = insideNewFiber;
    //       } else {
    //         prevSlibling.sibling = insideNewFiber;
    //       }
    //       prevSlibling = insideNewFiber;
    //     } else {
    //       // 不等于0 全部插入到sibling中
    //       if (!prevSlibling) {
    //         // 初次才需要从workInProgressFiber获取sibling
    //         let workInProgressFiberChild = workInProgressFiber.child;
    //         prevSlibling = workInProgressFiberChild.sibling;
    //       }
    //       prevSlibling.sibling = insideNewFiber;
    //       prevSlibling = insideNewFiber;
    //     }
    //   }
    // } else {
      let newFiber = null;

      const sameType = child && oldFiber && child.type === oldFiber.type;

      if (sameType) {
        newFiber = {
          type: child.type,
          props: child.props,
          node: oldFiber.node,
          base: oldFiber,
          return: workInProgressFiber,
          effectTag: UPDATE,
        };
      }

      if (!sameType && child) {
        // 创建一个新的fiber
        newFiber = {
          type: child.type,
          props: child.props,
          node: null,
          base: null,
          return: workInProgressFiber,
          effectTag: PLACEMENT,
        };
      }

      if (!sameType && oldFiber) {
        // todo 删除节点
        oldFiber.effectTag = DELETION;
        deletions.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (i === 0) {
        workInProgressFiber.child = newFiber;
      } else {
        prevSlibling.sibling = newFiber;
      }
      prevSlibling = newFiber;
    // }
  }
}

function updateHostComponent(fiber) {
  // 若没有则添加node节点
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }
  const { children } = fiber.props;
  reconcileChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  wipFiber.hooks = [];
  wipFiber.hookIndex = 0;

  const { type, props } = fiber;
  const children = [type(props)];
  reconcileChildren(fiber, children);
}

function updateClassComponent(fiber) {
  const { type, props } = fiber;
  const ClassComponent = new type(props);
  const children = [ClassComponent.render()];
  reconcileChildren(fiber, children);
}

//执行当前任务 更新当前fiber节点
function performUnitOfWork(fiber) {
  // 执行当前任务 更新当前fiber节点
  const { type } = fiber;

  if (typeof type === 'function') {
    // 函数组件或类组件
    type.prototype.isReactComponent ? updateClassComponent(fiber) : updateFunctionComponent(fiber);
  } else {
    // 原生标签
    updateHostComponent(fiber);
  }

  // 返回下一个fiber
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    // 找到兄弟
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // 没有兄弟 往祖先上找
    nextFiber = nextFiber.return;
  }
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
function workLoop(deadline) {
  // 有下一个新任务 并且当前帧没有结束
  // 这里的时间是模拟，源码当中用的过期时间，源码中的过期时间和时间单位相关内
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 执行当前任务
    // 获取下一个子任务（fiber）
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    // 提交
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  deletions.forEach(commitWorker);
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWorker(fiber) {
  if (!fiber) {
    return;
  }
  // 找到parentNode,
  // 找到最近的有node节点的祖先fiber;
  let parentNodeFiber = fiber.return;
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.return;
  }

  const parentNode = parentNodeFiber.node;

  if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
    // 遇到DocumentFragment 则直接appendChild到最近的父级节点
    // if (!parentNodeFiber.type && parentNodeFiber.node.nodeType === 11) {
    //   parentNodeFiber.return.node.appendChild(fiber.node);
    // } else {
      parentNode.appendChild(fiber.node);
    // }
  } else if (fiber.effectTag === UPDATE && fiber.node !== null) {
    // parentNodeFiber.return.node.appendChild(fiber.node);
    // if (!parentNodeFiber.type && parentNodeFiber.node.nodeType === 11) {
    //     console.log(parentNodeFiber.return, 'parentNodeFiber.return');
    //     // ! 暂未实现
    //   } else {
        updateNode(fiber.node, fiber.base.props, fiber.props);
      // }
  } else if (fiber.effectTag === DELETION && fiber.node !== null) {
    // 删除节点
    commitDeletions(fiber, parentNode);
  }

  commitWorker(fiber.child);
  commitWorker(fiber.sibling);
}

// 这个parentNode是有node节点，参考上面的while循环
function commitDeletions(fiber, parentNode) {
  if (fiber.node) {
    parentNode.removeChild(fiber.node);
  } else {
    // 因为有些fiber没有node节点，如Consumer
    commitDeletions(fiber.child, parentNode);
  }
}

requestIdleCallback(workLoop);

// 初次渲染还是更新
export function useState(init) {
  // 判断有没有老的hook
  const oldHook = wipFiber.base && wipFiber.base.hooks[wipFiber.hookIndex];

  const hook = oldHook ? { state: oldHook.state, queue: oldHook.queue } : { state: init, queue: [] };

  // 更新hooks.state
  hook.queue.forEach((action) => (hook.state = action));

  const setState = (action) => {
    hook.queue.push(action);

    wipRoot = {
      // node
      node: currentRoot.node,
      props: currentRoot.props,
      base: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };
  wipFiber.hooks.push(hook);
  wipFiber.hookIndex++;

  return [hook.state, setState];
}

const ReactDOM = { render };

export default ReactDOM;
