//Note: maintaining commonJS code style for consistency

const exp=require("express")
const app=exp()
require('dotenv').config();
const mongoose=require("mongoose");
const port=process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());


//db conn
mongoose.connect(process.env.DBURL)
.then(app.listen(port,()=>console.log(`server listening on port ${port}...`)))
.catch(err=>console.log("error in DB connection",err))
app.use(exp.json())

//importing Apis
//blog
const blogApp = require("./APIs/blogApi");
app.use('/blog',blogApp)

//banner
const bannerApp = require("./APIs/bannerApi");
app.use('/banner',bannerApp)

//error handler middleware

app.use((err,req,res,next)=>{
    console.log("err obj in exoress error hanlder",err);
    res.send({message:err.message})
})