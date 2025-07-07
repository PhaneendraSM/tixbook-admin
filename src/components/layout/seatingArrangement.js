import React, { useState } from 'react';
import { Stage, Layer, Group, Circle, Rect, Text } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const SeatingArrangement = () => {
  const [seatingType, setSeatingType] = useState('round'); // 'round' or 'normal'
  const [category, setCategory] = useState('VIP');

  // Round table state
  const [tables, setTables] = useState([]);
  const [seatsPerTable, setSeatsPerTable] = useState(8);
  const [nextRoundX, setNextRoundX] = useState(100);
  const [nextRoundY, setNextRoundY] = useState(100);

  // Normal seat row state
  const [numRows, setNumRows] = useState(3);
  const [numCols, setNumCols] = useState(5);
  const [normalSeats, setNormalSeats] = useState([]);
  const [nextNormalY, setNextNormalY] = useState(100);

  const stageWidth = 1000;
  const stageHeight = 800;
  const tableRadius = 30;
  const seatRadius = 10;
  const seatSize = 40;
  const spacing = 10;

  // Add round table
  const addRoundTable = () => {
    const tableId = uuidv4();
    const centerX = nextRoundX;
    const centerY = nextRoundY;

    const newTable = {
      id: tableId,
      x: centerX,
      y: centerY,
      name: `Table ${tables.length + 1}`,
      category,
      price: category === 'VIP' ? 500 : category === 'Standard' ? 300 : 200,
      seats: Array.from({ length: seatsPerTable }).map((_, i) => {
        const angle = (i / seatsPerTable) * 2 * Math.PI;
        return {
          id: uuidv4(),
          number: i + 1,
          angle,
        };
      }),
    };

    setTables([...tables, newTable]);
    const nextXVal = nextRoundX + 150 > stageWidth ? 100 : nextRoundX + 150;
    const nextYVal = nextRoundX + 150 > stageWidth ? nextRoundY + 150 : nextRoundY;
    setNextRoundX(nextXVal);
    setNextRoundY(nextYVal);
  };

  // Add normal seat rows
  const addSeatRows = () => {
    const startX = 100;
    const startY = nextNormalY;

    const newSeats = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        newSeats.push({
          id: uuidv4(),
          x: startX + col * (seatSize + spacing),
          y: startY + row * (seatSize + spacing),
          row: `R${row + 1}`,
          col: col + 1,
          category,
          price: category === 'VIP' ? 500 : category === 'Standard' ? 300 : 200,
        });
      }
    }

    setNormalSeats([...normalSeats, ...newSeats]);
    setNextNormalY(startY + numRows * (seatSize + spacing) + 30);
  };

  const handleRoundDrag = (e, tableId) => {
    const newX = e.target.x();
    const newY = e.target.y();

    const updatedTables = tables.map(table => {
      if (table.id !== tableId) return table;
      return { ...table, x: newX, y: newY };
    });

    setTables(updatedTables);
  };

  const removeRoundTable = tableId => {
    setTables(tables.filter(t => t.id !== tableId));
  };

  const removeNormalSeat = seatId => {
    setNormalSeats(normalSeats.filter(s => s.id !== seatId));
  };

  const saveLayout = () => {
    if (seatingType === 'round') {
      axios.post('/api/save-round-layout', { tables }).then(() => {
        alert('Round layout saved!');
      }).catch(() => {
        alert('Failed to save layout.');
      });
    } else {
      axios.post('/api/save-normal-layout', { seats: normalSeats }).then(() => {
        alert('Normal layout saved!');
      }).catch(() => {
        alert('Failed to save layout.');
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <label>Seating Type: </label>
        <select value={seatingType} onChange={e => setSeatingType(e.target.value)} style={{ marginRight: 10 }}>
          <option value="round">Round Tables</option>
          <option value="normal">Normal Rows</option>
        </select>

        <label>Category: </label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginRight: 10 }}>
          <option value="VIP">VIP</option>
          <option value="Standard">Standard</option>
          <option value="Balcony">Balcony</option>
        </select>

        {seatingType === 'round' ? (
          <>
            <label>Seats/Table: </label>
            <input type="number" value={seatsPerTable} onChange={e => setSeatsPerTable(+e.target.value)} style={{ width: 60, marginRight: 10 }} />
            <button onClick={addRoundTable}>Add Round Table</button>
          </>
        ) : (
          <>
            <label>Rows: </label>
            <input type="number" value={numRows} onChange={e => setNumRows(+e.target.value)} style={{ width: 50, marginRight: 10 }} />
            <label>Columns: </label>
            <input type="number" value={numCols} onChange={e => setNumCols(+e.target.value)} style={{ width: 50, marginRight: 10 }} />
            <button onClick={addSeatRows}>Add Seat Rows</button>
          </>
        )}

        <button onClick={saveLayout} style={{ marginLeft: 20 }}>Save Layout</button>
      </div>

      <Stage width={stageWidth} height={stageHeight} style={{ border: '1px solid #ccc' }}>
        <Layer>
          {seatingType === 'round' &&
            tables.map(table => (
              <Group key={table.id} x={table.x} y={table.y} draggable onDragMove={e => handleRoundDrag(e, table.id)}>
                <Circle radius={tableRadius} fill="brown" stroke="black" />
                <Text text={table.name} fontSize={12} x={-30} y={tableRadius + 5} fill="white" />
                <Text text={`₹${table.price}`} fontSize={12} x={-15} y={-25} fill="white" />
                <Text text="X" fontSize={14} fill="red" x={tableRadius + 10} y={-tableRadius} onClick={() => removeRoundTable(table.id)} />
                {table.seats.map(seat => {
                  const seatX = Math.cos(seat.angle) * (tableRadius + 25);
                  const seatY = Math.sin(seat.angle) * (tableRadius + 25);
                  const seatColor = table.category === 'VIP' ? 'gold' : table.category === 'Standard' ? 'blue' : 'green';
                  return (
                    <Group key={seat.id}>
                      <Circle x={seatX} y={seatY} radius={seatRadius} fill={seatColor} stroke="black" strokeWidth={0.5} />
                      <Text text={seat.number.toString()} x={seatX - 4} y={seatY - 6} fontSize={10} fill="white" />
                    </Group>
                  );
                })}
              </Group>
            ))}

          {seatingType === 'normal' &&
            normalSeats.map(seat => {
              const seatColor = seat.category === 'VIP' ? 'gold' : seat.category === 'Standard' ? 'blue' : 'green';
              return (
                <Group key={seat.id}>
                  <Rect
                    x={seat.x}
                    y={seat.y}
                    width={seatSize}
                    height={seatSize}
                    fill={seatColor}
                    stroke="black"
                    strokeWidth={0.5}
                    onClick={() => removeNormalSeat(seat.id)}
                  />
                  <Text text={`${seat.row}${seat.col}`} x={seat.x + 5} y={seat.y + 10} fontSize={12} fill="white" />
                  <Text text={`₹${seat.price}`} x={seat.x + 2} y={seat.y + seatSize - 15} fontSize={10} fill="white" />
                </Group>
              );
            })}
        </Layer>
      </Stage>
    </div>
  );
};

export default SeatingArrangement;
