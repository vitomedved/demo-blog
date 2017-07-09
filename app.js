var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
//initial config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//restful routes
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, blog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: blog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: blog});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if(err){
            res.redirect("/");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started...");
});