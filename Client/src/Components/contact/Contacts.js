import React, {useContext, Fragment} from 'react'
import ContactContext from '../../context/contact/contactContext';
import ContactItem from './ContactItem';

const Contact = () => {
  const contactContext = useContext(ContactContext);
  const { contacts } = contactContext;
  return (
    <Fragment>
      {contacts.map((contact) => {
        return (
          <ContactItem key={contact.id} contact={contact}/>
        )
      })}
    </Fragment>
  )
}

export default Contact;
