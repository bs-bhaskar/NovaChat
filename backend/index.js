const express = require('express');//require express
const cookieParser = require('cookie-parser');//require cookie-parser
const cors = require('cors');
const dotenv = require('dotenv');//require dotenv

dotenv.config();//configure dotenv-this will automaticall featch velues from .env file

const PORT = process.env.PORT;
const app=express();

app.listen(PORT, ()=>{
    console.log(`server running... on port ${PORT}`);
}) 