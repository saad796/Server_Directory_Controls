import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import axios from 'axios';

const App = forwardRef((props, ref) => {
  const [folderContents, setFolderContents] = useState([]);
  const [clickedItemIndex, setClickedItemIndex] = useState(null);


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

  const handleDirectoryClick = (content, index, path,level, event) => {
    event.stopPropagation(); // Prevent event propagation
    setClickedItemIndex(`${index}_${level}`);
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
              onClick={(event) => handleDirectoryClick(item.name, index, fullPath,level, event,)}
              style={{
                marginLeft: `${level * 20}px`,
                
              }}
            >
              <div className={`${index}_${level}`=== clickedItemIndex ? 'selected-item':'not-selected-item'}>{item.isDirectory ? `${item.name}/` : item.name}</div>
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
