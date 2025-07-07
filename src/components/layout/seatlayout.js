// SeatingLayout.js
import React from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';

const SeatingLayout = ({ rowsConfig, categories }) => {
  const seatWidth = 30;
  const seatHeight = 30;
  const gap = 10;

  // Determine seat color using row override if set; else, global default.
  const getSeatColor = (section, rowOverride) => {
    const category = rowOverride !== 'DEFAULT' ? rowOverride : categories[section].category;
    switch(category) {
      case 'VIP':
        return '#FFD700'; // Gold for VIP
      case 'PREMIUM':
        return '#DA70D6'; // Orchid for Premium
      default:
        return 'lightblue'; // Standard
    }
  };

  const generateSeats = () => {
    const seats = [];
    let y = gap;
    rowsConfig.forEach((row, rowIndex) => {
      let x = gap;
      // Left Section
      for (let seat = 1; seat <= row.left; seat++) {
        seats.push({
          x,
          y,
          row: rowIndex + 1,
          section: 'left',
          seatNumber: seat,
          price: categories.left.price,
          fill: getSeatColor('left', row.leftCategory)
        });
        x += seatWidth + gap;
      }
      // Extra gap for Center Section
      x += seatWidth;
      for (let seat = 1; seat <= row.center; seat++) {
        seats.push({
          x,
          y,
          row: rowIndex + 1,
          section: 'center',
          seatNumber: seat,
          price: categories.center.price,
          fill: getSeatColor('center', row.centerCategory)
        });
        x += seatWidth + gap;
      }
      // Extra gap for Right Section
      x += seatWidth;
      for (let seat = 1; seat <= row.right; seat++) {
        seats.push({
          x,
          y,
          row: rowIndex + 1,
          section: 'right',
          seatNumber: seat,
          price: categories.right.price,
          fill: getSeatColor('right', row.rightCategory)
        });
        x += seatWidth + gap;
      }
      y += seatHeight + gap;
    });
    return seats;
  };

  const seats = generateSeats();

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {seats.map((seat, index) => (
          <Group key={index}>
            <Rect
              x={seat.x}
              y={seat.y}
              width={seatWidth}
              height={seatHeight}
              fill={seat.fill}
              stroke="black"
              strokeWidth={1}
            />
            <Text 
              x={seat.x} 
              y={seat.y + seatHeight / 4} 
              text={`${seat.section[0].toUpperCase()}${seat.seatNumber}`} 
              fontSize={10} 
              fill="black"
            />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
};

export default SeatingLayout;
