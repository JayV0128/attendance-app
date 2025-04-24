import React, { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from 'antd';

const QRCodeAttendanceScanner = () => {
  const [extractedText, setExtractedText] = useState('');
  const [cameraStatus, setCameraStatus] = useState('loading');
  const [scanActive, setScanActive] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const videoRef = useRef(null);

  const [scanStartTime, setScanStartTime] = useState(null);
  const [scanDuration, setScanDuration] = useState(null);
  const [fullResponseTime, setFullResponseTime] = useState(null);

  // Initialize camera preview
  useEffect(() => {
    let stream;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 } }
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
    return () => stream && stream.getTracks().forEach(t => t.stop());
  }, []);

  const handleScan = (result) => {
    if (result && scanActive) {
      const text = result.text || result;
      setExtractedText(text);
      setScanActive(false);
      if (scanStartTime) {
        const duration = Date.now() - scanStartTime;
        setScanDuration(duration > 0 ? duration : null);
      }
    }
  };

  const handleError = (err) => console.error('Scanner error:', err);

  const startScan = () => {
    // Prepare for a fresh scan
    setExtractedText('');
    setScanDuration(null);
    setFullResponseTime(null);
    setScanStartTime(Date.now());
    setScanKey(prev => prev + 1);  // remount QrReader
    setScanActive(true);
  };

  const takeAttendance = async () => {
    if (!extractedText || !scanStartTime) return;
    const startRoundTrip = Date.now();

    const url = import.meta.env.VITE_API_URL + "/attendance/log";
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: extractedText, method: "QRcode", deviceInfo: "Web" })
    });

    const fullFlow = Date.now() - scanStartTime;
    setFullResponseTime(fullFlow);

    alert(response.ok ? `Attendance submitted!\n⏱ Total Time: ${fullFlow} ms` : 'Error submitting attendance.');
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>QR Code Attendance</h1>

      <div style={videoContainerStyle}>
        <video ref={videoRef} autoPlay playsInline muted style={videoStyle} />
        {cameraStatus === 'loading' && <Overlay message="Initializing camera..." />}
        {cameraStatus === 'error' && <Overlay message="Camera unavailable" retry />}
      </div>

      {/* Scan Control */}
      <div style={controlsStyle}>
        {!scanActive && !extractedText && (
          <Button type="primary" onClick={startScan}>Start Scan</Button>
        )}
        {scanActive && <p style={statusTextStyle}>Scanning for QR code...</p>}
      </div>

      {/* QR Reader (conditionally remounted) */}
      {scanActive && (
        <div style={{ display: 'none' }}>
          <QrReader
            key={scanKey}
            scanDelay={300}
            onResult={handleScan}
            onError={handleError}
            constraints={{ facingMode: 'environment' }}
          />
        </div>
      )}

      {/* Results Panel */}
      {extractedText && (
        <div style={resultContainerStyle}>
          <h3 style={resultHeaderStyle}>Scanned Content</h3>
          <pre style={textStyle}>{extractedText}</pre>
          {scanDuration && (
            <p style={durationStyle}>⏱ Scan Duration: {scanDuration} ms</p>
          )}
          {fullResponseTime && (
            <p style={{ textAlign: 'center', marginTop: '8px', color: '#3498db' }}>
              📦 Total Time (Scan → Confirmed): {fullResponseTime} ms
            </p>
          )}
          <div style={{ marginTop: '16px' }}>
            <Button onClick={takeAttendance} type="primary">Submit Attendance</Button>
            <Button onClick={startScan} style={{ marginLeft: '8px' }}>Rescan</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Overlay = ({ message, retry }) => (
  <div style={overlayStyle}>
    <p>{message}</p>
    {retry && <Button onClick={() => window.location.reload()}>Retry</Button>}
  </div>
);

// Styles
const containerStyle = { maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: "'Segoe UI', Roboto, sans-serif" };
const headerStyle = { textAlign: 'center', marginBottom: '16px' };
const videoContainerStyle = { position: 'relative', width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '8px', overflow: 'hidden' };
const videoStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const overlayStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' };
const controlsStyle = { textAlign: 'center', margin: '16px 0' };
const statusTextStyle = { textAlign: 'center', margin: '8px 0' };
const resultContainerStyle = { background: '#f9f9f9', padding: '16px', borderRadius: '8px', marginTop: '16px' };
const resultHeaderStyle = { marginTop: 0 };
const textStyle = { background: '#fff', padding: '8px', borderRadius: '4px', wordBreak: 'break-word' };
const durationStyle = { textAlign: 'center', marginTop: '8px', color: '#2ecc71' };

export default QRCodeAttendanceScanner;
