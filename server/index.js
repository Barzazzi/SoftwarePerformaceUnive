const express = require('express')
const app = express()
const port = 3002
const cors = require('cors')
const multer  = require('multer')
var result = "";
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const Queue = require('bull');
const { doesNotMatch } = require('assert')
//const { extendLock } = require('bull/lib/scripts')

var storage = multer.diskStorage({
  destination: function(req, file, cb) { 
     cb(null, './uploads');
  }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);
  }
});



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



const waitingQueue = new Queue('waiting queue',{
  redis: {
      host: '127.0.0.1',
      port: 55000,
      password: 'redispw'
  }
});

waitingQueue.on('progress', function(job, progress) {
  console.log(`Job ${job.id} is ${progress * 100}% ready!`);
});
waitingQueue.on('stalled', function(job) {
  console.log(`Job ${job.id} is stallato!`);
});

waitingQueue.on('completed', function(job, result) {
  console.log(`Job ${job.id} completed! Result: ${result.complete}`);
  job.remove();
});
waitingQueue.on('failed', (job, result) => {
  console.log("The jobs failed")
});

const nWorkers=4;

waitingQueue.process(nWorkers, async (job) =>{
  console.log("process");
  var nameFile=job.data.file.originalname;
  var extension=path.extname(nameFile);

  var data= new Date().getTime();

  const operation = await execution(`gcc -lstdc++ -o ./uploads/${data+path.basename(nameFile,extension)} ./uploads/${nameFile}`);
  console.log("exec: ");
  if(operation["result"] === 1 ){
      return Promise.resolve({complete: "compiled: "+ nameFile+" at: "+ data});
  }else{
      return Promise.reject({complete: `error: ${operation["erroreType"]}`});
  } 
});



app.route('/file').post(upload.single('file'), async (req,res) => {
  console.log("post, count queue: "+ (await waitingQueue.count()).toString());
  const job= await waitingQueue.add({file: req.file},{ delay: 5000 });
  const result = await job.finished();
  //controlli
  if(result) res.send(result.complete);
  else res.send(result.complete);

/*
  console.log(req.file);
  
  console.log("finito l'exec: " + operation);
  if(operation["result"] === 1 ){
    res.send("ok :D ");
  }else{
    res.send(`your request: ${operation["erroreType"]}`);
  }*/
  
}) 



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})