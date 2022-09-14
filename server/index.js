const express = require('express')
const app = express()
const port = 3002
const cors = require('cors')
const multer  = require('multer')
var result = "";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
//const Queue = require('bull');
//const { extendLock } = require('bull/lib/scripts')
//const myFirstQueue = new Bull('my-first-queue');

var storage = multer.diskStorage({
  destination: function(req, file, cb) { 
     cb(null, './uploads');
  }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);
  }
});
/*
const waitingQueue = new Queue('waiting queue',{
  redis: {
      host: '127.0.0.1',
      port: 6379,
  }
});
*/
const upload = multer({ storage:storage})


app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

app.route('/').get((req,res) => {
    res.send('questa Ã¨ la homepage');
})    
/*app.route('/asd').post((req, res) => {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})*/

async function execution (operation){
  try{
    const {stdout, stderr}= await exec(operation);
    return {"stdout":stdout, "result":1};
  }catch (error){
    return {"erroreType":error.stderr, "result":2};
  }
  
}

app.route('/file').post(upload.single('file'), async (req,res) => {
  console.log(req.file);
  var name="file";
  const operation = await execution(`gcc -lstdc++ -o ./uploads/${name}.exe ./uploads/${req.file.originalname}`);
  console.log("finito l'exec: " + operation);
  if(operation["result"] === 1 ){
    res.send("ok :D ");
  }else{
    res.send(`your request: ${operation["erroreType"]}`);
  }
  
}) 



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})