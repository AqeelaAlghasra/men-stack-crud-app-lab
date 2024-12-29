// Here is where we import modules
// We begin by loading Express
const dotenv = require('dotenv').config()
require('./config/database.js')
const multer = require("multer");
const express = require('express');
const fs = require("fs");
const methodOverride = require("method-override"); // new
const path = require("path");
const morgan = require('morgan');
const Blog =require('./models/blog.js');
const app = express();
let imageName=''
const storage = multer.diskStorage({
  destination: (req, file,callback)=>{
    callback(null, __dirname + '/public/images');
  },
  filename: (req,file,callback)=>{
    console.log(file.originalname);
    // const filename = `file_${crypto.randomUUID()}`
    const filename = (file.originalname).replaceAll(/\s/g,'');
    imageName=filename
    callback(null, filename)
  }
})
const upload = multer({
  storage:storage,
  limits: {
    fileSize: 1048576*5, //1 MB
  },
})

// models 

// MIDDLEWARE

app.use(methodOverride("_method"));
app.use(express.static("public"));

//app.use(express.static(path.join(__dirname, "public")));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
// ROUTES

// All Blogs
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find();
  res.render("index.ejs", {blogs: allBlogs});
});


//Get blog

app.get("/:blogId", async (req,res)=>{
    const foundBlog = await Blog.findById(req.params.blogId);
    res.render("blogs/show.ejs", { blog: foundBlog });
});
app.get("/:blogId/edit", async (req,res)=>{
    
    const foundBlog = await Blog.findById(req.params.blogId);
    res.render("blogs/edit.ejs", { blog: foundBlog});
});

app.put("/:blogId",upload.any(),async (req, res) => {
    console.log(req.body, req.params)
    const blogId = req.params.blogId;
    const imageName = (req.files[0].originalname).replaceAll(/\s/g,'');
    req.body.image=imageName;
    
    const updatedBlog = await Blog.findByIdAndUpdate(blogId,req.body);
    console.log('Updated',res)
    // res.redirect(`/${blogId}`);
    res.render("blogs/show.ejs",{blog: {updatedBlog}});
  });

app.get("/blogs/new",async(req, res) => {
  // res.send(req.body);
  res.render("blogs/new.ejs",{});
});

app.post("/",upload.any(),async (req, res) => {
  
  const imageName = (req.files[0].originalname).replaceAll(/\s/g,'');
  req.body.image=imageName;
  await Blog.create(req.body);
  //console.log(req.files, req.body)
  res.redirect("/");
    
});
  
app.delete("/:blogId", async (req,res)=>{
    
    const foundblog = await Blog.findByIdAndDelete(req.params.blogId);
    res.redirect("/");
    

})





// server.js

// POST /fruits



app.listen(3000, () => {
  console.log('Listening on port 3000');
});