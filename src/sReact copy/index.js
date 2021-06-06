import { TEXT } from "./const";
// 创建react element，并返回
function createElement(type, config, ...children) {
  // ! 暂时删除
  if (config) {
    delete config.__self;
    delete config.__source;
  }
  const props = {
    ...config,
    children: children.map(child => typeof child === 'object' ? child : createTextNode(child)),
  }
  return {
    type,
    props,
  }

};

function createTextNode(text) {
  return {
    type: TEXT,
    props: {
      children: [],
      nodeValue: text,
    }
  }
};

const React = {
  createElement,
}

export default React;


