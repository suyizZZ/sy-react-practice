// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './sReact/index';
import ReactDOM, { useState } from './sReact/react-dom';
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
  const [count, setCount] = useState(0);
  return <div className='box'>
      <div>
      函数式组件 {name}
      </div>
      <span>{count}</span>
      <span onClick={() => setCount(count + 1)}>add</span>
    </div>;
}

const jsx = (
  <div className='box'>
    {/* <span>
      hi<span>23</span>
      <span>23</span>
    </span>
    <span>hi</span>
    <span>hi</span> */}
    <>
      <span>11</span>
      <span>12</span>
    </>

      {/* <ClassComponent name='class' color='red' /> */}
    {/* {[1,2,3,4,5].map((v) => {
      return <>{v}</>;
    })} */}
    <FunctionComponent name='function' />
  </div>
);

ReactDOM.render(jsx, document.getElementById('root'));
