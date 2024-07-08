import React from 'react';
import { useDropzone } from 'react-dropzone';

const UploadSection = ({ onFileUpload }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: ['.pdf', '.docx', 'image/jpeg', 'image/png'],
    onDrop: (acceptedFiles) => {
      onFileUpload(acceptedFiles[0]);
    }
  });

  return (
    <div className="upload-section">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a file here, or click to select a file</p>
      </div>
    </div>
  );
};

export default UploadSection;
