import React from 'react'
import Video from './videosection';
import Videofull from './videosectionfull.js';
import Scrach from '../../../Images/scrach.png';


const youtubevideos = () => {
  return (
    <>
      <img className='scrach-image-2' src={Scrach} alt='scrach'></img>

      <section className=' mt-2 pt-3 mb-3 justify-content-center mobil-res'>
        <div className="label ">
          <p className="FIND-YOUR-PERFECT brand mt lefttext-mob">
            <span className="text-wrapper">TOP PICKS FOR</span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">YOU</span>
          </p>
         
        </div>
        <Video />

        <Videofull />

      </section>
    </>
  )
}

export default youtubevideos