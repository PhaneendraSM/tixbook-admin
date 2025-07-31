import React from 'react';
import { Table } from 'react-bootstrap';

const DataTable = ({
  columns,
  data,
  renderRow,         
  noDataMessage = "No data available",
  striped = true,
  bordered = true,
  hover = true,
  responsive = true,
  className = ""
}) => {
  return (
    <Table striped={striped} bordered={bordered} hover={hover} responsive={responsive} className={className}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} style={col.width ? { width: col.width } : {}}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((row, idx) => renderRow(row, idx))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center">
              {noDataMessage}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default DataTable;
