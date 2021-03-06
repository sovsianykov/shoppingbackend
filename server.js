import express  from 'express';
import cors from "cors";
import { mongo_Uri } from "./config.js";
import mongoMessages from "./messageModel.js"
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 5000;


//middlewares
app.use(express.json())
app.use(cors())
//db.config
async function startApp() {
    try {
        await mongoose.connect(mongo_Uri)
        app.listen(port,() => {
            console.log('SERVER IS RUNNING ON PORT ' + port)} )

    }
    catch (e) {
        console.log(e)
    }
}
mongoose.connection.once('open', () =>{
    console.log('Mongo Is ok!')

})
startApp()


//app routing
app.get("/", (req,res ) =>
    res.status(200).send("Hello World !!!"))
app.post("/api/message", (req,res) => {
    const dbMessage = req.body;

    mongoMessages.create(dbMessage,(err, data) =>{
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })

})
app.get("/api/messages", (req,res) =>{
    mongoMessages.find((err,data) =>{
        if (err) {
            res.status(500).send(err)
        } else {
            data.sort((b,a) =>{
                return a.timestamp - b.timestamp;
            })
            res.status(201).send(data)

        }
    })
})



