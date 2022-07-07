const express = require('express')
const app = express()
const port = 3002
const cors = require('cors')
const multer  = require('multer')
const upload = multer({ dest: './uploads' })

app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

app.route('/asd').get((req, res) => {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.route('/file').post(upload.single('uploaded_file'),(req, res) => {
  //res.json({msg: 'This is CORS-enabled for all origins!'})
  console.log(req.file, req.body)
  res.send("tuttappost");
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})