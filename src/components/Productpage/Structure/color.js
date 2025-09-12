// import React, { useState } from 'react';
// // import './ColorSelector.css';

// const ColorSelector = () => {
//   const [selectedColor, setSelectedColor] = useState("color1");

//   const colors = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6'];

//   const changeColor = (color) => {
//     setSelectedColor(color);
//   };

//   const colorElements = colors.map((color, index) => (
//     <div
//       key={color}
//       className={`side-color ${color}`}
//       onClick={() => changeColor(color)}
//     ></div>
//   ));

//   const midIndex = Math.floor(colorElements.length / 2);

//   return (
//     <div className="color-container">
//       <div className="side-colors">
//         {colorElements.slice(0, midIndex)}
//         {selectedColor && <div className={`selected-color ${selectedColor}`}></div>}
//         {colorElements.slice(midIndex)}
//       </div>
//     </div>
//   );
// };

// export default ColorSelector;


import React, { useState } from 'react';
import cardData from '../../Homepage/Structure/subcomponents/cardData'; // Import the data array

const ColorSelector = () => {
  const [selectedColor, setSelectedColor] = useState("cardData[0].colors[color[0]]");

  const changeColor = (color) => {
    console.log('Selected color:', color);
    setSelectedColor(color);
  };

  const colors = Object.keys(cardData[0].colors);

  const colorElements = colors.map((color, index) => (
    <div
      key={color}
      className={`side-color ${color}`}
      onClick={() => changeColor(color)}
      style={{ backgroundColor: cardData[0].colors[color] }}
    ></div>
  ));

  const midIndex = Math.floor(colorElements.length / 2);

  return (
 
  );
};

export default ColorSelector;


