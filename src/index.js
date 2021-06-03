// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './sReact/index';
import ReactDOM from './sReact/react-dom';
import Component from './sReact/Component';

import './index.css';
class ClassComponent extends Component {
  static defaultProps = {
    color: "pink"
  };
  render() {
    const { name, color } = this.props;
    return <div>类组件 {name}{color}</div>;
  }
}

function FunctionComponent({ name }) {
  return <div className='box'>函数式组件 {name}</div>;
}

const jsx = (
  <div className='box'>
    <span>
      hi<span>23</span>
      <span>23</span>
    </span>
    <span>hi</span>
    <span>hi</span>
    <>
      <span>1</span>
      <span>2</span>
    </>
    {[1, 2, 3, 4].map((v) => {
      return <>{v}</>;
    })}
    <ClassComponent name='class' color='red' />
    <FunctionComponent name='function' />
  </div>
);

ReactDOM.render(jsx, document.getElementById('root'));
