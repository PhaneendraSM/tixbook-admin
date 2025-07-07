// SeatIndex.js
import React, { useState } from "react";
import SeatConfig from "./seatConfig";
import SeatingLayout from "./seatlayout";



const SeatIndex = () => {
    const [config, setConfig] = useState({
        rowsConfig: Array.from({ length: 10 }, () => ({
          left: 3,
          center: 5,
          right: 3,
          leftCategory: 'DEFAULT',
          centerCategory: 'DEFAULT',
          rightCategory: 'DEFAULT'
        })),
        categories: {
          left: { category: 'STANDARD', price: 50 },
          center: { category: 'STANDARD', price: 100 },
          right: { category: 'STANDARD', price: 50 }
        }
      });
    
  return (
    <div>
      <SeatConfig onConfigUpdate={setConfig} />
      <SeatingLayout {...config} />
    </div>
  );    
};

export default SeatIndex;
