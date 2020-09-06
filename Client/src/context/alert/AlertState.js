import React, { useReducer } from 'react';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from '../types';

const AlertState = (props) => {
  const inistialState = [];

  const [state, dispatch] = useReducer(alertReducer, inistialState);

  /*** Set Alert ***/
  const setAlert = (msg, type, timeOut = 3000) => {
    const id = uuid;
    dispatch({ type: SET_ALERT, payload: { msg, type, id } });

    /*** Remove Alert ***/
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      });
    }, timeOut);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
