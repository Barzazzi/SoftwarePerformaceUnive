const express = require('express')
const app = express()
const port = 3002
const cors = require('cors')

app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

app.route('/asd').get((req, res) => {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})