import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import '../../assets/seatConfig.css';

const RowConfigEditor = ({ rowIndex, rowConfig, updateRowConfig, style }) => (
  <div className="row-config-editor" style={style}>
    <div className="row-header">Row {rowIndex + 1}</div>
    <div className="row-inputs">
      <div className="input-group11">
        <label>Left Seats:</label>
        <input 
          type="number" 
          value={rowConfig.left} 
          onChange={(e) => updateRowConfig(rowIndex, 'left', e.target.value)} 
          className="input-field" 
        />
      </div>
      <div className="input-group1">
        <label>Center Seats:</label>
        <input 
          type="number" 
          value={rowConfig.center} 
          onChange={(e) => updateRowConfig(rowIndex, 'center', e.target.value)}
          className="input-field"
        />
      </div>
      <div className="input-group1">
        <label>Right Seats:</label>
        <input 
          type="number" 
          value={rowConfig.right} 
          onChange={(e) => updateRowConfig(rowIndex, 'right', e.target.value)}
          className="input-field"
        />
      </div>
    {/* </div>
    <div className="row-inputs"> */}
      <div className="input-group1">
        <label>Left Category:</label>
        <select 
          value={rowConfig.leftCategory}
          onChange={(e) => updateRowConfig(rowIndex, 'leftCategory', e.target.value)}
          className="input-field"
        >
          <option value="DEFAULT">Default</option>
          <option value="STANDARD">STANDARD</option>
          <option value="VIP">VIP</option>
          <option value="PREMIUM">PREMIUM</option>
        </select>
      </div>
      <div className="input-group1">
        <label>Center Category:</label>
        <select 
          value={rowConfig.centerCategory}
          onChange={(e) => updateRowConfig(rowIndex, 'centerCategory', e.target.value)}
          className="input-field"
        >
          <option value="DEFAULT">Default</option>
          <option value="STANDARD">STANDARD</option>
          <option value="VIP">VIP</option>
          <option value="PREMIUM">PREMIUM</option>
        </select>
      </div>
      <div className="input-group1">
        <label>Right Category:</label>
        <select 
          value={rowConfig.rightCategory}
          onChange={(e) => updateRowConfig(rowIndex, 'rightCategory', e.target.value)}
          className="input-field"
        >
          <option value="DEFAULT">Default</option>
          <option value="STANDARD">STANDARD</option>
          <option value="VIP">VIP</option>
          <option value="PREMIUM">PREMIUM</option>
        </select>
      </div>
    </div>
  </div>
);

const BulkRowConfig = ({ rows, updateRowConfig }) => {
  return (
    <List
      height={400}
      itemCount={rows.length}
      itemSize={120} // Increased height for additional controls
      width={'100%'}
    >
      {({ index, style }) => (
        <RowConfigEditor 
          rowIndex={index} 
          rowConfig={rows[index]} 
          updateRowConfig={updateRowConfig}
          style={style}
        />
      )}
    </List>
  );
};

const SeatConfig = ({ onConfigUpdate }) => {
  // Total rows and default row configuration (including category overrides)
  const [totalRows, setTotalRows] = useState(100);
  const defaultRowConfig = { 
    left: 3, 
    center: 5, 
    right: 3, 
    leftCategory: 'DEFAULT', 
    centerCategory: 'DEFAULT', 
    rightCategory: 'DEFAULT' 
  };
  const [defaultConfig, setDefaultConfig] = useState(defaultRowConfig);
  const [rowsConfig, setRowsConfig] = useState(
    Array.from({ length: totalRows }, () => ({ ...defaultRowConfig }))
  );
  
  // Global section details (global default category and pricing)
  const [sectionDetails, setSectionDetails] = useState({
    left: { category: 'STANDARD', price: 50 },
    center: { category: 'VIP', price: 100 },
    right: { category: 'STANDARD', price: 50 }
  });
  
  const updateRowConfig = (rowIndex, key, value) => {
    const newRows = [...rowsConfig];
    newRows[rowIndex] = { 
      ...newRows[rowIndex], 
      [key]: key.includes('Category') ? value : Number(value) 
    };
    setRowsConfig(newRows);
  };

  // Apply the default configuration to all rows.
  const handleApplyDefaults = () => {
    const updatedRows = Array.from({ length: totalRows }, () => ({ ...defaultConfig }));
    setRowsConfig(updatedRows);
  };

  // Handle total rows change.
  const handleTotalRowsChange = (e) => {
    const newTotal = Number(e.target.value);
    setTotalRows(newTotal);
    setRowsConfig(Array.from({ length: newTotal }, () => ({ ...defaultConfig })));
  };

  // Update default config changes.
  const handleDefaultConfigChange = (section, value) => {
    setDefaultConfig({ ...defaultConfig, [section]: Number(value) });
  };

  const handleSubmit = () => {
    // Pass the complete configuration (row overrides and global defaults)
    onConfigUpdate({ rowsConfig, categories: sectionDetails });
  };

  return (
    <div className="seat-config-container">
      <h3 className="seat-config-header">Layout Configuration</h3>
      
      <div className="input-group1">
        <label>Total Rows:</label>
        <input 
          type="number" 
          value={totalRows} 
          onChange={handleTotalRowsChange} 
          min="1"
          className="input-field"
        />
      </div>
      
      <div className="default-config">
        <h4>Default Row Configuration</h4>
        <div className="default-inputs">
          <div className="input-group1">
            <label>Left Seats:</label>
            <input 
              type="number" 
              value={defaultConfig.left} 
              onChange={(e) => handleDefaultConfigChange('left', e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group1">
            <label>Center Seats:</label>
            <input 
              type="number" 
              value={defaultConfig.center} 
              onChange={(e) => handleDefaultConfigChange('center', e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group1">
            <label>Right Seats:</label>
            <input 
              type="number" 
              value={defaultConfig.right} 
              onChange={(e) => handleDefaultConfigChange('right', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <button onClick={handleApplyDefaults} className="apply-defaults-btn">
          Apply Defaults to All Rows
        </button>
      </div>
      
      <div className="override-config">
        <h4>Override Individual Row Configurations</h4>
        <BulkRowConfig rows={rowsConfig} updateRowConfig={updateRowConfig} />
      </div>
      
      <div className="global-section-config">
        <h4>Global Section Categories & Pricing</h4>
        {['left', 'center', 'right'].map((section) => (
          <div key={section} className="section-config">
            <strong>{section.charAt(0).toUpperCase() + section.slice(1)} Section:</strong>
            <div className="input-group1">
              <label>Category:</label>
              <select 
                value={sectionDetails[section].category}
                onChange={(e) => setSectionDetails({
                  ...sectionDetails,
                  [section]: { ...sectionDetails[section], category: e.target.value }
                })}
                className="input-field"
              >
                <option value="STANDARD">STANDARD</option>
                <option value="VIP">VIP</option>
                <option value="PREMIUM">PREMIUM</option>
              </select>
            </div>
            <div className="input-group1">
              <label>Price:</label>
              <input 
                type="number"
                value={sectionDetails[section].price}
                onChange={(e) => setSectionDetails({
                  ...sectionDetails,
                  [section]: { ...sectionDetails[section], price: Number(e.target.value) }
                })}
                min="0"
                className="input-field"
              />
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={handleSubmit} className="submit-btn">
        Generate Layout
      </button>
    </div>
  );
};

export default SeatConfig;
