import React, { useCallback } from 'react';
import { useSelector, useDispatch } from '../kReactRedux';

function ReduxHooksPage() {
  const count = useSelector(({ count }) => count);
  const dispatch = useDispatch();
  const add = useCallback(() => {
    dispatch({ type: 'ADD' });
  }, []);
  
  return (
    <div>
      <h3>ReduxHooksPage</h3>
      <p>{count}</p>
      <button onClick={add}>add</button>
    </div>
  );
}

export default ReduxHooksPage;
