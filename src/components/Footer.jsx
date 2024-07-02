import React from 'react'
import "../styles/Footer.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEnvelope, faHeart} from "@fortawesome/free-solid-svg-icons"
import {faInstagram, faLinkedin} from "@fortawesome/free-brands-svg-icons"
import {faSquareXTwitter} from "@fortawesome/free-brands-svg-icons"
import { toast , Bounce } from 'react-toastify'


const Footer = () => {

  const feedbackSubmit = (e) => {
    e.preventDefault()
    toast.success('Thank you for the feedback 😄 ' , {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    })
  }

  return (
    <div className='footer'>
      <div>
      <ul className='footer-icons'>
        <li>
      <a href='mailto:meghalbothra@gmail.com'><FontAwesomeIcon icon={faEnvelope} /></a>
      <a><FontAwesomeIcon icon={faLinkedin} /></a>
      <a><FontAwesomeIcon icon={ faSquareXTwitter} /></a>
      <a><FontAwesomeIcon icon={faInstagram} /></a>
        </li>
      </ul>
      </div>
      <ul className='footer-nav'>
        <li>
          <a href='/dashboard'>Home</a>
          <a href=''>About</a>
          <a href='/team'>Teams</a>
          <a href='mailto:meghalbothra@gmail.com'>Contact</a>
          </li>
      </ul>
      <form className='footer-feedback' action='post'>
        <input type='text' className='footer-feedback-input' placeholder='Feedback...' />
        <button type='Submit' className='footer-feedback-button' onClick={feedbackSubmit}>Submit</button>
      </form>
      <hr className='footer-separator' />
      <div className='footer-desc-and-rightsReserved'>
      <p className='footer-desc'>Created with  <FontAwesomeIcon icon={faHeart} style={{color: "#ff0000",}} /> by The Team</p>
      <p className='footer-rights-reserved'>@{new Date().getFullYear()} <strong>Team</strong>. All rights reserved</p>
      </div>
    </div>
  )
}

export default Footer
