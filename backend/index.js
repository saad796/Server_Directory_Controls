//We should ensure that on any new signup make a folder for that user named on his user name

const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())


app.post('/get-folder-contents', (req, res) => {
    const user = req.body.user_id;
    const baseFolder = `userDirectory`;
    const userFolderPath = path.join(__dirname, baseFolder,user);
    console.log(baseFolder , user,userFolderPath);
  
    fs.readdir(userFolderPath, (err, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({error:'Error reading folder contents'});
      }
  
      const folderContents = [];
  
      files.forEach((file) => {
        const filePath = path.join(userFolderPath, file);
        const stats = fs.statSync(filePath);
  
        folderContents.push({
          name: file,
          isDirectory: stats.isDirectory(),
        });
      });
      console.log(folderContents);
      res.json(folderContents);
    });
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