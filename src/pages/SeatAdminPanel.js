import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Edit2, Plus, Trash2, Save, RotateCcw, Menu, X, Check, GripVertical, Info } from 'lucide-react';
import { seatingPlan, getSeatingPlanById, updateSeatingPlan } from '../services/eventService';

const SeatMapEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Predefined categories with default prices (can be edited dynamically)
  const initialCategories = {
    sponsors: { name: 'Sponsors', price: 5000, color: '#FFD700' },
    vvip: { name: 'VVIP', price: 3000, color: '#FF6B6B' },
    vip: { name: 'VIP', price: 2000, color: '#4ECDC4' },
    reserved: { name: 'Reserved', price: 1500, color: '#45B7D1' },
    standard: { name: 'Standard', price: 1000, color: '#96CEB4' }
  };

  // Function to generate the complete seat map based on the screenshot pattern
  const generateSeatMap = (categories) => {
    const seatMap = {};

    const createSeatsForRow = (rowPrefix, startNum, endNum, categoryId) => {
      const seats = [];
      const categoryDetails = categories[categoryId];
      for (let i = startNum; i <= endNum; i++) {
        const seat = {
          id: `${rowPrefix.toLowerCase()}${i}`,
          label: `${rowPrefix}${i}`,
          type: 'seat',
          category: categoryId,
          price: categoryDetails ? categoryDetails.price : 0
        };
        seats.push(seat); 
      }
      return seats;
    };

    const addAisleSpace = (seats) => {
      const leftSection = seats.slice(0, 13);
      const rightSection = seats.slice(13);
      return [...leftSection, { id: `aisle-${Date.now()}-${Math.random()}`, label: '', type: 'space' }, ...rightSection];
    };

    seatMap['Sponsors'] = addAisleSpace(createSeatsForRow('SPO', 1, 26, 'sponsors'));
    seatMap['VVIP'] = addAisleSpace(createSeatsForRow('VV', 1, 26, 'vvip'));
    seatMap['VIP'] = addAisleSpace(createSeatsForRow('VIP', 1, 26, 'vip'));

    const reservedRows = ['Reserved 1', 'Reserved 2', 'Reserved 3', 'Reserved 4', 'Reserved 5', 'Reserved 6', 'Reserved 7', 'Reserved 8'];
    let rSeatNum = 1;
    reservedRows.forEach(rowKey => {
      const endNum = rSeatNum + 25;
      seatMap[rowKey] = addAisleSpace(createSeatsForRow('R', rSeatNum, endNum, 'reserved'));
      rSeatNum = endNum + 1;
    });

    const standardRows = ['Standard 1', 'Standard 2', 'Standard 3', 'Standard 4', 'Standard 5', 'Standard 6', 'Standard 7', 'Standard 8'];
    let sSeatNum = 1;
    standardRows.forEach(rowKey => {
      const endNum = sSeatNum + 25;
      seatMap[rowKey] = addAisleSpace(createSeatsForRow('S', sSeatNum, endNum, 'standard'));
      sSeatNum = endNum + 1;
    });

    return seatMap;
  };

  const [categories, setCategories] = useState(initialCategories);
  const [seatMap, setSeatMap] = useState({}); // Initialize as empty object
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSeatPosition, setSelectedSeatPosition] = useState({ x: 0, y: 0 });
  const [editingLabel, setEditingLabel] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showRowMenu, setShowRowMenu] = useState(null);
  const [stageName, setStageName] = useState('STAGE');
  const [editingStage, setEditingStage] = useState(false);
  const [stageEditValue, setStageEditValue] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '', price: '', color: '#96CEB4' });
  const [bulkAddCount, setBulkAddCount] = useState(10);
  const [seatMapName, setSeatMapName] = useState('Untitled Seat Map');
  const [editingSeatMapName, setEditingSeatMapName] = useState(false);
  const [seatMapNameEditValue, setSeatMapNameEditValue] = useState('');
  const [showRowColorModal, setShowRowColorModal] = useState(false);
  const [selectedRowForColor, setSelectedRowForColor] = useState(null);
  const [rowColorValue, setRowColorValue] = useState('#96CEB4');

  // Row name editing state
  const [editingRowName, setEditingRowName] = useState(null);
  const [rowNameEditValue, setRowNameEditValue] = useState('');

  // Drag and drop state
  const [draggedRow, setDraggedRow] = useState(null);
  const [dragOverRow, setDragOverRow] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const editInputRef = useRef(null);
  const stageInputRef = useRef(null);
  const seatMapNameInputRef = useRef(null);
  const rowNameInputRef = useRef(null);

  const [toasts, setToast] = useState({ message: '', type: 'success', visible: false });

  // Add new state for loading
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // Drag and drop handlers
  const handleDragStart = (e, rowId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', rowId);
    setDraggedRow(rowId);
    setIsDragging(true);
    setShowRowMenu(null); // Close any open menus
  };

  const handleDragOver = (e, rowId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedRow !== rowId) {
      setDragOverRow(rowId);
    }
  };

  const handleDragLeave = (e, rowId) => {
    e.preventDefault();
    if (dragOverRow === rowId) {
      setDragOverRow(null);
    }
  };

  const handleDrop = (e, targetRowId) => {
    e.preventDefault();
    if (draggedRow && draggedRow !== targetRowId) {
      // Reorder the seatMap
      const rowEntries = Object.entries(seatMap);
      const draggedIndex = rowEntries.findIndex(([key]) => key === draggedRow);
      const targetIndex = rowEntries.findIndex(([key]) => key === targetRowId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newRowEntries = [...rowEntries];
        const [draggedEntry] = newRowEntries.splice(draggedIndex, 1);
        newRowEntries.splice(targetIndex, 0, draggedEntry);
        
        const newSeatMap = Object.fromEntries(newRowEntries);
        setSeatMap(newSeatMap);
        showToast(`Row "${draggedRow}" moved to position ${targetIndex + 1}`);
      }
    }
    setDraggedRow(null);
    setDragOverRow(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setDraggedRow(null);
    setDragOverRow(null);
    setIsDragging(false);
  };

  useEffect(() => {
    if (editingLabel && editInputRef.current) editInputRef.current.focus();
  }, [editingLabel]);

  useEffect(() => {
    if (editingStage && stageInputRef.current) stageInputRef.current.focus();
  }, [editingStage]);

  useEffect(() => {
    if (editingField && editInputRef.current) editInputRef.current.focus();
  }, [editingField]);

  useEffect(() => {
    if (editingSeatMapName && seatMapNameInputRef.current) seatMapNameInputRef.current.focus();
  }, [editingSeatMapName]);

  useEffect(() => {
    if (editingRowName && rowNameInputRef.current) rowNameInputRef.current.focus();
  }, [editingRowName]);

  // Add click outside handler for row menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showRowMenu) {
        // Check if click is outside the row menu
        const menuElement = document.querySelector('.row-menu-dropdown');
        const menuButton = document.querySelector('.row-menu-button');
        
        if (menuElement && !menuElement.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setShowRowMenu(null);
        }
      }
    };

    if (showRowMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRowMenu]);

  useEffect(() => {
    const loadSeatingPlan = async () => {
      try {
        setIsLoading(true);
        if (id) {
          console.log('Loading seatmap with ID:', id);
          const response = await getSeatingPlanById(id);
          console.log('Raw API Response:', response);
          
          const seatmapData = response?.data || response;
          console.log('Seatmap data to process:', seatmapData);

          if (!seatmapData || !Array.isArray(seatmapData) || seatmapData.length === 0) {
            console.error('Invalid API response structure');
            throw new Error('Invalid API response');
          }

          const seatmap = seatmapData[0];
          console.log('Processing seatmap:', seatmap);
          
          // Set the seatmap name from the API response
          if (seatmap.name) {
            setSeatMapName(seatmap.name);
          }
          
          if (!seatmap || !Array.isArray(seatmap.sections)) {
            console.error('Invalid seatmap structure:', {
              hasSeatmap: !!seatmap,
              hasSections: !!seatmap?.sections,
              isSectionsArray: Array.isArray(seatmap?.sections)
            });
            throw new Error('Invalid seatmap structure');
          }

          // Extract categories from the seat data
          const extractedCategories = { ...initialCategories };
          const categoryColors = {
            sponsors: '#FFD700',
            vvip: '#FF6B6B', 
            vip: '#4ECDC4',
            reserved: '#45B7D1',
            standard: '#96CEB4',
            economy: '#FFA500' // Default color for economy
          };

          // Transform API data to match our seatMap format
          const transformedSeatMap = {};
          
          // Process each section
          seatmap.sections.forEach(section => {
            console.log('Processing section:', section.name);
            const sectionSeats = [];
            
            // Process each row in the section
            if (Array.isArray(section.rows)) {
              section.rows.forEach(row => {
                console.log('Processing row:', row.rowNumber, 'Seats:', row.seats?.length);
                // Add seats from this row to the section
                if (Array.isArray(row.seats)) {
                  row.seats.forEach(seat => {
                    // Detect if this is a space (aisle)
                    const isSpace = (!seat.level || seat.level === '') && (!seat.price || seat.price === 0);

                    if (isSpace) {
                      // Add a space item
                      sectionSeats.push({
                        id: seat._id || seat.id || `space-${Date.now()}-${Math.random()}`,
                        label: '', // No label for space
                        type: 'space'
                      });
                    } else {
                      // This is a real seat, use the seatNumber from API
                      const categoryId = (seat.level || '').toLowerCase();
                      // Dynamically create category if it doesn't exist
                      if (categoryId && !extractedCategories[categoryId]) {
                        const categoryName = seat.level || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
                        const defaultPrice = categoryId === 'economy' ? 500 : 1000; // Default price for economy
                        extractedCategories[categoryId] = {
                          name: categoryName,
                          price: defaultPrice,
                          color: categoryColors[categoryId] || '#CCCCCC'
                        };
                        console.log('Created new category:', categoryId, extractedCategories[categoryId]);
                      }

                      sectionSeats.push({
                        id: seat._id || seat.id,
                        label: seat.seatNumber ? seat.seatNumber.toString() : seat.label || '',
                        type: 'seat',
                        category: categoryId,
                        price: Number(seat.price) || 0,
                        reserved: Boolean(seat.reserved),
                        name: seat.name,
                        color: seat.color || null
                      });
                    }
                  });
                }

                // Add aisle space after every 13 seats (if needed)
                if (sectionSeats.length % 27 === 13) {
                  sectionSeats.push({
                    id: `aisle-${Date.now()}-${Math.random()}`,
                    label: '',
                    type: 'space'
                  });
                }
              });
            }

            // Store the transformed seats for this section
            transformedSeatMap[section.name] = sectionSeats;
          });

          console.log('Extracted categories:', extractedCategories);
          console.log('Final transformed seat map:', transformedSeatMap);
          
          // Update both categories and seatMap
          setCategories(extractedCategories);
          setSeatMap(transformedSeatMap);
        } else {
          console.log('No ID provided, using default layout');
          // No ID provided, use default generated map
          setSeatMap(generateSeatMap(initialCategories));
        }
      } catch (error) {
        console.error('Error loading seating plan:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        toast.error(`Failed to load seating plan: ${error.message}`);
        // Fallback to default generated map on error
        setSeatMap(generateSeatMap(initialCategories));
      } finally {
        setIsLoading(false);
      }
    };

    loadSeatingPlan();
  }, [id]);

  // Add debug logging for component mount and updates
  useEffect(() => {
    console.log('SeatMapEditor mounted/updated with id:', id);
  }, [id]);

  // Add debug logging for seatMap changes
  useEffect(() => {
    console.log('Current seatMap state:', seatMap);
  }, [seatMap]);

  // Add debug logging for categories changes
  useEffect(() => {
    console.log('Current categories state:', categories);
  }, [categories]);

  const getSeatStyle = (seat) => {
    const baseStyle = { 
      width: '32px', 
      height: '32px', 
      margin: '2px 4px 2px 2px', 
      borderRadius: '4px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: '10px', 
      fontWeight: 'bold', 
      cursor: 'pointer', 
      border: '1px solid #ddd', 
      transition: 'all 0.2s ease',
      position: 'relative'
    };
    
    if (seat.type === 'space') {
      return { 
        ...baseStyle, 
        backgroundColor: 'transparent', 
        border: '1px dashed #ccc',
        cursor: 'pointer'
      };
    }
    
    // Prioritize saved color from API, fallback to category color, then default
    const seatColor = seat.color || categories[seat.category]?.color || '#CCCCCC';
    const style = { 
      ...baseStyle, 
      backgroundColor: seatColor, 
      color: '#fff', 
      textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
    };

    // Add reserved seat styling
    if (seat.reserved === true) { // Explicitly check for true
      return {
        ...style,
        opacity: 0.7,
        border: '2px solid #dc3545',
        position: 'relative',
        '&::after': {
          content: '"R"',
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#dc3545',
          color: 'white',
          borderRadius: '50%',
          width: '16px',
          height: '16px',
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      };
    }

    return style;
  };

  const selectedSeatStyle = { 
    ...getSeatStyle({ type: 'seat' }), 
    boxShadow: '0 0 0 3px #FF6B6B', 
    transform: 'scale(1.1)', 
    zIndex: 10 
  };

  const selectedSpaceStyle = { 
    ...getSeatStyle({ type: 'space' }), 
    boxShadow: '0 0 0 3px #FF6B6B', 
    border: '1px dashed #FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    transform: 'scale(1.1)', 
    zIndex: 10 
  };

  const handleSeatClick = (rowId, seatIndex, seat, event) => {
    if (editingLabel || editingField) return;
    const rect = event.target.getBoundingClientRect();
    const containerRect = event.target.closest('.seat-map-container')?.getBoundingClientRect() || document.body.getBoundingClientRect();
    setSelectedSeatPosition({ x: rect.right - containerRect.left + 10, y: rect.top - containerRect.top });
    setSelectedSeat(`${rowId}-${seatIndex}`);
  };

  const handleSeatDoubleClick = (rowId, seatIndex, seat) => {
    if (seat.type === 'space') {
      showToast('Spaces cannot be edited. Use the popup menu to delete them.', 'info');
      return;
    }
    setSelectedSeat(null);
    setEditingLabel(`${rowId}-${seatIndex}`);
    setEditValue(seat.label);
  };

  const handleLabelEdit = (rowId, seatIndex) => {
    const oldLabel = seatMap[rowId][seatIndex].label;
    setSeatMap(prev => ({ ...prev, [rowId]: prev[rowId].map((seat, idx) => idx === seatIndex ? { ...seat, label: editValue } : seat) }));
    setEditingLabel(null);
    setEditValue('');
    showToast(`Seat label updated from "${oldLabel}" to "${editValue}"`);
  };

  const handleKeyDown = (e, rowId, seatIndex) => {
    if (e.key === 'Enter') handleLabelEdit(rowId, seatIndex);
    else if (e.key === 'Escape') { setEditingLabel(null); setEditValue(''); showToast('Label editing cancelled', 'info'); }
  };

  const startFieldEdit = (type, rowId, seatIndex, currentValue) => {
    setEditingField({ type, rowId, seatIndex });
    setEditValue(currentValue !== null && currentValue !== undefined ? currentValue.toString() : '');
    setSelectedSeat(null);
  };

  const handleFieldEdit = () => {
    if (!editingField) return;
    const { type, rowId, seatIndex } = editingField;
    const seatToUpdate = seatMap[rowId][seatIndex];
    if (type === 'price') {
      seatToUpdate.price = parseFloat(editValue) || 0;
      showToast(`Seat price updated to $${seatToUpdate.price}`);
    } else if (type === 'category') {
      seatToUpdate.category = editValue;
      seatToUpdate.price = categories[editValue]?.price || 0;
      showToast(`Seat category updated to "${categories[editValue]?.name || editValue}"`);
    } else if (type === 'color') {
      seatToUpdate.color = editValue;
      showToast(`Seat color updated`);
    }
    setSeatMap(prev => ({ ...prev, [rowId]: [...prev[rowId]] }));
    setEditingField(null);
    setEditValue('');
  };

  const resetSeatColor = (rowId, seatIndex) => {
    const seatToUpdate = seatMap[rowId][seatIndex];
    seatToUpdate.color = null; // Reset to category default
    setSeatMap(prev => ({ ...prev, [rowId]: [...prev[rowId]] }));
    setSelectedSeat(null);
    showToast(`Seat color reset to category default`);
  };

  const changeRowColor = (rowId) => {
    setSelectedRowForColor(rowId);
    setRowColorValue('#96CEB4'); // Default color
    setShowRowColorModal(true);
    setShowRowMenu(null);
  };

  const handleRowColorSubmit = () => {
    if (!selectedRowForColor) return;
    
    setSeatMap(prev => ({
      ...prev,
      [selectedRowForColor]: prev[selectedRowForColor].map(seat => {
        if (seat.type === 'seat') {
          return { ...seat, color: rowColorValue };
        }
        return seat;
      })
    }));
    
    showToast(`Row "${selectedRowForColor}" color updated to ${rowColorValue}`);
    setShowRowColorModal(false);
    setSelectedRowForColor(null);
  };

  const resetRowColor = (rowId) => {
    setSeatMap(prev => ({
      ...prev,
      [rowId]: prev[rowId].map(seat => {
        if (seat.type === 'seat') {
          return { ...seat, color: null }; // Reset to category default
        }
        return seat;
      })
    }));
    showToast(`Row "${rowId}" color reset to category defaults`);
    setShowRowMenu(null);
  };

  const handleFieldKeyDown = (e) => {
    if (e.key === 'Enter') handleFieldEdit();
    else if (e.key === 'Escape') setEditingField(null);
  };

  const handleStageUpdate = () => {
    if (stageEditValue.trim()) {
      setStageName(stageEditValue.trim());
      showToast(`Stage name updated`);
    } else showToast('Stage name cannot be empty', 'error');
    setEditingStage(false);
  };

  const handleStageKeyDown = (e) => {
    if (e.key === 'Enter') handleStageUpdate();
    else if (e.key === 'Escape') setEditingStage(false);
  };

  const deleteSeat = (rowId, seatIndex) => {
    const seat = seatMap[rowId][seatIndex];
    setSeatMap(prev => ({ ...prev, [rowId]: prev[rowId].filter((_, idx) => idx !== seatIndex) }));
    setSelectedSeat(null);
    showToast(`${seat.type === 'seat' ? 'Seat' : 'Space'} deleted from row ${rowId}`, 'danger');
  };

  const addSeatsToRow = (rowId, count = 1) => {
    const row = seatMap[rowId];
    if (!row) return;

    const defaultCatId = Object.keys(categories).find(key => key === 'standard') || Object.keys(categories)[0];
    const newSeats = [];
    const seatNumbers = row.map(s => parseInt(s.label.replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
    let nextNum = seatNumbers.length > 0 ? Math.max(...seatNumbers) + 1 : 1;

    for (let i = 0; i < count; i++) {
        newSeats.push({
            id: `${rowId.toLowerCase().replace(/ /g, '')}-${nextNum}`,
            label: `${nextNum}`,
            type: 'seat',
            category: row[0]?.category || defaultCatId,
            price: categories[row[0]?.category || defaultCatId]?.price || 0
        });
        nextNum++;
    }

    setSeatMap(prev => ({ ...prev, [rowId]: [...prev[rowId], ...newSeats] }));
    setShowRowMenu(null);
    showToast(`${count} new seat(s) added to row ${rowId}`);
  };

  const addSpaceToRow = (rowId, seatIndex = null) => {
    const newSpace = { id: `${rowId}-space-${Date.now()}`, label: '', type: 'space' };
    
    if (seatIndex !== null) {
      // Insert space to the left of the selected seat
      setSeatMap(prev => ({
        ...prev,
        [rowId]: [
          ...prev[rowId].slice(0, seatIndex),
          newSpace,
          ...prev[rowId].slice(seatIndex)
        ]
      }));
      showToast(`Space added to the left of seat ${seatMap[rowId][seatIndex]?.label || seatIndex + 1}`);
    } else {
      // Add space at the end of the row (for row menu)
      setSeatMap(prev => ({ ...prev, [rowId]: [...prev[rowId], newSpace] }));
      showToast(`Space added to the end of row ${rowId}`);
    }
    setShowRowMenu(null);
  };

  const deleteRow = (rowId) => {
    const seatCount = seatMap[rowId].filter(s => s.type === 'seat').length;
    setSeatMap(prev => { const newMap = { ...prev }; delete newMap[rowId]; return newMap; });
    showToast(`Row ${rowId} deleted (${seatCount} seats removed)`, 'danger');
    setShowRowMenu(null);
  };
  
  // const handleAddRowForCategory = (categoryId) => {
  //     const category = categories[categoryId];
  //     if (!category) return;

  //     const baseName = category.name;
  //     const existingRows = Object.keys(seatMap).filter(key => key.startsWith(baseName));
  //     const newRowName = existingRows.length > 0 ? `${baseName} ${existingRows.length + 1}` : baseName;
      
  //     const defaultSeats = [
  //       { id: `${newRowName.toLowerCase().replace(/ /g,'')}1`, label: '1', type: 'seat', category: categoryId, price: category.price || 0 },
  //       { id: `${newRowName.toLowerCase().replace(/ /g,'')}2`, label: '2', type: 'seat', category: categoryId, price: category.price || 0 },
  //       { id: `${newRowName.toLowerCase().replace(/ /g,'')}3`, label: '3', type: 'seat', category: categoryId, price: category.price || 0 },
  //     ];

  //     setSeatMap(prev => ({
  //       ...prev,
  //       [newRowName]: defaultSeats
  //     }));
  //     showToast(`New row ${newRowName} added`);
  //     setShowCategoryManager(false);
  // };

  const duplicateRow = (rowId) => {
    const originalRow = seatMap[rowId];
    if (!originalRow) return;

    // Find the highest seat number from the row being duplicated
    const rowSeats = originalRow.filter(s => s.type === 'seat');
    const seatNumbers = rowSeats.map(s => parseInt(s.label.replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
    const nextSeatNumber = seatNumbers.length > 0 ? Math.max(...seatNumbers) + 1 : 1;

    // Generate new row name
    const baseName = rowId.replace(/\s+\d+$/, ''); // Remove any existing number suffix
    const existingRows = Object.keys(seatMap).filter(key => key.startsWith(baseName));
    const newRowName = `${baseName} ${existingRows.length + 1}`;

    // Duplicate seats with new numbers
    let seatCounter = 0; // Counter for actual seats only (excluding spaces)
    const duplicatedSeats = originalRow.map((seat, index) => {
      if (seat.type === 'space') {
        return {
          ...seat,
          id: `${newRowName.toLowerCase().replace(/ /g, '')}-space-${Date.now()}-${index}`
        };
      } else {
        const newSeatNumber = nextSeatNumber + seatCounter;
        seatCounter++; // Only increment for actual seats
        return {
          ...seat,
          id: `${newRowName.toLowerCase().replace(/ /g, '')}-${newSeatNumber}`,
          label: newSeatNumber.toString()
        };
      }
    });

    // Insert the new row after the original row
    const rowEntries = Object.entries(seatMap);
    const originalIndex = rowEntries.findIndex(([key]) => key === rowId);
    const newRowEntries = [...rowEntries];
    newRowEntries.splice(originalIndex + 1, 0, [newRowName, duplicatedSeats]);
    
    const newSeatMap = Object.fromEntries(newRowEntries);
    setSeatMap(newSeatMap);
    
    const seatCount = duplicatedSeats.filter(s => s.type === 'seat').length;
    showToast(`Row "${newRowName}" duplicated with ${seatCount} seats (starting from seat ${nextSeatNumber})`);
    setShowRowMenu(null);
  };
  
  const handleAddRowForCategory = (categoryId) => {
      const category = categories[categoryId];
      if (!category) return;

      const baseName = category.name;
      const existingRows = Object.keys(seatMap).filter(key => key.startsWith(baseName));
      const newRowName = existingRows.length > 0 ? `${baseName} ${existingRows.length + 1}` : baseName;
      
      const defaultSeats = [
        { id: `${newRowName.toLowerCase().replace(/ /g,'')}1`, label: '1', type: 'seat', category: categoryId, price: category.price || 0 },
        { id: `${newRowName.toLowerCase().replace(/ /g,'')}2`, label: '2', type: 'seat', category: categoryId, price: category.price || 0 },
        { id: `${newRowName.toLowerCase().replace(/ /g,'')}3`, label: '3', type: 'seat', category: categoryId, price: category.price || 0 },
      ];

      setSeatMap(prev => ({
        ...prev,
        [newRowName]: defaultSeats
      }));
      showToast(`New row ${newRowName} added`);
      setShowCategoryManager(false);
  };

  const addNewRow = () => {
    const newRowName = `New Row ${Object.keys(seatMap).length + 1}`;
    const defaultCatId = Object.keys(categories).find(key => key === 'standard') || Object.keys(categories)[0];
    const catDetails = categories[defaultCatId];
    setSeatMap(prev => ({
      ...prev,
      [newRowName]: [
        { id: `${newRowName.toLowerCase().replace(/ /g,'')}1`, label: '1', type: 'seat', category: defaultCatId, price: catDetails?.price || 0 },
        { id: `${newRowName.toLowerCase().replace(/ /g,'')}2`, label: '2', type: 'seat', category: defaultCatId, price: catDetails?.price || 0 },
        { id: `${newRowName.toLowerCase().replace(/ /g,'')}3`, label: '3', type: 'seat', category: defaultCatId, price: catDetails?.price || 0 },
      ]
    }));
    showToast(`New row ${newRowName} added`);
  };

  const getTotalSeats = () => Object.values(seatMap).flat().filter(s => s.type === 'seat').length;

  const regenerateSeatMap = () => {
    // Don't reset categories, just regenerate the seat map with current categories
    setSeatMap(generateSeatMap(categories));
    showToast('Seat map has been reset to the default template');
  };

  const startEditCategory = (id, category) => {
    setCategoryForm({ id, ...category, price: category.price.toString() });
  };

  const deleteCategory = (categoryId) => {
    if (Object.keys(categories).length <= 1) {
      showToast('Cannot delete the last category', 'error');
      return;
    }
    
    const categoryToDelete = categories[categoryId];
    const defaultCatId = Object.keys(categories).find(id => id !== categoryId) || '';

    setSeatMap(prevMap => {
        const newMap = {...prevMap};
        Object.keys(newMap).forEach(rowId => {
            newMap[rowId] = newMap[rowId].map(seat => 
                seat.category === categoryId ? { ...seat, category: defaultCatId, price: categories[defaultCatId]?.price || 0 } : seat
            );
        });
        return newMap;
    });

    setCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[categoryId];
      return newCategories;
    });
    showToast(`Category '${categoryToDelete.name}' deleted. Its seats have been reassigned.`, 'danger');
  };

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategorySubmit = () => {
    if (!categoryForm.name.trim()) {
        showToast('Category name is required', 'error');
        return;
    }
    const { id, name, price, color } = categoryForm;
    const newPrice = parseFloat(price) || 0;

    if (id) { // Updating existing category
        const oldCategoryName = categories[id].name;
        const newCategoryName = name;
        const oldColor = categories[id].color;
        
        setCategories(prev => ({...prev, [id]: { name, price: newPrice, color }}));
        setSeatMap(prevMap => {
            const newMap = {...prevMap};
            // Update prices on all seats of this category
            Object.keys(newMap).forEach(rowId => {
                newMap[rowId] = newMap[rowId].map(seat => {
                    if (seat.category === id) {
                        const updatedSeat = { ...seat, price: newPrice };
                        // If color changed, update seat colors to match new category color
                        if (oldColor !== color) {
                            updatedSeat.color = color;
                        }
                        return updatedSeat;
                    }
                    return seat;
                });
            });

            // Rename the primary row key if it exists and name has changed
            if (newMap[oldCategoryName] && oldCategoryName !== newCategoryName) {
                const rowData = newMap[oldCategoryName];
                delete newMap[oldCategoryName];
                newMap[newCategoryName] = rowData;
            }

            return newMap;
        });
        showToast(`Category "${name}" updated successfully${oldColor !== color ? ' (all seats updated to new color)' : ''}`);
    } else { // Adding new category
        const newId = name.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
        if (Object.values(categories).some(c => c.name === name)) {
            showToast('Category with this name already exists.', 'error');
            return;
        }
        const newCategory = { name, price: newPrice, color };
        setCategories(prev => ({...prev, [newId]: newCategory }));
        handleAddRowForCategory(newId);
        showToast(`Category "${name}" added successfully`);
    }
    setCategoryForm({ id: null, name: '', price: '', color: '#96CEB4' }); // Reset form
  };

  const handleSeatMapNameUpdate = () => {
    if (seatMapNameEditValue.trim()) {
      setSeatMapName(seatMapNameEditValue.trim());
      showToast(`Seat map name updated`);
    } else showToast('Seat map name cannot be empty', 'error');
    setEditingSeatMapName(false);
  };

  const handleSeatMapNameKeyDown = (e) => {
    if (e.key === 'Enter') handleSeatMapNameUpdate();
    else if (e.key === 'Escape') setEditingSeatMapName(false);
  };

  const handleRowNameUpdate = (oldRowName) => {
    if (rowNameEditValue.trim() && rowNameEditValue.trim() !== oldRowName) {
      // Check if the new name already exists
      if (seatMap[rowNameEditValue.trim()]) {
        showToast('Row name already exists', 'error');
        return;
      }
      
      // Update the seatMap with the new row name while preserving order
      setSeatMap(prev => {
        const newSeatMap = {};
        const rowEntries = Object.entries(prev);
        
        // Rebuild the object in the same order, replacing the old name with the new one
        rowEntries.forEach(([key, value]) => {
          if (key === oldRowName) {
            newSeatMap[rowNameEditValue.trim()] = value;
          } else {
            newSeatMap[key] = value;
          }
        });
        
        return newSeatMap;
      });
      showToast(`Row name updated from "${oldRowName}" to "${rowNameEditValue.trim()}"`);
    } else if (!rowNameEditValue.trim()) {
      showToast('Row name cannot be empty', 'error');
    }
    setEditingRowName(null);
    setRowNameEditValue('');
  };

  const handleRowNameKeyDown = (e, oldRowName) => {
    if (e.key === 'Enter') handleRowNameUpdate(oldRowName);
    else if (e.key === 'Escape') {
      setEditingRowName(null);
      setRowNameEditValue('');
    }
  };

  const saveSeatMapToApi = async () => {
    console.log("Saving data...", { seatMap, seatMapName });

    const transformed = {
      name: seatMapName,
      sections: Object.entries(seatMap).map(([sectionName, seats]) => {
        let rowCounter = 1;
        const rowSize = 27; // Adjust as per your layout

        const rows = [];

        for (let i = 0; i < seats.length; i += rowSize) {
          const rowSeats = seats.slice(i, i + rowSize);

          const formattedSeats = rowSeats.map((seat, index) => {
            const categoryColor = categories[seat.category]?.color || '#CCCCCC';
            return {
              seatNumber: seat.type === 'seat' ? parseInt(seat.label) || (index + 1) : null,
              id: seat.id || null,
              label: seat.label || '',
              type: seat.type,
              level: seat.category || '',
              price: seat.type === 'seat' ? seat.price ?? 0 : null,
              reserved: seat.type === 'seat' ? seat.reserved || false : false,
              color: seat.type === 'seat' ? (seat.color || categoryColor) : ''
            };
          });

          rows.push({
            rowNumber: rowCounter++,
            seats: formattedSeats
          });
        }

        return {
          name: sectionName,
          rows
        };
      })
    };

    try {
      let res;
      if (id) {
        // Update existing seatmap
        res = await updateSeatingPlan(id, transformed);
      } else {
        // Create new seatmap
        res = await seatingPlan(null, transformed);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success('Seat map saved successfully!');
        // If this was a new seatmap, navigate to the edit URL with the new ID
        if (!id && res.data?._id) {
          navigate(`/seating-editor/${res.data._id}`);
        }
      } else {
        toast.error('Failed to save seat map.', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('An error occurred while saving.', 'error');
    }
  };

  const renderSeat = (seat, rowId, seatIndex) => {
    console.log('Rendering seat:', { seat, rowId, seatIndex, reserved: seat.reserved });
    const isSelected = selectedSeat === `${rowId}-${seatIndex}`;
    const isEditing = editingLabel === `${rowId}-${seatIndex}`;
    const seatStyle = isSelected 
      ? (seat.type === 'space' ? selectedSpaceStyle : selectedSeatStyle)
      : getSeatStyle(seat);
    
    if (seat.type === 'space') {
      return (
        <div 
          key={seat.id} 
          style={seatStyle} 
          onClick={(e) => handleSeatClick(rowId, seatIndex, seat, e)}
          onDoubleClick={() => handleSeatDoubleClick(rowId, seatIndex, seat)}
          title="Space (double-click to edit, click to select)"
          className="space-item"
        />
      );
    }
    
    const isReserved = Boolean(seat.reserved);
    console.log('Seat reserved status:', { seatId: seat.id, isReserved });
    
    return (
      <div 
        key={seat.id} 
        style={{
          ...seatStyle,
          ...(isReserved && {
            opacity: 0.7,
            border: '2px solid #dc3545',
            position: 'relative'
          })
        }}
        onClick={(e) => handleSeatClick(rowId, seatIndex, seat, e)} 
        onDoubleClick={() => handleSeatDoubleClick(rowId, seatIndex, seat)} 
        title={`${seat.label} - ${categories[seat.category]?.name || 'N/A'} - £${seat.price || 0} ${isReserved ? ' (Reserved)' : ''}`}
      >
        {isReserved && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}>
            R
          </div>
        )}
        {isEditing ? (
          <input 
            ref={editInputRef} 
            type="text" 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)} 
            onBlur={() => handleLabelEdit(rowId, seatIndex)} 
            onKeyDown={(e) => handleKeyDown(e, rowId, seatIndex)} 
            onClick={(e) => e.stopPropagation()} 
            className="form-control text-center p-0"
            style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', color: '#fff', fontSize: '10px', fontWeight: 'bold', outline: 'none' }}
          />
        ) : (
          seat.label
        )}
      </div>
    );
  };
  
  const renderSeatPopup = () => {
    if (!selectedSeat) return null;
    const [rowId, seatIndexStr] = selectedSeat.split('-');
    const seatIndex = parseInt(seatIndexStr);
    const seat = seatMap[rowId]?.[seatIndex];
    if (!seat) return null;

    // Handle space items differently
    if (seat.type === 'space') {
      return (
        <div className="position-absolute bg-white border rounded shadow p-4" style={{ left: selectedSeatPosition.x, top: selectedSeatPosition.y, zIndex: 50, width: '300px' }} onClick={e => e.stopPropagation()}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="font-weight-bold mb-0">Edit Space</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedSeat(null)}></button>
          </div>
          
          <div className="mb-3">
            <p className="text-muted mb-2">This is an aisle space or gap in the seating arrangement.</p>
          </div>
          
          <div className="d-flex gap-2">
            <button onClick={() => deleteSeat(rowId, seatIndex)} className="btn btn-danger btn-sm flex-fill">
              <Trash2 size={14} className="me-1" /> Delete Space
            </button>
          </div>
        </div>
      );
    }

    const handleReservedChange = (e) => {
      setSeatMap(prev => ({
        ...prev,
        [rowId]: prev[rowId].map((s, idx) => 
          idx === seatIndex ? { ...s, reserved: e.target.checked } : s
        )
      }));
      showToast(`Seat ${seat.label} ${e.target.checked ? 'reserved' : 'unreserved'}`);
    };

    return (
      <div className="position-absolute bg-white border rounded shadow p-4" style={{ left: selectedSeatPosition.x, top: selectedSeatPosition.y, zIndex: 50, width: '250px' }} onClick={e => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="font-weight-bold mb-0">Edit Seat {seat.label}</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedSeat(null)}></button>
        </div>
        
        <div className="mb-2">
          <label className="form-label mb-1">Category:</label>
          <div className="d-flex align-items-center">
            <span className="form-control bg-light me-2">{categories[seat.category]?.name || seat.category}</span>
            <button 
              onClick={() => startFieldEdit('category', rowId, seatIndex, seat.category)} 
              className="btn btn-outline-primary btn-sm" 
              title="Edit Category"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
        <div className="mb-2">
          <label className="form-label mb-1">Price:</label>
          <div className="d-flex align-items-center">
            <span className="form-control bg-light me-2">£{seat.price || 0}</span>
            <button 
              onClick={() => startFieldEdit('price', rowId, seatIndex, seat.price || 0)} 
              className="btn btn-outline-primary btn-sm" 
              title="Edit Price"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
        <div className="mb-2">
          <label className="form-label mb-1">Color:</label>
          <div className="d-flex align-items-center">
            <div 
              className="form-control me-2 d-flex align-items-center" 
              style={{ 
                backgroundColor: seat.color || categories[seat.category]?.color || '#CCCCCC',
                minHeight: '38px',
                border: '1px solid #ced4da'
              }}
            >
              <span className="text-white font-weight-bold">
                {seat.color || categories[seat.category]?.color || '#CCCCCC'}
              </span>
            </div>
            <button 
              onClick={() => startFieldEdit('color', rowId, seatIndex, seat.color || categories[seat.category]?.color || '#CCCCCC')} 
              className="btn btn-outline-primary btn-sm" 
              title="Edit Color"
            >
              <Edit2 size={14} />
            </button>
            {seat.color && (
              <button 
                onClick={() => resetSeatColor(rowId, seatIndex)} 
                className="btn btn-outline-secondary btn-sm ms-1" 
                title="Reset to Category Color"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="reservedCheckbox"
              checked={seat.reserved || false}
              onChange={handleReservedChange}
            />
            <label className="form-check-label" htmlFor="reservedCheckbox">
              Reserved Seat
            </label>
          </div>
        </div>
        <div className="d-flex gap-2 mt-4">
          <button onClick={() => addSpaceToRow(rowId, seatIndex)} className="btn btn-info btn-sm flex-fill">Add Space Left</button>
          <button onClick={() => deleteSeat(rowId, seatIndex)} className="btn btn-danger btn-sm">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  const renderFieldEditModal = () => {
    if (!editingField) return null;
    const { type } = editingField;

    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit {type}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setEditingField(null)}></button>
            </div>
            <div className="modal-body">
              {type === 'category' ? (
                <select 
                  ref={editInputRef} 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)} 
                  onKeyDown={handleFieldKeyDown} 
                  className="form-select"
                >
                  {Object.entries(categories).map(([id, cat]) => (
                    <option key={id} value={id}>{cat.name}</option>
                  ))}
                </select>
              ) : type === 'color' ? (
                <div className="d-flex align-items-center gap-3">
                  <input 
                    ref={editInputRef} 
                    type="color" 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)} 
                    className="form-control form-control-color" 
                    style={{ width: '60px', height: '60px' }}
                  />
                  <input 
                    type="text" 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)} 
                    onKeyDown={handleFieldKeyDown} 
                    className="form-control" 
                    placeholder="#000000"
                  />
                </div>
              ) : (
                <input 
                  ref={editInputRef} 
                  type="number" 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)} 
                  onKeyDown={handleFieldKeyDown} 
                  className="form-control" 
                />
              )}
            </div>
            <div className="modal-footer">
              <button onClick={handleFieldEdit} className="btn btn-primary d-flex align-items-center">
                <Check size={16} className="me-2" /> Save
              </button>
              <button onClick={() => setEditingField(null)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryManager = () => {
    if (!showCategoryManager) return null;

    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }} onClick={() => setShowCategoryManager(false)}>
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title">Manage Categories</h5>
              <div className="d-flex gap-2 align-items-center">
                <button 
                  onClick={refreshCategoriesFromSeatMap} 
                  className="btn btn-outline-secondary btn-sm" 
                  title="Reset Categories from Default Values"
                >
                  <RotateCcw size={16} />
                </button>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowCategoryManager(false)}></button>
              </div>
            </div>
            <div className="modal-body">
              <div className="mb-4" style={{ maxHeight: 'calc(90vh - 250px)', overflowY: 'auto' }}>
                {Object.entries(categories).map(([id, category]) => (
                  <div key={id} className="d-flex align-items-center p-3 border rounded mb-2">
                    <div className="me-3" style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: category.color }}></div>
                    <div className="flex-grow-1 row">
                      <span className="col-6 font-weight-bold">{category.name}</span>
                      <span className="col-6 text-muted">£{category.price}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddRowForCategory(id); }} 
                      className="btn btn-outline-success btn-sm me-2" 
                      title="Add Row for this Category"
                    >
                      <Plus size={16} />
                    </button>
                    <button 
                      onClick={() => startEditCategory(id, category)} 
                      className="btn btn-outline-primary btn-sm me-2" 
                      title="Edit Category"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteCategory(id)} 
                      className="btn btn-outline-danger btn-sm" 
                      disabled={Object.keys(categories).length <= 1} 
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-top pt-4 mt-4">
                <h5 className="font-weight-bold mb-3">{categoryForm.id ? 'Edit Category' : 'Add New Category'}</h5>
                <div className="row g-3 align-items-center">
                  <div className="col-md-6">
                    <input 
                      name="name" 
                      type="text" 
                      placeholder="Category name" 
                      value={categoryForm.name} 
                      onChange={handleCategoryFormChange} 
                      className="form-control" 
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      name="price" 
                      type="number" 
                      placeholder="Price" 
                      value={categoryForm.price} 
                      onChange={handleCategoryFormChange} 
                      className="form-control" 
                    />
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <input 
                      name="color" 
                      type="color" 
                      value={categoryForm.color} 
                      onChange={handleCategoryFormChange} 
                      className="form-control form-control-color me-2" 
                      title="Choose your color" 
                      style={{ width: '40px', height: '40px', padding: 0 }}
                    />
                    <span className="text-muted">Color</span>
                  </div>
                  <div className="col-md-6 d-flex gap-2">
                    <button onClick={handleCategorySubmit} className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center">
                      {categoryForm.id ? (<><Save size={16} className="me-2"/>Update</>) : (<><Plus size={16} className="me-2"/>Add</>)}
                    </button>
                    {categoryForm.id && (
                      <button onClick={() => setCategoryForm({ id: null, name: '', price: '', color: '#96CEB4' })} className="btn btn-secondary">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Debug information */}
              <div className="modal-footer">
                <small className="text-muted">
                  Found {Object.keys(categories).length} categories | 
                  Total seats: {getTotalSeats()} | 
                  Categories: {Object.keys(categories).join(', ')}
                </small>
              </div>
            </div>
            
            {/* Add SeatMap Name field */}
            <div className="d-flex align-items-center mb-3">
              <div className="position-relative d-inline-block" onClick={e => e.stopPropagation()}>
                {editingSeatMapName ? (
                  <div className="d-flex align-items-center">
                    <input 
                      ref={seatMapNameInputRef}
                      type="text" 
                      value={seatMapNameEditValue} 
                      onChange={(e) => setSeatMapNameEditValue(e.target.value)} 
                      onKeyDown={handleSeatMapNameKeyDown} 
                      className="form-control text-center me-2" 
                      style={{ width: '300px' }}
                      placeholder="Enter seat map name"
                    />
                    <button onClick={handleSeatMapNameUpdate} className="btn btn-success btn-sm me-2 rounded-circle">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingSeatMapName(false)} className="btn btn-danger btn-sm rounded-circle">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="bg-light text-dark d-flex align-items-center justify-content-center font-weight-bold rounded shadow-sm p-2" 
                    style={{ minWidth: '300px' }} 
                    onDoubleClick={() => { setEditingSeatMapName(true); setSeatMapNameEditValue(seatMapName); }}
                  >
                    {seatMapName}
                  </div>
                )}
                {!editingSeatMapName && (
                  <button 
                    onClick={() => { setEditingSeatMapName(true); setSeatMapNameEditValue(seatMapName); }} 
                    title="Edit Seat Map Name" 
                    className="btn btn-outline-secondary btn-sm position-absolute rounded-circle" 
                    style={{ top: '-10px', right: '-10px', opacity: 0, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <Edit2 size={12}/>
                  </button>
                )}
              </div>
            </div>

            <div className="text-muted mt-2">Total Seats: <span className="font-weight-bold">{getTotalSeats()}</span></div>
          </div>
        </div>
      </div>
    );
  };

  const refreshCategoriesFromSeatMap = () => {
    const extractedCategories = { ...initialCategories };
    const categoryColors = {
      sponsors: '#FFD700',
      vvip: '#FF6B6B', 
      vip: '#4ECDC4',
      reserved: '#45B7D1',
      standard: '#96CEB4',
      economy: '#FFA500'
    };

    // Extract categories from current seat map
    Object.values(seatMap).forEach(seats => {
      seats.forEach(seat => {
        if (seat.type === 'seat' && seat.category) {
          const categoryId = seat.category.toLowerCase();
          if (!extractedCategories[categoryId]) {
            const categoryName = seat.category.charAt(0).toUpperCase() + seat.category.slice(1);
            const defaultPrice = categoryId === 'economy' ? 500 : 1000;
            extractedCategories[categoryId] = {
              name: categoryName,
              price: defaultPrice,
              color: categoryColors[categoryId] || '#CCCCCC'
            };
          }
        }
      });
    });

    setCategories(extractedCategories);
    showToast('Categories refreshed from seat map data');
  };

  const renderRowColorModal = () => {
    if (!showRowColorModal) return null;

    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Change Row Color - {selectedRowForColor}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowRowColorModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Select Color:</label>
                <div className="d-flex align-items-center gap-3">
                  <input 
                    type="color" 
                    value={rowColorValue} 
                    onChange={(e) => setRowColorValue(e.target.value)} 
                    className="form-control form-control-color" 
                    style={{ width: '60px', height: '60px' }}
                  />
                  <input 
                    type="text" 
                    value={rowColorValue} 
                    onChange={(e) => setRowColorValue(e.target.value)} 
                    className="form-control" 
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Preview:</label>
                <div 
                  className="p-3 rounded" 
                  style={{ 
                    backgroundColor: rowColorValue, 
                    minHeight: '40px',
                    border: '1px solid #ced4da'
                  }}
                >
                  <span className="text-white font-weight-bold">
                    Sample text on {rowColorValue}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleRowColorSubmit} className="btn btn-primary d-flex align-items-center">
                <Check size={16} className="me-2" /> Apply Color
              </button>
              <button onClick={() => setShowRowColorModal(false)} className="btn btn-secondary">Cancel</button>
            </div>
            {renderSeatPopup()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className='seatmap-container'>
    <div className="container-fluid p-4 bg-light min-vh-100 font-sans" onClick={() => setSelectedSeat(null)}>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded shadow p-4 mb-4" style={{ top: '1rem', zIndex: 40 }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
              <h1 className="h4 font-weight-bold text-dark mb-3 mb-md-0">
                {id ? 'Edit Seat Map' : 'Create New Seat Map'}
              </h1>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <button 
                  onClick={() => navigate('/seatmaps')}
                  className="btn btn-secondary btn-sm d-flex align-items-center"
                >
                  Back to List
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowCategoryManager(true);}} 
                  className="btn btn-primary btn-sm d-flex align-items-center"
                >
                  <Edit2 size={14} className="me-2"/> Categories
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); addNewRow(); }} 
                  className="btn btn-info btn-sm d-flex align-items-center"
                >
                  <Plus size={14} className="me-2"/> Add Row
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); regenerateSeatMap(); }} 
                  className="btn btn-warning btn-sm d-flex align-items-center"
                >
                  <RotateCcw size={14} className="me-2"/> Reset
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); saveSeatMapToApi(); }} 
                  className="btn btn-success btn-sm d-flex align-items-center"
                >
                  <Save size={14} className="me-2"/> Save
                </button>
              </div>
            </div>
            
            {/* Add SeatMap Name field */}
            <div className="d-flex align-items-center mb-3">
              <div className="position-relative d-inline-block" onClick={e => e.stopPropagation()}>
                {editingSeatMapName ? (
                  <div className="d-flex align-items-center">
                    <input 
                      ref={seatMapNameInputRef}
                      type="text" 
                      value={seatMapNameEditValue} 
                      onChange={(e) => setSeatMapNameEditValue(e.target.value)} 
                      onKeyDown={handleSeatMapNameKeyDown} 
                      className="form-control text-center me-2" 
                      style={{ width: '300px' }}
                      placeholder="Enter seat map name"
                    />
                    <button onClick={handleSeatMapNameUpdate} className="btn btn-success btn-sm me-2 rounded-circle">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingSeatMapName(false)} className="btn btn-danger btn-sm rounded-circle">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="bg-light text-dark d-flex align-items-center justify-content-center font-weight-bold rounded shadow-sm p-2" 
                    style={{ minWidth: '300px' }} 
                    onDoubleClick={() => { setEditingSeatMapName(true); setSeatMapNameEditValue(seatMapName); }}
                    title={`Double-click to edit`}
                  >
                    {seatMapName} <Info size={16} className="text-muted ms-2" />
                  </div>
                )}
                {!editingSeatMapName && (
                  <button 
                    onClick={() => { setEditingSeatMapName(true); setSeatMapNameEditValue(seatMapName); }} 
                    title="Edit Seat Map Name" 
                    className="btn btn-outline-secondary btn-sm position-absolute rounded-circle" 
                    style={{ top: '-10px', right: '-10px', opacity: 0, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <Edit2 size={12}/>
                  </button>
                )}
              </div>
            </div>

            <div className="text-muted mt-2">Total Seats: <span className="font-weight-bold">{getTotalSeats()}</span></div>
          </div>

          <div className="seat-map-container overflow-auto pb-5 position-relative">
            <div className="d-flex justify-content-center align-items-center my-4">
              <div className="position-relative d-inline-block" onClick={e => e.stopPropagation()}>
                {editingStage ? (
                  <div className="d-flex align-items-center">
                    <input 
                      ref={stageInputRef} 
                      type="text" 
                      value={stageEditValue} 
                      onChange={(e) => setStageEditValue(e.target.value)} 
                      onKeyDown={handleStageKeyDown} 
                      className="form-control text-center me-2" 
                      style={{ width: '200px' }}
                    />
                    <button onClick={handleStageUpdate} className="btn btn-success btn-sm me-2 rounded-circle">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingStage(false)} className="btn btn-danger btn-sm rounded-circle">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="bg-dark text-white d-flex align-items-center justify-content-center font-weight-bold rounded-top shadow" 
                    style={{ width: '320px', height: '60px', fontSize: '1.25rem' }} 
                    onDoubleClick={() => { setEditingStage(true); setStageEditValue(stageName); }}
                  >
                    {stageName}
                  </div>
                )}
                {!editingStage && (
                  <button 
                    onClick={() => { setEditingStage(true); setStageEditValue(stageName); }} 
                    title="Edit Stage Name" 
                    className="btn btn-outline-secondary btn-sm position-absolute rounded-circle" 
                    style={{ top: '-10px', right: '-10px', opacity: 0, transition: 'opacity 0.2s', '--bs-btn-padding-x': '.5rem', '--bs-btn-padding-y': '.5rem' }} // Custom Bootstrap variables for padding
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <Edit2 size={12}/>
                  </button>
                )}
              </div>
            </div>

            <div className="d-flex flex-column align-items-center space-y-2">
              {Object.entries(seatMap).map(([rowId, seats]) => (
                <div 
                  key={rowId} 
                  className={`d-flex align-items-center gap-4 p-2 rounded ${draggedRow === rowId ? 'opacity-50' : ''} ${dragOverRow === rowId ? 'border border-primary bg-light' : ''}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, rowId)}
                  onDragOver={(e) => handleDragOver(e, rowId)}
                  onDragLeave={(e) => handleDragLeave(e, rowId)}
                  onDrop={(e) => handleDrop(e, rowId)}
                  onDragEnd={handleDragEnd}
                  onClick={e => e.stopPropagation()}
                  style={{ 
                    cursor: isDragging ? 'grabbing' : 'default',
                    transition: 'all 0.2s ease',
                    transform: draggedRow === rowId ? 'rotate(2deg)' : 'none'
                  }}
                >
                                    <div className="position-relative d-inline-flex align-items-center" style={{ width: '110px' }} onClick={e => e.stopPropagation()}>
                
                    {editingRowName === rowId ? (
                      <div className="d-flex flex-column align-items-end gap-1">
                        <input 
                          ref={rowNameInputRef}
                          type="text" 
                          value={rowNameEditValue} 
                          onChange={(e) => setRowNameEditValue(e.target.value)} 
                          onKeyDown={(e) => handleRowNameKeyDown(e, rowId)} 
                          onBlur={() => handleRowNameUpdate(rowId)}
                          className="form-control form-control-sm text-end" 
                          style={{ width: '100px' }}
                          placeholder="Row name"
                        />
                        <div className="d-flex gap-1">
                          <button onClick={() => handleRowNameUpdate(rowId)} className="btn btn-success btn-sm rounded-circle p-1">
                            <Check size={15} />
                          </button>
                          <button onClick={() => { setEditingRowName(null); setRowNameEditValue(''); }} className="btn btn-danger btn-sm rounded-circle p-1">
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="d-flex align-items-center justify-content-end p-1 rounded" 
                        style={{ 
                          minHeight: '32px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: '1px solid transparent'
                        }}
                        onClick={() => { setEditingRowName(rowId); setRowNameEditValue(rowId); }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.borderColor = '#dee2e6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                        title={`Click to edit row name: ${rowId}`}
                      >
                        <span className="text-muted text-truncate font-weight-bold me-2" style={{ maxWidth: '80px' }}>
                          {rowId}
                        </span>
                        <Info size={16} className="text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-nowrap">{seats.map((seat, seatIndex) => renderSeat(seat, rowId, seatIndex))}</div>
                  <div className="position-relative d-flex align-items-center gap-1" style={{ width: '80px' }}>
                    <button 
                      className="btn btn-outline-secondary btn-sm rounded-circle"
                      style={{ cursor: 'grab' }}
                      title="Drag to reorder row"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <GripVertical size={14} />
                    </button>
                    <button 
                      onClick={() => setShowRowMenu(showRowMenu === rowId ? null : rowId)} 
                      className="btn btn-light rounded-circle row-menu-button"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Menu size={18} />
                    </button>
                    {showRowMenu === rowId && (
                      <div className="dropdown-menu d-block position-absolute shadow p-2 row-menu-dropdown" style={{ right: '3rem', zIndex: 20, width: 'max-content' }}>
                        <div className="d-flex align-items-center mb-2">
                          <input 
                            type="number" 
                            value={bulkAddCount} 
                            onChange={e => setBulkAddCount(parseInt(e.target.value) || 1)} 
                            className="form-control form-control-sm me-2" 
                            style={{ width: '60px' }}
                          />
                          <button onClick={() => addSeatsToRow(rowId, bulkAddCount)} className="btn btn-outline-info btn-sm flex-grow-1">Add Seats</button>
                        </div>
                        <button onClick={() => addSpaceToRow(rowId)} className="dropdown-item">Add Space</button>
                        <button onClick={() => duplicateRow(rowId)} className="dropdown-item">Duplicate Row</button>
                        <div className="dropdown-divider"></div>
                        <button onClick={() => changeRowColor(rowId)} className="dropdown-item">Change Row Color</button>
                        <button onClick={() => resetRowColor(rowId)} className="dropdown-item">Reset Row Color</button>
                        <div className="dropdown-divider"></div>
                        <button onClick={() => deleteRow(rowId)} className="dropdown-item text-danger">Delete Row</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {renderSeatPopup()}
          </div>

          {renderFieldEditModal()}
          {renderCategoryManager()}
          {renderRowColorModal()}

          {toasts.visible && (
            <div className={`toast align-items-center text-white bg-${toasts.type === 'success' ? 'dark' : 'danger'} border-0 show`} role="alert" aria-live="assertive" aria-atomic="true" style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100 }}>
              <div className="d-flex">
                <div className="toast-body">
                  {toasts.message}
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={() => setToast(prev => ({ ...prev, visible: false }))}></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    </section>
  );
};

export default SeatMapEditor;