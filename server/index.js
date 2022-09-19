const express = require('express')
const app = express()
const port = 3002
const cors = require('cors')
const multer  = require('multer')
var result = "";
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

// bull
const Queue = require('bull');
const { doesNotMatch } = require('assert')
//const { extendLock } = require('bull/lib/scripts')

const waitingQueue = new Queue('waiting queue',{
  redis : {
    host : "127.0.0.1",
    port : 6379
  }
});


const nWorkers=4;

waitingQueue.process(nWorkers, async (job) =>{
  var nameFile=job.data.file.originalname;
  var extension=path.extname(nameFile);

  var data= new Date().getTime();

  const operation = await execution(`gcc -lstdc++ -o ./uploads/${data+path.basename(nameFile,extension)} ./uploads/${nameFile}`);
  if(operation["result"] === 1 ){
    solution = ("ok :D ");
  }else{
    solution = (`your request: ${operation["erroreType"]}`);
  }
  return Promise.resolve({
    complete : solution
  });
});
waitingQueue.on('progress', function(job , progress){
  console.log(`job number: ${job.id}`);
})

waitingQueue.on('completed', function(job , progress){
  console.log(`job number: ${job.id} is complited`);
})


/*waitingQueue.on('error', function (job , progress) {
  console.log(`job number: ${job.id} had an error`);
})*/

//multer
var storage = multer.diskStorage({
  destination: function(req, file, cb) { 
     cb(null, './uploads');
  }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);
  }
});
const upload = multer({ storage:storage})

//redis





app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

app.route('/').get((req,res) => {
    res.send('questa è la homepage');
})    

async function execution (operation){
  try{
    const {stdout, stderr}= await exec(operation);
    return {"stdout":stdout, "result":1};
  }catch (error){
    return {"erroreType":error.stderr, "result":2};
  }  
}


app.route('/file').post(upload.single('file'), async (req,res) => {
  //var name="file";
  const job = await waitingQueue.add({
    file: req.file
  });

  const result = await job.finished();
  //controlli
  res.send(result.complete);
  
  
}) 



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})