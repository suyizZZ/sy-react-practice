import React, { Component } from 'react'
import { RouterContext } from "./Context";
import matchPath from "./matchPath";
export default class Switch extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {
          context => {
             //match 是否匹配
          //element 记录匹配的元素
            const {location} = context;
            let match, element;
            console.log('this.props.children :>> ', this.props.children);
            React.Children.forEach(this.props.children, child => {
              // React.isValidElement 判断是否为react组件
              if (match == null && React.isValidElement(child)) {
                element = child;
                const { path } = child.props;
                match = path ? matchPath(location.pathname, child.props) : context.match;
              }
            });

            return match ? React.cloneElement(element, { computedMatch: match }) : null;
          }
        }
      </RouterContext.Consumer>
    )
  }
}
