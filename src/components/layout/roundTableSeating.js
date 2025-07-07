import React, { useState } from 'react';
import { Stage, Layer, Circle, Text, Group } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function RoundTableSeating() {
  const [tables, setTables] = useState([]);
  const [seatsPerTable, setSeatsPerTable] = useState(8);
  const [category, setCategory] = useState('VIP');
  const [nextX, setNextX] = useState(100);
  const [nextY, setNextY] = useState(100);

  const [editingTableId, setEditingTableId] = useState(null);
const [tableNameInput, setTableNameInput] = useState('');
const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 });


  const stageWidth = 800;
  const stageHeight = 600;
  const tableRadius = 30;
  const seatRadius = 10;

  const addTable = () => {
    const tableId = uuidv4();
    const centerX = nextX;
    const centerY = nextY;
    const tableNumber = tables.length + 1;
  
    const newTable = {
      id: tableId,
      x: centerX,
      y: centerY,
      name: 'Table ' + tableNumber,
      category: category,
      price: category === 'VIP' ? 500 : category === 'Standard' ? 300 : 200,
      seats: Array.from({ length: seatsPerTable }).map(function (_, i) {
        const angle = (i / seatsPerTable) * 2 * Math.PI;
        const seatX = centerX + Math.cos(angle) * (tableRadius + 25);
        const seatY = centerY + Math.sin(angle) * (tableRadius + 25);
        return {
          id: uuidv4(),
          number: i + 1,
          x: seatX,
          y: seatY,
          angle: angle
        };
      })
    };
  
    setTables(function (prevTables) {
      return [...prevTables, newTable];
    });
  
    const nextXVal = nextX + 150 > stageWidth ? 100 : nextX + 150;
    const nextYVal = nextX + 150 > stageWidth ? nextY + 150 : nextY;
    setNextX(nextXVal);
    setNextY(nextYVal);
  };
  
  const handleTableDrag = function (e, tableId) {
    const updatedTables = tables.map(function (table) {
      if (table.id !== tableId) return table;

      const newX = e.target.x();
      const newY = e.target.y();
      const updatedSeats = table.seats.map(function (seat) {
        return {
          ...seat,
          x: newX + Math.cos(seat.angle) * (tableRadius + 25),
          y: newY + Math.sin(seat.angle) * (tableRadius + 25)
        };
      });

      return {
        ...table,
        x: newX,
        y: newY,
        seats: updatedSeats
      };
    });

    setTables(updatedTables);
  };

  const removeTable = function (tableId) {
    setTables(tables.filter(function (table) {
      return table.id !== tableId;
    }));
  };

  const saveLayout = function () {
    axios
      .post('/api/save-round-layout', { tables: tables })
      .then(function () {
        alert('Layout saved!');
      })
      .catch(function () {
        alert('Save failed');
      });
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { style: { marginBottom: 10 } },
      React.createElement(
        'label',
        null,
        'Seats/Table: ',
        React.createElement('input', {
          type: 'number',
          value: seatsPerTable,
          onChange: function (e) {
            setSeatsPerTable(parseInt(e.target.value));
          },
          style: { width: 50, marginRight: 10 }
        })
      ),
      React.createElement(
        'label',
        null,
        'Category: ',
        React.createElement(
          'select',
          {
            value: category,
            onChange: function (e) {
              setCategory(e.target.value);
            },
            style: { marginRight: 10 }
          },
          React.createElement('option', { value: 'VIP' }, 'VIP'),
          React.createElement('option', { value: 'Standard' }, 'Standard'),
          React.createElement('option', { value: 'Balcony' }, 'Balcony')
        )
      ),
      React.createElement(
        'button',
        { onClick: addTable, style: { marginRight: 10 } },
        'Add Round Table'
      ),
      React.createElement(
        'button',
        { onClick: saveLayout },
        'Save Layout'
      )
    ),
    React.createElement(
      Stage,
      { width: stageWidth, height: stageHeight, style: { border: '1px solid black' } },
      React.createElement(
        Layer,
        null,
        tables.map(function (table) {
          return React.createElement(
            Group,
            {
              key: table.id,
              draggable: true,
              x: table.x,
              y: table.y,
              onDragMove: function (e) {
                handleTableDrag(e, table.id);
              }
            },
            // Table circle
            React.createElement(Circle, {
              radius: tableRadius,
              fill: 'brown',
              x: 0,
              y: 0,
              stroke: 'black',
              strokeWidth: 1
            }),
            // Table price
            React.createElement(Text, {
              text: '₹' + table.price,
              x: -15,
              y: -25,
              fontSize: 12,
              fill: 'white'
            }),
            // Table name
            React.createElement(Text, {
                text: table.name,
                x: -30,
                y: tableRadius + 5,
                fontSize: 12,
                fill: 'white',
                onClick: function (e) {
                  const containerRect = e.target.getStage().container().getBoundingClientRect();
                  setEditingTableId(table.id);
                  setTableNameInput(table.name);
                  setInputPosition({
                    top: containerRect.top + table.y + tableRadius + 5,
                    left: containerRect.left + table.x - 30
                  });
                }
              }),
              
            // Delete button
            React.createElement(Text, {
              text: 'X',
              x: tableRadius + 10,
              y: -tableRadius,
              fontSize: 14,
              fill: 'red',
              onClick: function () {
                removeTable(table.id);
              }
            }),
            table.seats.map(function (seat) {
                const seatColor =
                  table.category === 'VIP'
                    ? 'gold'
                    : table.category === 'Standard'
                    ? 'blue'
                    : 'green';
            
                return React.createElement(
                  Group,
                  { key: seat.id },
                  React.createElement(Circle, {
                    x: seat.x - table.x,
                    y: seat.y - table.y,
                    radius: seatRadius,
                    fill: seatColor,
                    stroke: 'black',
                    strokeWidth: 0.5
                  }),
                  React.createElement(Text, {
                    text: seat.number.toString(),
                    x: seat.x - table.x - 4,
                    y: seat.y - table.y - 6,
                    fontSize: 10,
                    fill: 'white'
                  })
                );
              })
          );
        })
      )
    )
  );
}

export default RoundTableSeating;
