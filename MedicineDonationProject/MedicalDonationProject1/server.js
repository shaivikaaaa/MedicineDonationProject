var expresskuch=require("express");
var path=require("path");
var app=expresskuch();
try {
    app.listen(1917, function() {
        console.log("Server Started");
    });
} catch (error) {
    console.error("Failed to start the server:", error);
}



app.use(expresskuch.static("public"));
var mailer = require("nodemailer");

var fileuploader=require("express-fileupload");
app.use(fileuploader());
//var req = require( '/Users/shaivika/Desktop/web dev/MedicalDonationProject1/server.js');

var mysql=require("mysql2");

app.use(expresskuch.urlencoded({ extended: true }));


const { cwd } = require("process");
const { time } = require("console");


var dbConfiguration={
    host:"localhost",
    user:"root",
    password:"mamypokopants",
    database:"medicine_donation_project1",
}

var refDB;
refDB.connect(function(errKuch) {
    if (errKuch) {
        console.log("Database connection failed:", errKuch);
        process.exit(1); // Exit if the database connection fails
    } else {
        console.log("Connected to Server....");
    }
});



var transporter=mailer.createTransport({
  service:'gmail',
  auth: {
    user:'shaivika.anand@gmail.com',
    pass:'pxkiphkbuthvglhv',
  }
})    ;





// ----------------------------------------------------------------------------------
/* LINKING OF INDEX PAGE WITH OUR SERVER AND SENDING THE LOGIN OR THE SIGNUP DATA INTO SERVER*/

//  <!--  ------------------------------------------------------------------------------------- -->

app.get("/",function(req,resp){
    var path=process.cwd()+"/index.html";
    resp.sendFile(path);
})

//  <!--  ------------------------------------------------------------------------------------- -->

app.get("/savesignup",function(req,resp){
    var dataary=[req.query.signupemail,req.query.signuppwd,req.query.utype];
    refDB.query("insert into users values(?,?,?,1)",dataary,function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send("Data Inserted Successfully");

        var mailOptions={
            from:'shaivika.anand@gmail.com',
            to: req.query.signupemail,
          subject: 'Sending Email using Node.js',
          text: 'You have signed up successfully for the Medical Donation Portal!'
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });  
        
    })
})

app.get("/chklogin",function(req,resp){
    var ary=[req.query.loginemail,req.query.loginpwd];
    refDB.query("select * from users where email=? and pwd=? and status=1",ary,function(err,result)
    {
        if(err)
        resp.send(err);
    
    else
    resp.send(result);

    });
});

//  <!--  ------------------------------------------------------------------------------------- -->





app.get("/updatedpwd1",function(req,resp){
    var ary2=[req.query.txtemail,req.query.oldpwd];
    var aryupdate=[req.query.newpwd,req.query.txtemail];
    refDB.query("select * from users where email=? and pwd=?",ary2,function(err,result2){
        if(err)
        resp.send(err);
        else
        {
            if(result2.length==1)
            {
                refDB.query("Update users set pwd=? where email=?",aryupdate,function(err,result){
                    if(err)
                    resp.send(err);
                    else
                    {
                        resp.send("Password updated successfully");
                    }
                });
            }
            else
            resp.send("Invalid email or password");
        }
       
    })
});

app.get("/updatedpwd2",function(req,resp){
    var ary=[req.query.txtemail,req.query.oldpwd,req.query.newpwd];
    var aryupdatedonar=[req.query.newpwd,req.query.txtemail];
    refDB.query("select * from users where email=? and pwd=?",ary,function(err,result){
        if(err)
        resp.send(err);
        else
        {
            if(result.length==1)
            {
                refDB.query("Update users set pwd=? where email=?",aryupdatedonar,function(err,result){
                    if(err)
                    resp.send(err);
                    else
                    {
                        resp.send("Password updated successfully");
                    }
                })
            }
            else
            resp.send("Invalid email or password");

        }
        
    })
});


// <!--  ------------------------------------------------------------------------------------- -->

app.post("/needy",function(req,respk){
    console.log("Done 2");
    
    var time=  req.body.txtintime+" - " +req.body.txtouttime;
    console.log(time);
    var proofpicupload=req.files.proofpicn.name;
    var des=process.cwd()+"/public/uploads"+"  - "+req.body.txtemail;
    req.files.proofpicn.mv(des,function(err){
        if(err)
        console.log("Error saving the proofpic");
    })

    var profilepicupload=req.files.profilepicn.name;
    var des2=process.cwd()+"/public/uploads"+"  - " +req.body.txtemail;
    req.files.profilepicn.mv(des2,function(err){
        if(err)
        console.log("err saving profile pic");
    })
  
    aryneedy=[req.body.txtemail,req.body.txtname,req.body.txtnumber,req.body.txtaddress,req.body.txtcity,
        req.body.txtselectid,time,proofpicupload,profilepicupload];
              refDB.query("insert into nprofile values(?,?,?,?,?,?,?,?,?)",aryneedy,function(err,result){
                  if(err)
                  respk.send(err);
                  else
                  respk.send("Data saved successfully!");
  
              })
  })

