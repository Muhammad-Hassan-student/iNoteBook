const connectDb = require("./db");
const express = require('express');




//recall
connectDb();
const app = express();

//port
const port = 5000;

//middleware

app.use(express.json());

//routes connection or routes available

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));


app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost: ${port}`)
})