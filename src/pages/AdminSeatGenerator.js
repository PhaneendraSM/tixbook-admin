// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const seatStyle = {
//   width: 40,
//   height: 40,
//   margin: "0 5px",
//   backgroundColor: "#eee",
//   cursor: "pointer",
//   borderRadius: 4,
//   border: "solid #222",
//   borderWidth: "1px 1px 5px",
//   color: "#111",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   userSelect: "none",
//   transition: "all .2s ease-in-out",
// };

// const selectedStyle = {
//   backgroundColor: "rgb(24, 30, 100)",
//   color: "white",
//   borderBottomColor: "#189",
// };

// const bookedStyle = {
//   backgroundColor: "#aaa",
//   cursor: "not-allowed",
//   color: "white",
// };

// const spaceStyle = {
//   border: "none",
//   background: "transparent",
//   pointerEvents: "none",
//   width: 40,
//   height: 40,
//   margin: "0 5px",
// };

// function AdminSeatGenerator({ onGenerate }) {
//   const [rows, setRows] = useState(1);
//   const [seatsPerRow, setSeatsPerRow] = useState(10);
//   const [section, setSection] = useState("VIP");
//   const [seatType, setSeatType] = useState("seat");
//   const [price, setPrice] = useState(100);
//   const [startingRowLetter, setStartingRowLetter] = useState("A");

//   const handleGenerate = () => {
//     const data = [];
//     const baseCharCode = startingRowLetter.charCodeAt(0);

//     for (let i = 0; i < rows; i++) {
//       const rowLetter = String.fromCharCode(baseCharCode + i);
//       for (let j = 1; j <= seatsPerRow; j++) {
//         const seatId = rowLetter.toLowerCase() + j;
//         data.push({
//           id: seatId,
//           label: String(j),
//           row: rowLetter,
//           type: seatType,
//           section: section,
//           price: Number(price),
//         });
//       }
//     }

//     onGenerate(data);
//   };

//   return (
//     <div style={{ padding: 20, border: "1px solid #ccc", marginBottom: 20 }}>
//       <h3>Seat Generator</h3>
//       <label>
//         Rows:
//         <input
//           type="number"
//           value={rows}
//           min={1}
//           onChange={(e) => setRows(Number(e.target.value))}
//         />
//       </label>
//       <br />
//       <label>
//         Seats per Row:
//         <input
//           type="number"
//           value={seatsPerRow}
//           min={1}
//           onChange={(e) => setSeatsPerRow(Number(e.target.value))}
//         />
//       </label>
//       <br />
//       <label>
//         Starting Row Letter:
//         <input
//           type="text"
//           maxLength={1}
//           value={startingRowLetter}
//           onChange={(e) => setStartingRowLetter(e.target.value.toUpperCase())}
//         />
//       </label>
//       <br />
//       <label>
//         Section:
//         <select value={section} onChange={(e) => setSection(e.target.value)}>
//           <option value="VIP">VIP</option>
//           <option value="Balcony">Balcony</option>
//           <option value="Economy">Economy</option>
//         </select>
//       </label>
//       <br />
//       <label>
//         Seat Type:
//         <select value={seatType} onChange={(e) => setSeatType(e.target.value)}>
//           <option value="seat">seat</option>
//           <option value="booked">booked</option>
//           <option value="space">space</option>
//         </select>
//       </label>
//       <br />
//       <label>
//         Price:
//         <input
//           type="number"
//           value={price}
//           min={0}
//           onChange={(e) => setPrice(Number(e.target.value))}
//         />
//       </label>
//       <br />
//       <button onClick={handleGenerate}>Generate Seat Data</button>
//     </div>
//   );
// }

// function SeatAdminPanel() {
//   const [seatMapData, setSeatMapData] = useState([]);

//   // Reorder on drag end
//   const handleOnDragEnd = (result) => {
//     if (!result.destination) return;
//     const items = Array.from(seatMapData);
//     const [reordered] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reordered);
//     setSeatMapData(items);
//   };

//   // Delete seat on click
//   const handleDeleteSeat = (seatId) => {
//     if (window.confirm("Delete this seat?")) {
//       setSeatMapData((prev) => prev.filter((seat) => seat.id !== seatId));
//     }
//   };

//   return (
//     <div>
//       <AdminSeatGenerator onGenerate={setSeatMapData} />

//       <h2>Seat Layout</h2>
//       <DragDropContext onDragEnd={handleOnDragEnd}>
//         <Droppable droppableId="seats" direction="horizontal">
//           {(provided) => (
//             <div
//               style={{ display: "flex", flexWrap: "wrap", maxWidth: 900 }}
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//             >
//               {seatMapData.map((seat, index) => {
//                 let style = { ...seatStyle };
//                 if (seat.type === "selected") Object.assign(style, selectedStyle);
//                 if (seat.type === "booked") Object.assign(style, bookedStyle);
//                 if (seat.type === "space") style = { ...spaceStyle };

//                 return (
//                   <Draggable key={seat.id} draggableId={seat.id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         style={{
//                           ...style,
//                           ...provided.draggableProps.style,
//                           marginBottom: 10,
//                         }}
//                         onClick={() => handleDeleteSeat(seat.id)}
//                         title={`Row: ${seat.row}, Seat: ${seat.label}, Type: ${seat.type}, Price: $${seat.price}`}
//                       >
//                         {seat.type !== "space" ? seat.label : ""}
//                       </div>
//                     )}
//                   </Draggable>
//                 );
//               })}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// }

// export default SeatAdminPanel;
