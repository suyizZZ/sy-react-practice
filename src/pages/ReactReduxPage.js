import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connect } from '../sReactRedux';
@connect(
  // mapStateToProps
  (state) => {
    return {
      count: state
    }
  },
  // {
  //   add: () => ({ type: 'ADD' }),
  // }
  dispatch => {
    let creators = {
      add: () => ({type: "ADD"}),
      minus: () => ({type: "MINUS"})
    };
    creators = bindActionCreators(creators, dispatch);

    return {
      dispatch,
      ...creators
    };
  }
)
class ReactReduxPage extends Component {
  render() {
    const { count, dispatch, add } = this.props;
    console.log('pc', this.props);
    return (
      <div>
        <h3>ReactReduxPage</h3>
        <p>{count}</p>
        <button onClick={() => dispatch({ type: 'ADD' })}>dispatch add</button>
        <button onClick={add}>add</button>
      </div>
    );
  }
}

export default ReactReduxPage;
