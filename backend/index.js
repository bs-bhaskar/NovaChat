const express = require('express');//require express
const cookieParser = require('cookie-parser');//require cookie-parser
const cors = require('cors');
const dotenv = require('dotenv');//require dotenv
const connectDb = require('./config/dbConnect');
const bodyParser=require('body-parser')
const authRoute = require('./routes/authRoute')
const chatRoute = require('./routes/chatRoute')
const statusRoute= require('./routes/statusRoute')
const http=require('http')
const initializeSocket=require('./services/socketServices')

dotenv.config();//configure dotenv-this will automaticall featch velues from .env file

const PORT = process.env.PORT;
const app=express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://nova-chat-umber.vercel.app"
];

const corsOption = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOption));

//Middleware
app.use(express.json())//parse body data
app.use(cookieParser())//parse token on every request
app.use(bodyParser.urlencoded({extended:true}))

//database connection
connectDb()

// create server
const server=http.createServer(app)
const io=initializeSocket(server)

// apply socket meddleware before routes
app.use((req,res,next)=>{
    req.io=io
    req.socketUserMap=io.socketUserMap
    next()
})


//Routes
app.use('/api/auth',authRoute)
app.use('/api/chats', chatRoute)
app.use('/api/status',statusRoute)

server.listen(PORT, ()=>{
    console.log(`server running... on port ${PORT}`);
}) 