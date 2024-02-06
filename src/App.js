import React, { useState, useEffect } from 'react';
import './App.css'

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    const savedState = JSON.parse(sessionStorage.getItem('audioPlayerState'));
    if (savedState) {
      setAudioFiles(savedState.audioFiles);
      setCurrentTrackIndex(savedState.currentTrackIndex);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      'audioPlayerState',
      JSON.stringify({ audioFiles, currentTrackIndex })
    );
  }, [audioFiles, currentTrackIndex]);

  const handleFileChange = async (event) => {
    const files = event.target.files;

    const readFile = async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const data = URL.createObjectURL(new Blob([arrayBuffer]));

      return {
        name: file.name,
        data,
      };
    };

    const newAudioFiles = await Promise.all(Array.from(files).map((file) => readFile(file)));

    setAudioFiles((prevFiles) => [...prevFiles, ...newAudioFiles]);
  };

  const handlePlay = (index) => {
    setCurrentTrackIndex(index);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + audioFiles.length) % audioFiles.length);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % audioFiles.length);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="container">
      <div className="input-container">
        <input type="file" accept="audio/*" id="fileInput" onChange={handleFileChange} multiple />
        <label htmlFor="fileInput" className="file-input-label">Choose Audio Files</label>
      </div>
      <ul className="playlist-container">
        {audioFiles.map((file, index) => (
          <li key={index}>
            <button onClick={() => handlePlay(index)}>
              {file.name}
            </button>
          </li>
        ))}
      </ul>
      {audioFiles.length > 0 && (
        <div>
          <audio controls onEnded={handleEnded} autoPlay src={audioFiles[currentTrackIndex].data}>
            Your browser does not support the audio element.
          </audio>
          <button onClick={handlePrevious} disabled={audioFiles.length <= 1}>Previous</button>
          <button onClick={handleNext} disabled={audioFiles.length <= 1}>Next</button>
        </div>
      )}
    </div>
  );
};

export default App;
