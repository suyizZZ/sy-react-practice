import React from 'react';
import store from '../store';

export default class ReduxPage extends React.Component {

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    })
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }
  add = () => {
    store.dispatch({type: "ADD"});
  };

  render() {
    console.log(store);
    return (
      <div>
        <h3>ReduxPage</h3>
        <div>{store.getState()}</div> 
        <button onClick={this.add}>增加</button>
      </div>
    )
  }
}