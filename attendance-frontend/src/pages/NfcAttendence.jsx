import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Spin } from 'antd';

const NfcAttendence = () => {
  const [nfcStatus, setNfcStatus] = useState('waiting');
  const [extractedData, setExtractedData] = useState(null);
  const [currentInput, setCurrentInput] = useState(''); // Store the accumulated input

  useEffect(() => {
    const handleNfcDetection = (event) => {
      // Accumulate characters until the input reaches exactly 10 characters
      if (currentInput.length < 10 && event.key !== 'Enter') {
        setCurrentInput((prevInput) => prevInput + event.key);  // Add key to the current input
      }

      // Process the input when the length is 10
      if (currentInput.length === 9 && event.key !== 'Enter') {
        const mockData = {
          token: currentInput + event.key,  // Append the last key press to complete the token
          timestamp: new Date().toISOString(),
        };

        setExtractedData(mockData);  // Store the data after exactly 10 characters
        setNfcStatus('success');
        console.log("NFC tag detected:", mockData); // Log the full token
        setCurrentInput('');  // Reset the input after capturing
      }
    };

    // Simulate NFC event listening (replace with real NFC listener)
    window.addEventListener('keypress', handleNfcDetection);
    return () => window.removeEventListener('keypress', handleNfcDetection);
  }, [currentInput]);

  const resetScanner = () => {
    setExtractedData(null);
    setNfcStatus('waiting');
    setCurrentInput(''); // Reset input on scanner reset
  };

  const takeAttendanceUsingNFC = async () => {
    if (!extractedData) return;

    console.log("Submitting NFC data:", extractedData);
    const url = import.meta.env.VITE_API_URL + "/attendance/log";
    const response = await fetch(
      url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: extractedData.token,
        method: "NFC",
        deviceInfo: "Web",
      })
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("Attendance submitted successfully:", data);
      alert("Attendance submitted successfully!");
    } else {
      // console.error("Error submitting attendance:", response.statusText);
      alert("Error submitting attendance. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>NFC Attendance</h1>
      
      <Card style={{ marginBottom: '24px', backgroundColor: '#f8f9fa' }}>
        <Alert
          message="NFC Usage Instructions"
          description={
            <div>
              <p style={{ marginBottom: '8px' }}>For testing without physical NFC tags:</p>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Press any keyboard key to simulate tag detection. After exactly 10 characters, it will process the input.</li>
              </ol>
            </div>
          }
          type="info"
          showIcon
        />
      </Card>

      <div style={statusContainerStyle}>
        {nfcStatus === 'waiting' && (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <p style={statusTextStyle}>Waiting for NFC tag...</p>
          </div>
        )}

        {nfcStatus === 'success' && (
          <div style={successIndicatorStyle}>
            <svg style={successIconStyle} viewBox="0 0 24 24">
              <path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
            </svg>
            <p style={statusTextStyle}>Detection successful</p>
          </div>
        )}

        {nfcStatus === 'error' && (
          <div style={errorIndicatorStyle}>
            <div style={errorIconStyle}>!</div>
            <p style={statusTextStyle}>Read error</p>
            <Button type="primary" onClick={resetScanner}>
              Retry
            </Button>
          </div>
        )}
      </div>

      {extractedData && (
        <div style={resultContainerStyle}>
          <Card title="Scanned NFC Data">
            <pre style={textStyle}>
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </Card>
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button 
              type="primary" 
              size="large"
              onClick={takeAttendanceUsingNFC}
              style={{ width: '100%', maxWidth: '300px' }}
            >
              Confirm Attendance
            </Button>
            <Button 
              style={{ marginTop: '12px', width: '100%', maxWidth: '300px' }}
              onClick={resetScanner}
            >
              Rescan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Common styles (consistent with QRCode component)
const containerStyle = {
  maxWidth: '500px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: "'Segoe UI', Roboto, sans-serif",
  color: '#333'
};

const headerStyle = {
  textAlign: 'center',
  color: '#2c3e50',
  marginBottom: '20px'
};

const statusContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '200px',
  backgroundColor: '#f0f0f0',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px'
};

const statusIndicatorStyle = {
  textAlign: 'center',
  color: '#3498db'
};

const successIndicatorStyle = {
  ...statusIndicatorStyle,
  color: '#2ecc71'
};

const errorIndicatorStyle = {
  ...statusIndicatorStyle,
  color: '#e74c3c',
  textAlign: 'center'
};

const successIconStyle = {
  width: '60px',
  height: '60px',
  color: 'inherit',
  margin: '0 auto 16px'
};

const errorIconStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#e74c3c',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '30px',
  fontWeight: 'bold',
  margin: '0 auto 16px'
};

const statusTextStyle = {
  margin: 0,
  fontSize: '18px',
  fontWeight: '500',
  color: 'inherit'
};

const resultContainerStyle = {
  marginTop: '25px'
};

const textStyle = {
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: '14px',
  lineHeight: '1.5'
};

export default NfcAttendence;