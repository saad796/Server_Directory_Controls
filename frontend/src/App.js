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
      folderRefreshRef.current.fetchFolderContents(); 
    }
  }

  const updateCurrentPath = (name,path)=>{
    setCurFile(`/${id}${path}`)
  }

  const handleFileInputChange = (e) => {
    setFileInputValue(e.target.value);
  };

  const handleFileInputBlur = () => {
    setFileInputVisible(false);
  };

  const handleFileInputKeyPress =async (e) => {
    if (e.key === 'Enter') {
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

      setFileInputVisible(false);
    }
  };

  const handleFolderInputChange = (e) => {
    setFolderInputValue(e.target.value);
  };

  const handleFolderInputBlur = () => {
    setFolderInputVisible(false);
  };

  const handleFolderInputKeyPress = async (e) => {
    if (e.key === 'Enter') {
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
        <button onClick={()=>{setCurFile(`/${id}`)}}>Home</button>
        {fileInputVisible ? (
          <>
            <button onClick={newFile}>File</button>
            <input
              type="text"
              value={fileInputValue}
              onChange={handleFileInputChange}
              onBlur={handleFileInputBlur}
              onKeyPress={handleFileInputKeyPress}
              autoFocus
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
            autoFocus
            />
          </>
        ) : (
          <button onClick={newFolder}>Folder</button>
        )}
        
      </div>
      <div className="directory">
          <Compo userId={id} ref={folderRefreshRef} updateCurrentPath={updateCurrentPath}/>
      </div>
    </>
  );
}

export default App;
