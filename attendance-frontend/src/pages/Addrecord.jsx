import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Card, message, Modal } from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const Addrecord = () => {
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [NfcTag, setNfcTag] = useState('');
  
  const [qrData, setQrData] = useState('');
  const [token, setToken] = useState('');
  const [submissionData, setSubmissionData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);  // For modal visibility
  
  const backend_API_URL = import.meta.env.VITE_API_URL + '/users/create';

  const generateToken = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // State to store accumulated NFC input
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    // Simulate NFC input with keyboard typing
    const handleKeyPress = (event) => {
      // Only allow alphanumeric characters
      if (/^[a-zA-Z0-9]$/.test(event.key)) {
        setCurrentInput((prevInput) => prevInput + event.key);  // Append the key pressed
      }

      // Once we have a full NFC tag (e.g., 10 characters), set the NFC tag
      if (currentInput.length === 9 && /^[a-zA-Z0-9]$/.test(event.key)) {
        setNfcTag(currentInput + event.key);  // Complete the NFC tag
        setCurrentInput('');  // Reset input after tag is complete
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [currentInput]);

  const assignToken = (values) => {
    const token = generateToken();
    setGeneratedToken(token);

    const data = {
      name: values.name,
      qr_code_id: token,
    };
    
    setQrData(token);
    setToken(token);
    setSubmissionData(data);
    setSubmissionStatus(true);
  };

  const handleApiError = (error) => {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error(error.response.data.message || 'Request failed');
    } else if (error.request) {
      console.error('Network Error:', error.message);
      throw new Error('Network connection failed');
    } else {
      console.error('Request Setup Error:', error.message);
      throw new Error('Invalid request configuration');
    }
  };

  const submitRecord = async () => {
    try {
      if (!NfcTag) {
        message.error('Please scan the NFC tag!');
        return;
      }

      const payload = { ...submissionData, nfc_tag_id: NfcTag };
      console.log('payload: ', payload);

      const response = await axios.post(backend_API_URL, payload);
      console.log('Submission Successful:', response.message);

      // Show success modal after successful submission
      setIsModalVisible(true);  // Show the modal on success

    } catch (error) {
      return handleApiError(error);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);  // Close modal when "OK" is clicked
    // Optionally, reset form or perform other actions here
  };

  const handleCancel = () => {
    setIsModalVisible(false);  // Close modal when "Cancel" is clicked
  };

  return (
    <div style={{ padding: '24px' }}>
      <Form
        onFinish={assignToken}
        style={{
          width: '50%',
          border: '1px solid #d9d9d9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
          Generate Token
        </Button>

        <Button
          type="primary"
          style={{ marginTop: '16px', marginLeft: '50px' }}
          onClick={submitRecord}
        >
          Submit
        </Button>
      </Form>

      {submissionStatus && (
        <>
          <Card
            title="QR Code "
            style={{
              width: '50%',
              marginTop: '24px',
              borderColor: '#f0f0f0',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <strong>Your Token:</strong>
              <div
                style={{
                  padding: '8px',
                  marginTop: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '4px',
                  wordBreak: 'break-all',
                }}
              >
                {generatedToken}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <QRCodeSVG
                value={qrData}
                size={180}
                level="M"
                includeMargin={true}
                style={{ border: '1px solid #eee', padding: '12px' }}
              />
              <p style={{ marginTop: '8px', color: '#666' }}>
                Scan this code for verification
              </p>
            </div>
          </Card>

          <Card
            title="NFC Tag "
            style={{
              width: '50%',
              marginTop: '24px',
              borderColor: '#f0f0f0',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <strong>Your NFC Tag:</strong>
              <div
                style={{
                  padding: '8px',
                  marginTop: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '4px',
                  wordBreak: 'break-all',
                }}
              >
                {NfcTag ? NfcTag : 'Waiting for NFC tag...'}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Success Modal */}
      <Modal
        title="Registration Successful"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelButtonProps={{ style: { display: 'none' } }}  // Hides the cancel button
      >
        <p>Your user has been successfully registered!</p>
        <p>Your NFC tag has been successfully linked to the account.</p>
      </Modal>
    </div>
  );
};

export default Addrecord;