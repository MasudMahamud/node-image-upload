const express = require('express');
const multer  = require('multer')
const path = require('path');


const UPLOADS_FOLDER = "./uploads/";

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    
    const fileExt = path.extname(file.originalname);
    
    const FileName = file.originalname
                          .replace(fileExt, "")
                          .toLowerCase()
                          .split(" ")
                          .join("-") + "-" + Date.now();
   cb(null, FileName + fileExt);                       
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,//2mb
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png"||
      file.mimetype === "image/jpg"||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("only .png .jpg or .jpeg files are allowed"));
    }
  }
});

const port = 4000

const app = express()

app.get("/", (req, res) => {
  res.send('hello world');
})

app.post("/", upload.single("avatar"), (req, res) => {
  res.send(req.body);
})

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("There was upload error!");
    } else{
      res.status(500).send(err.message);
    }
    
  } else {
    res.send('upload success');
  }
})

app.listen(port)