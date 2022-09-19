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
const { send } = require('process')
//const { extendLock } = require('bull/lib/scripts')

const waitingQueue = new Queue('waiting queue',{
  redis : {
    host : "127.0.0.1",
    port : 49154,
    password : "redispw"
  }
});


const nWorkers=4;

waitingQueue.process(nWorkers, async (job) =>{
  var nameFile=job.data.name;
  var extension=path.extname(nameFile);

  //const operation = await execution(`gcc -lstdc++ -o ./uploads/${data+path.basename(nameFile,extension)} ./uploads/${nameFile}`);
  const operation = await execution(`g++ -o ./uploads/${path.basename(nameFile,extension)} ./uploads/${nameFile}`);
  if(operation["result"] === 1 ){
    //const remove = await execution(`del ./uploads/${nameFile}`);
    //const remove = await execution(`rm ./uploads/${nameFile}`);
    //console.log(remove)
    solution = ("ok :D ");
  }else{
    //pew = operation["erroreType"].replaceAll(/\d+\$/, "").replaceAll("./uploads/","")
    pew = operation["erroreType"].replace(new RegExp(/\d+\$/,"g"), "").replace(new RegExp("./uploads/","g"),"")
    solution = (`your request: ${pew}`);
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


/*waitingQueue.on('error', function (job, error) {
  console.log(`job number: ${job.name} had an error`);
})*/

//multer
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
     cb(null, './uploads');
  },
  filename: function (req, file, cb) {
     cb(null ,Date.now() +"$"+file.originalname);
  }
});
const upload = multer({
  storage:storage,

  fileFilter: (req, file, cb)=>{
    var extension=path.extname(file.originalname);
    if (extension == ".cpp" || extension == ".cc") {
      cb(null, true);
    } else {
      //cb(new Error("mi piace il cazzo"),false);
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

const fileUpload = upload.fields([{ name: "file" }]);

app.route('/file').post(async (req,res) => {
  fileUpload(req, res, async (error) => {
    //console.log(error);
    if (error) {
      console.log("File can not be uploaded");
      res.send(error.message);
    } else {
      const job = await waitingQueue.add({
        name: req.files["file"][0].filename
      });

      //console.log(req.files["file"][0].filename)
      const result = await job.finished();

      //controlli
      console.log(result.complete)
      res.send(result.complete);
    }
  })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
