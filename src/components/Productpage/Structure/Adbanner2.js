import React from 'react'
import Ads from '../../../Images/banner1.png';

const Adbanner1 = () => {
  return (
<div style={{ width: '100%', overflow: 'hidden', height: '126px' , alignItems:'center', justifyContent:'center', display:'flex' , marginTop:'30px',marginBottom:'30px', position:'relative'}}>

    <img style={{ width: '75%', overflow: 'hidden', height: 'auto' , alignItems:'center', justifyContent:'center', display:'flex' }}src={Ads} alt='Advertisement Banner'/>
    </div>
  )
}

export default Adbanner1;