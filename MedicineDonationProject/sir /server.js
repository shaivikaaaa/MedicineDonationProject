//npm init -y
//npm install express -s

const { urlencoded } = require("express");
var expressKuch=require("express");
var path=require("path");
var app=expressKuch();
//         port   behavior
app.listen(2004,function(){
    console.log("Server Started");
})

//api- url handler
app.get("/hello",function(reqKuch,respKuch){
    respKuch.send("Hi Bro/Sis");
    console.log("************");
})
    app.get("/info",function(reqKuch,resp){
    //resp.send(__filename); //can send sinle line only
    
    resp.contentType("text/html");
    resp.write("<b>"+__filename+"<br>"); //writing to client screen
    resp.write("<marquee><b>"+__dirname+"<br></marquee>");
    resp.end();
});
app.get("/",function(req,resp)
{
    //resp.send("Its Home Page");

    var puraPath=process.cwd()+"/public/index.html";

    //global object : process
    resp.sendFile(puraPath);
});
app.get("/signup-process",function(req,resp){
    //resp.send("Welcome");
    console.log(req.query.txtEmail+"   "+req.query.txtPwd);
    resp.send("<h1>You Are signed up successfullyyyy : Mr./Ms."+req.query.txtEmail+"<h1>");
});
app.get("/signup",function(req,resp)
{
    var puraPath=process.cwd()+"/public/signup.html";
    resp.sendFile(puraPath);
});
app.get("/secure-signup",function(req,resp)
{
    var puraPath=process.cwd()+"/public/signup-secure.html";
    resp.sendFile(puraPath);
});



app.use(expressKuch.urlencoded('extended:true'));//converts binary to object
app.post("/secure-signup-process",function(req,resp){
    console.log(req.body);
    console.log(req.body.txtEmail+"  "+req.body.txtPwd);
    resp.send(req.body.txtEmail+"  "+req.body.txtPwd);
})

//__dirname==process.cwd()
app.get("/login",function(req,resp){
    var fullPath=path.join(__dirname,"public","login.html");
    resp.sendFile(fullPath);
});

app.get("/profile",function(req,resp){
    var fullPath=path.join(__dirname,"public","profile-page.html");
    resp.sendFile(fullPath);
})
/*
app.get("/profile-process",function(req,resp){
    resp.send(req.query);
    console.log(req.query.txtEmail);
    console.log(req.query.txtAddr);
    console.log(req.query.state);


    var techs="";
    if(req.query.techJava!=undefined)
       {
           techs=req.query.techJava+",";
        console.log(req.query.techJava);
       } 
    else
    console.log("No Java");

    if(req.query.techWeb)
    {
        console.log(req.query.techWeb);
        techs+=req.query.techWeb;
    }
    else
    console.log("NO Web");

    console.log("Store in Data base="+techs);
    //======================
   //do radio ur self

})
*/

app.post("/profile-process",function(req,resp){
    resp.send(req.body);
    console.log(req.body.txtEmail);
    console.log(req.body.txtAddr);
    console.log(req.body.state);

    var techs="";
    if(req.body.techJava!=undefined)
       {
           techs=req.body.techJava+",";
        console.log(req.body.techJava);
       } 
    else
    console.log("No Java");

    if(req.body.techWeb)
    {
        console.log(req.body.techWeb);
        techs+=req.body.techWeb;
    }
    else
    console.log("NO Web");

    console.log("Store in Data base="+techs);
    //======================
   //do radio ur self

})


