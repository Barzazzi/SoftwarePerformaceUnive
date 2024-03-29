const express = require('express')
const app = express()
const port = 3002
const cors = require('cors')
const multer  = require('multer')
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

// bull
const Queue = require('bull');

const waitingQueue = new Queue('waiting queue',{
  redis : {
    host : "127.0.0.1",
    port : 55000,
    password : "redispw"
  },
});

/*
const waitingQueue = new Queue('waiting queue',{
  redis : {
    host : "127.0.0.1",
    port : 6379
  }
});
*/

const nWorkers=4;

//funzione di sleep
function sleep(t) {
  return new Promise(resolve => setTimeout(resolve, t));
}

waitingQueue.process(nWorkers, async (job) =>{
  var nameFile=job.data.name;
  var extension=path.extname(nameFile);
  const operation = await execution(`g++ -o ./uploads/${path.basename(nameFile,extension)} ./uploads/${nameFile}`);
  if(operation["result"] === 1 ){
    //estensione da modificare quando si passa da windows a mac
    //await execution(`del /f uploads\\${path.basename(nameFile,extension)}.exe`);
    await execution(`rm uploads/${path.basename(nameFile,extension)}`);
    solution = ("Your file "+nameFile.replace(new RegExp(/\d+\-/,"g"), "")+" has been compiled without any error! Good job!");
  }else{
    pew = operation["erroreType"].replace(new RegExp(/\d+\-/,"g"), "").replace(new RegExp("./uploads/","g"),"")
    solution = (`Compilation failed:\n ${pew}`);
  }
  //await execution(`del /f uploads\\${nameFile}`);
  await execution(`rm uploads/${nameFile}`);
  return Promise.resolve({
    complete : solution
  });
});

waitingQueue.on('progress', function (job, progress) {
  console.log(`job ${job.id} is ${progress * 100}% ready!`);
});

waitingQueue.on('completed', function(job , progress){
  console.log(`job number: ${job.id} is complited`);
});

waitingQueue.on('active', function (job, jobPromise) {
  console.log(`job number: ${job.id} has started compiling`);
});

waitingQueue.on('failed', function (job, err) {
  console.log(`job number: ${job.id} has failed`);
});

waitingQueue.on('waiting', function (jobId) {
  console.log(`job number: ${jobId} is waiting`);
});


//multer
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
     cb(null, './uploads');
  },
  filename: function (req, file, cb) {
     cb(null ,Date.now() +"-"+file.originalname);
  }
});
const upload = multer({
  storage:storage,

  fileFilter: (req, file, cb)=>{
    var extension=path.extname(file.originalname);
    if (extension == ".cpp" || extension == ".cc" || extension == ".c") {
      cb(null, true);
    } else {
      return cb(new Error('Only .cpp, .cc format allowed!'),false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },

})

//redis

app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

app.route('/').get((req,res) => {
    res.send('Server up');
})

async function execution (operation){
  try{
    const {stdout, stderr}= await exec(operation);
    return {"stdout":stdout, "result":1};
  }catch (error){
    return {"erroreType":error.stderr, "result":2};
  }
}

const fileUpload = upload.fields([{ name: "file" }]);

app.route('/file').post(async (req,res) => {
  fileUpload(req, res, async (error) => {
    if (error) {
      console.log("File can not be uploaded");
      res.send(error.message);
    } else {
      const jobOptions = {
        removeOnComplete: true,
        removeOnFail: true
      }
      const job = await waitingQueue.add({
        name: req.files["file"][0].filename
      },jobOptions);
      console.log("jobs active: "+(await waitingQueue.getJobCounts()).active);
      console.log("jobs waiting: "+(await waitingQueue.getJobCounts()).waiting);
      const result = await job.finished();
      res.send(result.complete);
    }
  })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
