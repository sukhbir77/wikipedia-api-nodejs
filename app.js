const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

const article1 = new Article({
  title: "NO NAME",
  content: "This is a article about a man named No Name. Very Dangerous person."
});

//article1.save();
app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
      if(!err){
      res.send(foundArticles);
      }
      else{res.send(err);}
    });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){res.send("Successfully added new article.");}
    else{res.send(err);}
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){res.send("All articles are deleted successfully");}
    else{res.send(err);}
  });
});

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

app.route("/articles/:articleName")

.get(function(req, res){
  Article.findOne({title: req.params.articleName}, function(err, foundArticle){
    if(foundArticle){res.send(foundArticle);}
    else{res.send("No Article Found");}
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleName},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){res.send("Successfully Updated Article");}
    }
  );
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleName},
    {$set: req.body},
    function(err){
      if(!err){res.send("Successfully Updated Article");}
    }
  );
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleName}, function(err){
    if(!err){res.send("Article deleted successfully");}
    else{res.send(err);}
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
