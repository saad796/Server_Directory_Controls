import './App.css';
import axios from "axios"
import {useState,useRef} from'react'
import Compo from "./component/Compo"
const id = "user_2334";

function App() {
  const [curFile , setCurFile] = useState(`/${id}`)
  const [fileInputVisible, setFileInputVisible] = useState(false);
  const [fileInputValue, setFileInputValue] = useState('');
  const [folderInputVisible, setFolderInputVisible] = useState(false);
  const [folderInputValue, setFolderInputValue] = useState('');
  const folderRefreshRef = useRef()

  const refreshFolderData = ()=>{
    if (folderRefreshRef.current) {
      folderRefreshRef.current.fetchFolderContents(); // Call the child function via the ref
    }
  }

  const handleFileInputChange = (e) => {
    setFileInputValue(e.target.value);
  };

  const handleFileInputBlur = () => {
    // Remove the input field when it loses focus
    setFileInputVisible(false);
  };

  const handleFileInputKeyPress =async (e) => {
    // Check if the Enter key is pressed
    if (e.key === 'Enter') {
      // Store the input value in the state
      setFileInputValue(e.target.value);

      try {
        const response = await axios.post('http://localhost:8000/newFile', {
          fileName : fileInputValue,
          filePath: curFile,
        });
        const responseData = response.data;
        refreshFolderData()
        console.log('Response Data:', responseData);
      } catch (error) {
        alert("error :" ,error)
        console.error('Error:', error);
      }

      // Remove the input field
      setFileInputVisible(false);
    }
  };

  const handleFolderInputChange = (e) => {
    setFolderInputValue(e.target.value);
  };

  const handleFolderInputBlur = () => {
    // Remove the input field when it loses focus
    setFolderInputVisible(false);
  };

  const handleFolderInputKeyPress = async (e) => {
    // Check if the Enter key is pressed
    if (e.key === 'Enter') {
      // Store the input value in the state
      setFolderInputValue(e.target.value);
      
      try {
        const response = await axios.post('http://localhost:8000/newFolder', {
          folderName : folderInputValue,
          filePath: curFile,
        });
        const responseData = response.data;
        refreshFolderData()
        console.log('Response Data:', responseData);
        setCurFile((prev)=>{
          return prev+`/${e.target.value}`
        })
      } catch (error) {
        alert("error :" ,error)
        console.error('Error:', error);
      }

      // Remove the input field
      setFolderInputVisible(false);
    }
  };

  const newFile = async () => {
    setFileInputVisible(true);
  }

  const newFolder = ()=>{
    setFolderInputVisible(true);
  }

  return (
    <>
      <div className="btn-container">
        {fileInputVisible ? (
          <>
            <button onClick={newFile}>File</button>
            <input
              type="text"
              value={fileInputValue}
              onChange={handleFileInputChange}
              onBlur={handleFileInputBlur}
              onKeyPress={handleFileInputKeyPress}
              autoFocus // Auto-focus the input field
            />
          </>
          ) : (
            <button onClick={newFile}>File</button>
        )}
        {folderInputVisible ? (
          <>
          <button onClick={newFolder}>Folder</button>
          <input
            type="text"
            value={folderInputValue}
            onChange={handleFolderInputChange}
            onBlur={handleFolderInputBlur}
            onKeyPress={handleFolderInputKeyPress}
            autoFocus // Auto-focus the input field
            />
          </>
        ) : (
          <button onClick={newFolder}>Folder</button>
        )}
        
      </div>
      <div className="directory">
          <Compo userId={id} ref={folderRefreshRef}/>
      </div>
    </>
  );
}

export default App;
