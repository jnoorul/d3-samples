var express = require("express");
var app = express();

app.use(express.static("./"));

app.get("",function () {

});

app.listen("8080",function(err){
    console.log("server started on port 8080");
});


