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
//banner api
const bannerApp=require("./APIs/bannerApi")
app.use("/banner",bannerApp)

//blog api
const blogApp=require("./APIs/blogApi")
app.use("/blog",blogApp)

//client api
const clientApp=require("./APIs/clientApi")
app.use("/client",clientApp)

//configuration api
const configurationApp=require("./APIs/configurationApi")
app.use("/configuration",configurationApp)

//currentOpenings api
const currentOpeningsApp=require("./APIs/currentOpeningsApi")
app.use("/currentOpenings",currentOpeningsApp)

//event api
const eventApp=require("./APIs/eventApi")
app.use("/event",eventApp)

//list api
const listingApp=require("./APIs/listingApi")
app.use("/listing",listingApp)

//menu api
const menuApp=require("./APIs/menuApi")
app.use("/menu",menuApp)

//pages api
const pagesApp=require("./APIs/pagesApi")
app.use("/pages",pagesApp)

//product api
const productApp=require("./APIs/productApi")
app.use("/product",productApp)

//subscribedEmails api
const subscribedEmailApp=require("./APIs/subscribedEmailApi")
app.use("/subscribedEmails",subscribedEmailApp)

//user api
const userApp=require("./APIs/userApi")
app.use("/user",userApp)


//error handler middleware

app.use((err,req,res,next)=>{
    console.log("err obj in exoress error hanlder",err);
    res.send({message:err.message})
})