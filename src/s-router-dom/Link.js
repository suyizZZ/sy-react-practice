import React, { Component } from 'react';
import { RouterContext } from './Context';
class Link extends Component {
  static contextType = RouterContext;
  handleClick = (event) => {
    event.preventDefault();
    this.context.history.push(this.props.to);
  };
  render() {
    const { to, children, ...restProps } = this.props;

    return (
      <a href={to} {...restProps} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

export default Link;
