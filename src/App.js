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
  const [originalContent, setOriginalContent] = useState(''); // New state for storing original content
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
        const options = {
          styleMap: [
            "p => p:fresh"
          ]
        };
        const result = await mammoth.convertToHtml({ arrayBuffer }, options);
        setFileContent(result.value);
        setOriginalContent(result.value); // Store original content
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
      const highlightedContent = originalContent.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);
      setFileContent(highlightedContent);
    }
  };

  const handleClearHighlights = () => {
    if (fileType === 'docx') {
      setFileContent(originalContent); // Reset to original content
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="App">
      <h1>SpyLight</h1>
      <UploadSection onFileUpload={handleFileUpload} />
      <div className="viewer-container">
        <div className="document-viewer" ref={viewerRef}>
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
            onKeyDown={handleKeyDown} 
            placeholder="Enter word to search" 
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
          <button onClick={handleClearHighlights} className="clear-button">Clear Highlights</button>
          <button className="questions">Questions</button>
          <button className="definitions">Definitions</button>
          <button className="numbers">Numbers</button>
          <button className="quotes">Quotes</button>
          <div className="chat-box">
            <h2>Chat with AI</h2>
            <div className="chat-messages">
              {/* Chat messages will be displayed here */}
            </div>
            <input type="text" className="chat-input" placeholder="Type your message here..." />
            <button className="send-button">Send</button>
          </div>
        </div>
      </div>
      <PreferencesSection onPreferencesChange={handlePreferencesChange} />
      <ProcessingButton onProcess={handleProcessDocument} />
      <DownloadSection processedFileUrl="" />
    </div>
  );
}

export default App;
