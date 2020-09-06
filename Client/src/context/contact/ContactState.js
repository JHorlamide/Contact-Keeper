import React, { useReducer } from 'react';
import ContactContext from './contactContext.js';
import contactReducer from './contactReducer';
import { v1 as uuid } from 'uuid';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  UPDATE_CONTACT,
  SET_CURRENT,
  FILTER_CONTACT,
  CLEAR_CURRENT,
  CLEAR_FILTER,
} from '../types';

const ContactState = (props) => {
  const initialState = {
    contacts: [
      {
        name: 'Sam Smith',
        email: 'ssmith@gmail.com',
        phone: '111-111-1111',
        type: 'professional',
        id: uuid(),
      },
      {
        name: 'Harry White',
        email: 'hwhite@outlook.com',
        phone: '113-221-456',
        type: 'personal',
        id: uuid(),
      },
      {
        name: 'Tyler down',
        email: 'tylerdown@gmail.com',
        phone: '222-442-4444',
        type: 'professional',
        id: uuid(),
      },
    ],
    current: null,
    filtered: null,
  };

  const [state, dispatch] = useReducer(contactReducer, initialState);

  /*** Add Contact ***/
  const addContact = (contact) => {
    contact.id = uuid();
    dispatch({ type: ADD_CONTACT, payload: contact });
  };

  /*** Delete Contact ***/
  const deleteContact = (id) => {
    dispatch({ type: DELETE_CONTACT, payload: id });
  };

  /*** Update Contact ***/
  const updateContact = (contact) => {
    dispatch({ type: UPDATE_CONTACT, payload: contact });
  };

  /*** Filter Contact ***/
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACT, payload: text });
  };

  /*** Clear Filter ***/
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
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
        addContact,
        updateContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        filterContacts,
        clearFilter,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
