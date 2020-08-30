import React, {useContext,useRef} from 'react'
import ContactContext from '../../Context/contact/contactContext.js';

const ContactsFilter = () => {
  const text = useRef('');
  const contactContext = useContext(ContactContext);
  const { filtered, filterContacts } = contactContext;
  return (
    <form>
      <input ref={text} type='text' placeholder='Filter Contacts' onChange={onChange}/>
    </form>
  )
}

export default ContactsFilter;
