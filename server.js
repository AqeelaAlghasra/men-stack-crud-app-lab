// Here is where we import modules
// We begin by loading Express
const dotenv = require('dotenv').config()
require('./config/database.js')

const express = require('express');
const methodOverride = require("method-override"); // new
// const path = require("path");
const morgan = require('morgan');
const Blog =require('./models/blog.js');
const app = express();

// models 

// MIDDLEWARE

app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));
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
    res.render("blogs/edit.ejs", { blog: foundBlog });
});

app.put("/:blogId", async (req, res) => {
    
    const blogId = req.params.blogId;
    const updatedBlog = await Blog.findByIdAndUpdate(blogId,req.body);
    console.log('Updated')
    res.redirect(`/${blogId}`);
    // res.render("blogs/show.ejs",{blog: {updatedBlog}});
  });

app.get("/blogs/new",async(req, res) => {
  // res.send(req.body);
  res.render("blogs/new.ejs",{});
});

app.post("/", async (req, res) => {
  
    await Blog.create(req.body);
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