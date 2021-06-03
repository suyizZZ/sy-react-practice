import { TEXT } from './const';

function render(vNode, container) {
  const node = createNode(vNode);
  container.appendChild(node);
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
  reconcileChildren(props.children, node);

  // 更新属性节点
  updateNode(node, props);
  return node;
}

function updateClassComponent(vNode) {
  const { type, props } = vNode;
  // 添加defaultProps
  if (type.defaultProps) {
    Object.keys(type.defaultProps).forEach(prop => {
      if (props[prop] === undefined) {
        props[prop] = type.defaultProps[prop];
      }
    })
  }
  // if (type)
  const cmp = new type(props);
  const vvNode = cmp.render();
  // 生成node节点
  const node = createNode(vvNode);
  return node;
}

function updateFunctionComponent(vNode) {
  const { type, props } = vNode;
  const vvNode = type(props);
  // 生成node节点
  const node = createNode(vvNode);
  return node;
}

// 更新属性值，如className、nodeValue等
function updateNode(node, nextValue) {
  Object.keys(nextValue)
    .filter((k) => k !== 'children')
    .forEach((k) => {
      node[k] = nextValue[k];
    });
}

function reconcileChildren(children, node) {
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

const ReactDOM = { render };

export default ReactDOM;
