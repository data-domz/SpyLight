import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import UploadSection from './components/UploadSection';
import PreferencesSection from './components/PreferencesSection';
import ProcessingButton from './components/ProcessingButton';
import DownloadSection from './components/DownloadSection';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import './App.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const viewerRef = useRef(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleFileUpload = async (uploadedFile) => {
    const fileType = uploadedFile.type;

    if (fileType === 'application/pdf') {
      setFileUrl(URL.createObjectURL(uploadedFile));
      setFileType('pdf');
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setFileContent(result.value);
        setFileType('docx');
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      alert('Unsupported file type');
    }
  };

  const handlePreferencesChange = (newPreferences) => {
    // Placeholder function for handling preferences change
  };

  const handleProcessDocument = () => {
    // Placeholder function for processing the document
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.log('Search button pressed with term:', searchTerm);

    if (fileType === 'docx') {
      const highlightedContent = fileContent.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);
      setFileContent(highlightedContent);
    }
  };

  return (
    <div className="App">
      <h1>SpyLight</h1>
      <UploadSection onFileUpload={handleFileUpload} />
      <div className="viewer-container">
        <div className="document-viewer" ref={viewerRef} style={{ position: 'relative' }}>
          {fileType === 'pdf' && (
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
              <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          )}
          {fileType === 'docx' && (
            <div
              className="docx-content"
              dangerouslySetInnerHTML={{ __html: fileContent }}
            ></div>
          )}
          {!fileType && (
            <div className="placeholder">
              <p>Document preview will appear here</p>
            </div>
          )}
        </div>
        <div className="button-panel">
          <button className="word-search">Word Search</button>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleSearchChange} 
            placeholder="Enter word to search" 
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
          <button className="questions">Questions</button>
          <button className="definitions">Definitions</button>
          <button className="numbers">Numbers</button>
          <button className="quotes">Quotes</button>
        </div>
      </div>
      <PreferencesSection onPreferencesChange={handlePreferencesChange} />
      <ProcessingButton onProcess={handleProcessDocument} />
      <DownloadSection processedFileUrl="" />
    </div>
  );
}

export default App;
