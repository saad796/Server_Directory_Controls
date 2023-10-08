import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import axios from 'axios';

const App = forwardRef((props, ref) => {
  const [folderContents, setFolderContents] = useState([]);
  const [clickedItemIndices, setClickedItemIndices] = useState([]);


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

  const handleDirectoryClick = (content, index, path,level, event,isDirectory) => {
    event.stopPropagation(); // Prevent event propagation

    // Update the clicked item indices for this level
    setClickedItemIndices((prevIndices) => {
      const updatedIndices = [...prevIndices];
      updatedIndices[level] = index;
      return updatedIndices;
    });
    props.updateCurrentPath(content, path);
  };


  const renderFolderContents = (contents, level = 0, parentPath = '') => {
    return (
      <ul>
        {contents.map((item, index) => {
          const fullPath = parentPath ? `${parentPath}/${item.isDirectory?item.name:""}` :`/${item.isDirectory?item.name:""}`;
          return (
            <li
              key={index}
              onClick={(event) => handleDirectoryClick(item.name, index, fullPath,level, event,item.isDirectory)}
              style={{
                marginLeft: `${level * 20}px`,
                border: index === clickedItemIndices[level] ? '1px solid black' : 'none',
                background: index === clickedItemIndices[level] ? 'lightgrey' : 'none',
              }}
            >
              {item.isDirectory ? (
                <div>{item.name}/</div>
              ) : (
                <div>{item.name}</div>
              )}
              {item.isDirectory && item.contents && renderFolderContents(item.contents, level + 1, fullPath)}
            </li>
          );
        })}
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
