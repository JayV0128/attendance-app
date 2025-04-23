import React, { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from 'antd';


const QRCodeAttendenceScanner = () => {
  const [extractedText, setExtractedText] = useState('');
  const [cameraStatus, setCameraStatus] = useState('loading');
  const [scanActive, setScanActive] = useState(true);
  const videoRef = useRef(null);


  const takeAttendanceUsingQRCode = async (qrCode) => {
    // console.log("function: takeAttendanceUsingQRCode: ", qrCode);
    if (!qrCode) return;

    const url = import.meta.env.VITE_API_URL + "/attendance/log";
    const response = await fetch(
      url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: qrCode,
        method: "QRcode",
        deviceInfo: "Web",
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Attendance submitted successfully:", data);
      alert("Attendance submitted successfully!");
    } else {
      console.error("Error submitting attendance:", response.statusText);
      alert("Error submitting attendance. Please try again.");
    }
  };

  useEffect(() => {
    let stream;
    
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraStatus('active');
        }
      } catch (err) {
        console.error('Camera init error:', err);
        setCameraStatus('error');
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = (result) => {
    if (result && scanActive) {
      const text = result.text || result;
      console.log('Decoded text:', text);
      setExtractedText(text);
      setScanActive(false); // Pause scanning after success
    }
  };

  const handleError = (err) => {
    console.error('Scanner error:', err);
  };

  const resetScanner = () => {
    setExtractedText('');
    setScanActive(true);
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>QR Code Scanner</h1>
      
      {/* Camera View */}
      <div style={videoContainerStyle}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={videoStyle}
        />
        
        {/* Scanner Frame Overlay */}
        <div style={frameOverlayStyle}>
          <div style={frameStyle}></div>
          <div style={scanLineStyle} className={scanActive ? 'scan-active' : ''}></div>
        </div>
        
        {/* Status Overlays */}
        {cameraStatus === 'loading' && (
          <div style={statusOverlayStyle}>
            <div style={spinnerStyle}></div>
            <p>Initializing camera...</p>
          </div>
        )}
        
        {cameraStatus === 'error' && (
          <div style={statusOverlayStyle}>
            <div style={errorIconStyle}>!</div>
            <p>Camera unavailable</p>
            <button style={retryButtonStyle} onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}
        
        {!scanActive && (
          <div style={successOverlayStyle}>
            <svg style={successIconStyle} viewBox="0 0 24 24">
              <path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Hidden QR Reader */}
      <div style={{ display: 'none' }}>
        <QrReader
          scanDelay={300}
          onResult={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
        />
      </div>

      {/* Scan Controls */}
      <div style={controlsStyle}>
        {!scanActive && (
          <button style={actionButtonStyle} onClick={resetScanner}>
            Scan Another Code
          </button>
        )}
      </div>

      {/* Results Panel */}
      {extractedText && (
        <div style={resultContainerStyle}>
          <h3 style={resultHeaderStyle}>Scanned Content</h3>
          <div style={resultContentStyle}>
            <pre style={textStyle}>{extractedText}</pre>
          </div>
          <button 
            style={copyButtonStyle}
            onClick={() => {
              navigator.clipboard.writeText(extractedText);
            }}
          >
            Copy to Clipboard
          </button>


          <Button type="primary" 
          style={{ marginTop: '20px',}}
          onClick={() => {
            takeAttendanceUsingQRCode(extractedText);
          }}>
            Submit
          </Button>
          
        </div>
      )}
    </div>
  );
};

// Styles
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

const videoContainerStyle = {
  position: 'relative',
  width: '100%',
  aspectRatio: '1/1',
  backgroundColor: '#000',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

const videoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const frameOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none'
};

const frameStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '70%',
  border: '4px solid rgba(255, 255, 255, 0.5)',
  borderRadius: '8px',
  boxShadow: '0 0 0 100vmax rgba(0, 0, 0, 0.5)'
};

const scanLineStyle = {
  position: 'absolute',
  top: '15%',
  left: '15%',
  width: '70%',
  height: '4px',
  background: 'linear-gradient(to right, transparent, #00ff00, transparent)',
  animation: 'scan 2s linear infinite',
  opacity: 0,
  borderRadius: '4px',
  transition: 'opacity 0.3s ease',
  
  '&.scan-active': {
    opacity: 1
  }
};

const statusOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 10
};

const successOverlayStyle = {
  ...statusOverlayStyle,
  backgroundColor: 'rgba(46, 204, 113, 0.7)'
};

const spinnerStyle = {
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderTop: '4px solid white',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
  marginBottom: '15px'
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
  marginBottom: '15px'
};

const successIconStyle = {
  width: '60px',
  height: '60px',
  color: 'white'
};

const retryButtonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.2s',
  
  '&:hover': {
    backgroundColor: '#c0392b'
  }
};

const controlsStyle = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center'
};

const actionButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.2s',
  
  '&:hover': {
    backgroundColor: '#2980b9'
  }
};

const resultContainerStyle = {
  marginTop: '25px',
  padding: '20px',
  background: '#f8f9fa',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
};

const resultHeaderStyle = {
  marginTop: 0,
  color: '#2c3e50',
  fontSize: '18px'
};

const resultContentStyle = {
  margin: '15px 0',
  padding: '15px',
  backgroundColor: 'white',
  borderRadius: '4px',
  maxHeight: '200px',
  overflowY: 'auto'
};

const textStyle = {
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: '14px',
  lineHeight: '1.5'
};

const copyButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: '#2ecc71',
  width: '100%',
  
  '&:hover': {
    backgroundColor: '#27ae60'
  }
};

// Add these to your global styles
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(70vh); }
  }
`;

// Add this to your main app file or stylesheet
document.head.insertAdjacentHTML('beforeend', `<style>${globalStyles}</style>`);

export default QRCodeAttendenceScanner;
