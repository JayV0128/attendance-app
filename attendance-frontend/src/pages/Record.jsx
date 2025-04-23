import React from 'react'
import { useEffect, useState } from 'react';

const Record = () => {
  const [records, setRecords] = useState([]);
  const backend_API_URL = import.meta.env.VITE_API_URL + '/attendance/logs';

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(backend_API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('Response:', data);

        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, [backend_API_URL]);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>All Records</h1>
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            <th style={headerCellStyle}>#</th>
            <th style={headerCellStyle}>Name</th>
            <th style={headerCellStyle}>Method</th>
            <th style={headerCellStyle}>Device Type</th>
            <th style={headerCellStyle}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.token} style={rowStyle}>
              <td style={cellStyle}>{record.id}</td>
              <td style={cellStyle}>{record.name}</td>
              <td style={cellStyle}>{record.method}</td>
              <td style={cellStyle}>{record.device_info}</td>
              <td style={cellStyle}>{new Date(record.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: "'Segoe UI', Roboto, sans-serif",
  color: '#333',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const headerRowStyle = {
  backgroundColor: '#3498db',
  color: '#fff',
};

const headerCellStyle = {
  padding: '10px',
  textAlign: 'left',
  fontSize: '16px',
  fontWeight: '600',
};

const rowStyle = {
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
};

const cellStyle = {
  padding: '10px',
  textAlign: 'left',
  fontSize: '14px',
};


export default Record
