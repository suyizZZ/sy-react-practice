import React, { Component } from 'react';
import { RouterContext } from './Context';
import matchPath from './matchPath';

class Route extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          // computedMatch 在switch 中计算的是否匹配  所以传递过来 如果存在则无须再次计算
          const { children, component, path, render, computedMatch } = this.props;
          const location = context.location;
          const match = computedMatch ? computedMatch : path ? matchPath(location.pathname, this.props) : context.match;
          const props = {
            ...context,
            match,
          };
          // match children, component, render,  null
          // 不match children（function）, null

          // return match ? <div>{React.createElement(component, props)}</div> : null;
          return (
            <RouterContext.Provider value={props}>
              {match
                ? children
                  ? typeof children === 'function'
                    ? children(props)
                    : children
                  : component
                  ? React.createElement(component, props)
                  : render
                  ? render(props)
                  : null
                : typeof children === 'function'
                ? children(props)
                : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;
