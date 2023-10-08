import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import axios from 'axios';

const App = forwardRef((props, ref) => {
  const [folderContents, setFolderContents] = useState([]);

  const fetchFolderContents = () => {
    axios.get(`http://localhost:8000/get-folder-contents?user_id=${props.userId}`)
      .then((response) => {
        setFolderContents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching folder contents:', error);
      });
  };

  useEffect(() => {
    fetchFolderContents();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchFolderContents,
  }));

  const renderFolderContents = (contents, level = 0) => {
    return (
      <ul>
        {contents.map((item, index) => (
          <li key={index} style={{ marginLeft: `${level * 20}px` }}>
            {item.isDirectory ? (
              <div>{item.name}/</div>
            ) : (
              <div>{item.name}</div>
            )}
            {item.isDirectory && item.contents && renderFolderContents(item.contents, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>Folder Contents</h1>
      {renderFolderContents(folderContents)}
    </div>
  );
});

export default App;