app.post("/profile-process",function(req,resp)
{
    console.log("Done");
   var time=  req.body.txtintime+" - " +req.body.txtouttime;
    var proofpicupload=req.files.proofpic.name;
    var des=process.cwd()+"/pictures"+proofpicupload;
    req.files.proofpic.mv(des,function(err){
        if(err)
        console.log("Error saving the proofpic");
    })

    var profilepicupload=req.files.profilepic.name;
    var des2=process.cwd()+"/pictures"+profilepicupload;
    req.files.profilepic.mv(des2,function(err){
        if(err)
        console.log("err saving profile pic");
    })



        arydonar=[req.body.txtemail,req.body.txtname,req.body.txtnumber,req.body.txtaddress,
        req.body.txtcity,req.body.txtselectid,time,proofpicupload,profilepicupload];
        refDB.query("Insert into dprofile values(?,?,?,?,?,?,?,? ,?)",arydonar,function(err,result){
            if(err)
            resp.send(err);
            else
            resp.send("Data Saved Successfully");
        })
})

//  <!--  ------------------------------------------------------------------------------------- -->



app.post("/medicine-process",function(req,resp){
    console.log("Done 3");

    var medpicture=req.files.medpic.name;
  var des2=process.cwd()+"/public/pictures"+"  - " +req.body.txtemail;
  req.files.medpic.mv(des2,function(err){
      if(err)
      console.log("err saving profile pic");
  })



    arymed=[req.body.txtemail,req.body.txtmedname,req.body.packingtype,req.body.txtquantity,
        req.body.txtdate,req.body.txtcompany,medpicture,req.body.txtdesc];
        refDB.query("insert into medicines values(?,?,?,?,?,?,?,?)",arymed,function(err,result){
            if(err)
            respk.send(err);
            else
            resp.send("Data saved successfully!");

        })
})

//  <!--  ------------------------------------------------------------------------------------- -->

// app.get("/profile-delete-angular",function(req,resp){
//     refDB.query("delete from profile where email=?",[req.query.email])
// })

// <!--  ------------------------------------------------------------------------------------- -->

app.all("/fetchAllRecords",function(req,resp){
    refDB.query("select * from users ",function(err,resultAryofObjects){
        if(err)
        resp.send(err);
        else
        resp.send(resultAryofObjects);
    })
})
// <!--  ------------------------------------------------------------------------------------- -->
app.get("/user-block-angular",function(req,resp){
    refDB.query("update users  set status=0 where email=?",[req.query.emailidx], function(err,result){
        if(err)
        resp.send(err);
        else
        if(result.affectedRows==0)
        resp.send("Invalid email");
        else
        resp.send("work done");
    })
})


// <!--  ------------------------------------------------------------------------------------- -->


app.get("/user-unblock-angular",function(req,resp){
    refDB.query("update users  set status=1 where email=?",[req.query.emailidx], function(err,result){
        if(err)
        resp.send(err);
        else
        if(result.affectedRows==0)
        resp.send("Invalid email");
        else
        resp.send("work done");
    })
})
// <!--  ------------------------------------------------------------------------------------- -->

app.all("/fetchdonars",function(req,resp){
    refDB.query("select * from dprofile ",function(err,donarResultary){
        if(err)
        resp.send(err);
        else
        resp.send(donarResultary);

    });
})

// <!--  ------------------------------------------------------------------------------------- -->

app.all("/fetchneedy",function(req,resp){
    refDB.query("select * from nprofile ",function(err,needyResultary){
        if(err)
        resp.send(err);
        else
        resp.send(needyResultary);

    });
})

// <!--  ------------------------------------------------------------------------------------- -->

app.get("/fetchAllCity",function(req,resp){
    refDB.query("select distinct city from  dprofile",function(err,resultCityAry)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultCityAry);
    });
})
// / <!--  ------------------------------------------------------------------------------------- -->
app.all("/fetchAllMed",function(req,resp){
    refDB.query("select distinct medicine from  medicines",function(err,resultMedAry)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultMedAry);
    });
})

// -------------------------------------------------------------------------------------

app.all("/seekdonars",function(req,res){
   
   refDB.query("select distinct medicine from medicines,dprofile where medicines.emailid=dprofile.emailid and dprofile.city=?",[req.query.city],function(err,resultmed){
    // refDB.query("select distinct medicine from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=?",[req.query.city],function(err,resultmed){
       console.log(req.query.city);
        // console.log(resultmed);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultmed);
            res.send(resultmed);
        }
    });
})