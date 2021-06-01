import React, { Component } from 'react';
import { RouterContext } from './Context';
import matchPath from './matchPath';

class Route extends Component {
  render() {
    console.log(this.props);
    // return children(this.props);
    return (
      <RouterContext.Consumer>
        {(context) => {
          const { children, component, path } = this.props;
          console.log(this.props);
          const location = context.location;
          console.log('location :>> ', location);
          const match = path ? matchPath(location.pathname, this.props) : context.match;
          return match ? <div>{React.createElement(component, this.props)}</div> : null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;
