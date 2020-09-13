import React, { useReducer } from 'react';
import ContactContext from './contactContext.js';
import contactReducer from './contactReducer';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import {
  GET_CONTACTS,
  ADD_CONTACT,
  DELETE_CONTACT,
  UPDATE_CONTACT,
  SET_CURRENT,
  FILTER_CONTACT,
  CONTACT_ERROR,
  CLEAR_CURRENT,
  CLEAR_FILTER,
  CLEAR_CONTACTS,
} from '../types';

const ContactState = (props) => {
  const initialState = {
    contacts: null,
    current: null,
    filtered: null,
    error: null,
  };

  const [state, dispatch] = useReducer(contactReducer, initialState);

  /*** Get All User   Contact ***/
  const getAllContact = async () => {
    try {
      const res = await axios.get('/api/contacts');
      dispatch({
        type: GET_CONTACTS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err,
      });
    }
  };

  /*** Add Contact ***/
  const addContact = async (contact) => {
    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/contacts', contact, config);
      dispatch({
        type: ADD_CONTACT,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  /*** Delete Contact ***/
  const deleteContact = async (id) => {
    try {
      await axios.delete(`/api/contacts/${id}`);
      dispatch({
        type: DELETE_CONTACT,
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  /*** Update Contact ***/
  const updateContact = async (contact) => {
    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.put(
        `/api/contacts/${contact._id}`,
        contact,
        config
      );
      dispatch({
        type: UPDATE_CONTACT,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  /*** Filter Contact ***/
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACT, payload: text });
  };

  /*** Clear Filter ***/
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  /*** Clear Contacts ***/
  const clearContacts = async () => {
    dispatch({
      type: CLEAR_CONTACTS,
    });
  };

  /*** Set Current Contact ***/
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  /*** Clear  Current Contact ***/
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact,
        updateContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        filterContacts,
        clearFilter,
        clearContacts,
        getAllContact,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
