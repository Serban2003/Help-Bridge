"use client";
import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e : any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setLoading(true);
    setUploadStatus('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:5000/api/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus(`✅ Upload successful! Image ID: ${result.I_id}`);
      } else {
        setUploadStatus('❌ Upload failed.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('❌ Error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Upload Profile Image</h2>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select an image file:</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
      </Form.Group>
      <Button variant="primary" onClick={handleUpload} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Upload'}
      </Button>
      {uploadStatus && <Alert className="mt-3">{uploadStatus}</Alert>}
    </Container>
  );
};

export default ImageUploader;
