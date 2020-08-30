import React from 'react'
import Contact from '../contact/Contacts'
import ContactForm from '../contact/ContactForm'

const Home = () => {
  return (
    <div className='grid-2'>
      <div>
        <ContactForm/>
      </div>
      <div>
      <Contact/>
      </div>
    </div>
  )
}

export default Home;
