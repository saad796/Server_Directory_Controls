//We should ensure that on any new signup make a folder for that user named on his user name

const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

function readDirectoryRecursive(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  let folderContents = [];

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    const item = {
      name: file,
      isDirectory: stats.isDirectory(),
    };

    if (item.isDirectory) {
      item.contents = readDirectoryRecursive(filePath); 
    }

    folderContents.push(item);
  });

  return folderContents;
}

//For creating an empty folder for the new user 
//return boolean on status of folder creation
function newUserSignin(userId)
{
  let folderCreationStatus = false;
  const baseFolder = `./userDirectory`;
  const folderPath = path.join(__dirname,baseFolder,userId)
  console.log(folderPath);
  fs.mkdir(folderPath, (err) => {
      if (err) {
          console.error(err);
          return(folderCreationStatus);
      } else {
          folderCreationStatus=true
          return(folderCreationStatus);
      }
  });
}

app.get('/get-folder-contents', (req, res) => {
    const user = req.query.user_id;
    const baseFolder = `userDirectory`;
    const userFolderPath = path.join(__dirname, baseFolder,user);
  
    try {
      const folderContents = readDirectoryRecursive(userFolderPath);
      const formattedContents = JSON.stringify(folderContents, null, 1);
      res.set('Content-Type', 'application/json');
      res.send(formattedContents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error reading folder contents' });
    }
  });

app.post("/newFile",(req,res)=>{
    let fileCreationStatus = false //for sending status to user

    const fileName = req.body.fileName; 
    const baseFolder = `./userDirectory${req.body.filePath}`;
    const filePath = path.join(__dirname, baseFolder, fileName);

    fs.writeFile(filePath, '', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({error:'Error creating file',status:fileCreationStatus});
        } else {
            fileCreationStatus=true
            res.json({msg:'File created',status:fileCreationStatus});
        }
    });
})

app.post("/newFolder",(req,res)=>{
    let folderCreationStatus = false //for sending status to user

    const {folderName,filePath} = req.body;
    const baseFolder = `./userDirectory${filePath}`;
    const folderPath = path.join(__dirname,baseFolder,folderName)

    fs.mkdir(folderPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({error:'Error creating folder',status:folderCreationStatus});
        } else {
            folderCreationStatus=true
            res.json({msg:'Folder created',status:folderCreationStatus});
        }
      });
})

app.listen(8000 , ()=> console.log("server is running on port : 8000"))