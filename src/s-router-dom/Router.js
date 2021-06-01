import React, { Component } from 'react';
import { RouterContext } from "./Context";

class Router extends Component {
  static computeRootMatch(pathname) {
    return { path: '/', rul: '/', params: {}, isExact: pathname === '/' };
  }
  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location,
    }

    this.unListen = props.history.listen(location => {
      this.setState({ location });
    })
  }

  componentWillUnmount() {
    if (this.unListen) {
      this.unListen();
    }
  }
  render() {
    const { location } = this.state;
    const { children, history } = this.props;
    return (
      <RouterContext.Provider value={{
        history,
        location,
        match: Router.computeRootMatch(location.pathname),
      }}>
        { children }
      </RouterContext.Provider>
    )
  }
}

export default Router;
