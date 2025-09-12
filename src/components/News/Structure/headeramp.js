import React from 'react'
import imagelogo from "../../../Images/mainlogo.png"
import { Link } from 'react-router-dom'

const headeramp = () => {
  return (
    <>
    <div className='d-flex align-items-center justify-content-center w-100'>
   <a href='/'><img style={{width:'150px', height: '100px', objectFit:'cover'}} src={imagelogo} alt='Mototoctane | Logo'/></a> 
    </div>
    <hr style={{marginTop:'-25px'}}></hr>
    </>
  )
}

export default headeramp