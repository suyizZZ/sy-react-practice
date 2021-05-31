// import { createStore, applyMiddleware }  from 'redux';
import { createStore, applyMiddleware } from '../sRedux';
// import logger from 'redux-logger';

function countReducer(state = 0, action) {
  switch(action.type) {
    case 'ADD':
      return state + 1;
    case 'MINUS':
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(countReducer, applyMiddleware(logger, thunk));

function logger({ getState }) {
  return next => action => {
    console.log('*****************************');
    console.log(action.type + '执行了');

    const prevState = getState();
    console.log('prev state', prevState);
    const returnValue = next(action);
    const nextState = getState();
    console.log("next state", nextState); 
    console.log("*******************************"); //sy-log
    return returnValue;
  }
}

function thunk({ dispatch, getState }) {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
  }
}

export default store;