//npm init -y
//npm install express -s

const { query } = require("express");
var expressKuch=require("express");
var path=require("path");
var app=expressKuch();
var mysql=require("mysql2");
var fileuploader=require("express-fileupload");
app.use(expressKuch.urlencoded('extended:true'));/*converts binary to object as data in "post"gets saved
in binary format*/
app.use(fileuploader());
var req = require( '/Users/shaivika/Desktop/web dev/mynodejs/server.js');


//         port   behavior - port ke number se hii pata chlta hai sysytem ko ki yeh kholo server
//it can be any number and any number of digits
app.listen(2003,function(){
    console.log("Server Started");
})

//FOR CONNECTING THE SERVER TO OUR MYSQL DATABASE

//var mysql=require("mysql");

var dbConfiguration={
    host:"localhost",//fixed
    user:"root",//pwd
    password:"mamypokopants", //""
    database:"trainees" //ur own database name 
}

var refDB=mysql.createConnection(dbConfiguration);
refDB.connect(function(errKuch)
{
    if(errKuch)
        console.log(errKuch);
    else
        console.log("Connected to Server....");
})



//ABOVE ALL NEEDS TO BE WRITTEN IN GENERAL CODE
//----------------------------------------------------------------------------------------

//api- url handler
app.get("/hi",function(reqKuch,respKuch){
    respKuch.send("Hi Bro/Sis");
    console.log("************");
})

//----------------------------------------------------------------------------------------
    app.get("/info",function(reqKuch,resp){
    //resp.send(__filename); //can send sinle line only
    
    resp.contentType("text/html");
    resp.write("<b>"+__filename+"<br>"); //writing to client screen
    resp.write("<marquee><b>"+__dirname+"<br></marquee>");
    resp.end();
})

//----------------------------------------------------------------------------------------

app.get("/shaivika",function(reqkuch,respkuch){
    respkuch.send("Hello shaivi, how are you");
    console.log("Task completed");
})

//----------------------------------------------------------------------------------------

app.get("/", function(req,resp){
    var path_home=process.cwd()+"/public/index.html";
    resp.sendFile(path_home);
})

//----------------------------------------------------------------------------------------

app.get("/signup",function(req,resp){
    var purapath=process.cwd()+"/public/signup.html";
    console.log(purapath);
    resp.sendFile(purapath);
    

    /*whenever we are sending a file then we have to specify the file name which is /signup here 
    but when we want to show a message to our user related to it then we need to mention the name 
    of { where we mentioned form= action wala} name like /signup-process below*/

 })

 app.get("/signup-process",function(req,resp){
    resp.send("Details Saved");
    console.log(req.query.txtEmail+" ",req.query.txtPwd);

    /*due to the last line i.e.req.query.txtEmail+" ",req.query.txtPwd our email and password
    which was typed by the user are reaching shown in our server too.
    now as we can observe that the email n pswd are also shown above i.e when we are running our server then
    uppr voh aarha hai likha localhost ke side prr which means that there is a breach in our sercurity
    now in order to overcome this breach we set our method as POST instead of get
    as shown below -after login wala part*/
    
 })
 //----------------------------------------------------------------------------------------

 app.get("/login",function(req,resp){
    var path_login=path.join(__dirname,"public","login.html");
    resp.sendFile(path_login);

    //Another way to get the path of the file

 })
 app.get("/login-process",function(req,resp){
    resp.send("Details Saved");
    console.log(req.query.txtEmail+" ",req.query.txtPwd);
 })

 //--------------------------------------------------------------------------------------------

app.get("/secure-signup",function(req,resp){

    var path_secure_signup=process.cwd()+"/public/secure-signup.html";
    console.log(path_secure_signup);
    resp.sendFile(path_secure_signup);
    /* secure signup wale page prr method ko "post" kra va hai 
    by default it is always "get"*/
})

   
    app.post("/secure-signup-process",function(req,resp){
    console.log(req.body);// observe that data here is stored in {name:value, key:value}
    console.log(req.body.txtEmail+ "  " + req.body.txtPwd);
    resp.send(req.body.txtEmail+ "  " + req.body.txtPwd);
    //IMPORTANT- you can only use 1 (res.send )in a single function

})

//------------------------------------------------------------------------------------------------------

app.get("/profile-pic-sir",function(req,resp){
    var path=process.cwd()+"/public/profile-pic-sir.html"
    resp.sendFile(path);
    console.log("All done");
})

//------------------------------------------------------------------------------------------------------------------------

/*
app.use(fileuploader());
 app.post("/profile-process1",function(req,resp){
    resp.send(req.body);
    console.log("********************");
    console.log(req.body.txtAddr);
   
})
*/

app.post("/profile-process1",function(req,resp)
{
    console.log(req.files.profilePic.name);
    var fname=req.body.txtEmail+"-"+req.files.profilePic.name;
    var des=process.cwd()+"/public/uploads/"+fname;
    req.files.profilePic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
   })
    console.log("------------------------------------");
/* Checkbox can have multiple options i.e a user might select one optn or no optn or both the optn as their 
know technologies henceforth we will look into it */

var techs="";
if(req.body.techJava!=undefined)
{
    techs=req.body.techJava+",";
    console.log(req.body.techJava);
}
else
console.log("No Java");

if(req.body.techWeb!=undefined)
{
    techs+=req.body.techWeb;
    console.log(req.body.techWeb);
}
else
console.log("No Web");

var dataAry=[req.body.txtEmail,req.body.txtAddr,req.body.state,techs,req.body.branch,fname];
refDB.query("insert into profile values(?,?,?,?,?,?)",dataAry,function(err,result){
    if(err)
    resp.send(err);
    else
    resp.send("Data Inserted");
})
})

//deleting an entry/portfolio

app.post("/profile-delete",function(req,resp){
    refDB.query("delete from profile where email=?",[req.body.txtEmail],function(err,result){
        if(err)
        resp.send(err);

        if(result.affectedRows==0)
        /* affectedrows=0 means :-If the values are the same, MySQL will not
         update the row (without triggering any warning or error), so the affected row count will be 0.*/
            resp.send("Invalid Id");
            else
                resp.send("Record Deleted Successfulllllyyyyy.... Badhaiiiii");
    })

})

//AJAX

app.get("/chkEmail",function(req,resp){
    refDB.query("select * from profile where email=?",[req.query.txtEmail],function(err,resultAryOfObjects){
        if(err)
        resp.send(err);
        else
        {
            if(resultAryOfObjects.length==0)
            {
                resp.send("Available");
            }

            else
            resp.send("Already Occupied");
        }
    })
})

//----------------------------------------------------------------------------------------------------------------------------------


