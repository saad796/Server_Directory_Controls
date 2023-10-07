import React, { forwardRef, useImperativeHandle,useEffect, useState } from 'react';
import axios from 'axios';

const App = forwardRef((props, ref) => {
  const [folderContents, setFolderContents] = useState([]);


const fetchFolderContents = () => {
    axios.post('http://localhost:8000/get-folder-contents',{user_id:props.userId})
      .then((response) => {
        setFolderContents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching folder contents:', error);
      });
  };

  useEffect(() => {
    // Fetch folder contents from the server
    fetchFolderContents()
  }, []);

  useImperativeHandle(ref, () => ({
    fetchFolderContents,
  }));

  const renderFolderContents = (contents) => {
    return contents.map((item, index) => (
      <div key={index} style={{ marginLeft: item.isDirectory ? '20px' : '0' }}>
        {item.isDirectory ? (
          <div>{item.name}/</div>
        ) : (
          <div>{item.name}</div>
        )}
      </div>
    ));
  };

  return (
    <div>
      <h1>Folder Contents</h1>
      {renderFolderContents(folderContents)}
    </div>
  );
})

export default App;
