const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const db = require("./models")
// middleware
app.use(express.json());
app.use(cors({
    origin:process.env.CLIENT_URL
}))

app.get("/",(req,res)=>{
 res.send("Hello world")
})
// routes
const booksRoute = require('./routes/books')
app.use("/books",booksRoute)


// app.listen requires two arguments (port,func())
db.sequelize.sync({alter:true}).then(()=>{
    let port = process.env.APP_PORT;
    app.listen(port,()=>{
        
        console.log(`Server running on ${port}`)
    })
}).catch((err)=>{console.log(err)})




