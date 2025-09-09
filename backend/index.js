//Note: maintaining commonJS code style for consistency

const exp=require("express")
const app=exp()
require('dotenv').config();
const mongoose=require("mongoose");
const port=process.env.PORT || 4000;
const cors = require('cors');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // allow cookies
}));

//db conn
mongoose.connect(process.env.DBURL)
.then(app.listen(port,()=>console.log(`server listening on port ${port}...`)))
.catch(err=>console.log("error in DB connection",err))
app.use(exp.json())

//importing Apis
//admin account api
const adminAccountApp=require("./APIs/adminAccountApi")
app.use("/admin",adminAccountApp)


//block api
const blockApp=require("./APIs/blockApi")
app.use("/block",blockApp)
//blog api
const blogApp=require("./APIs/blogApi")
app.use("/blog",blogApp)

//banner api
const bannerApp=require("./APIs/bannerApi")
app.use("/banner",bannerApp)

//client api
const clientApp=require("./APIs/clientApi")
app.use("/client",clientApp)

//pages api
const pagesApp=require("./APIs/pagesApi")
app.use("/page",pagesApp)

//testimonial api
const testimonialApp=require("./APIs/testimonialApi")
app.use("/testimonial",testimonialApp)

//configuration api
const configurationApp=require("./APIs/configurationApi")
app.use("/configuration",configurationApp)

//error handler middleware

app.use((err,req,res,next)=>{
    console.log("err obj in express error hanlder",err);
    res.send({message:err.message})
})