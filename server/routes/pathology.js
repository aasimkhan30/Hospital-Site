/**
 * Created by aasim on 24/09/16.
 */
var express = require('express');
var app = express();
var router = express.Router();
var db = require('../services/DBService');
var DBService = require('../services/DBService');
var db = DBService.db;
var pathom = require('../models/pathology');
var reportm = require('../models/reports');

var multer  = require('multer');
var upload = multer({ dest: './routes/uploads/'}).single('file');


/* GET admin listing. */
router.get('/pathLogin', function(req, res, next) {
    res.send('Pathology apis will be found here ');
});

router.get('/',function(req,res,next){
    res.send('Pathology api will be found here ');
});

router.post('/uploadReports',function (req,res,next) {



    upload(req, res, function (err) {
        if (err) {
            console.log(req.file);
            console.log(err);
            return;
        }
        else{

            var report = reportm.create();
          report.emailId=req.body.emailId;
            report.name=req.body.name;
            report.url=req.file.filename;
            report.date=new Date();
            //console.log("Name:"+userRequest.name);
            var reportc=db.get('report');
            reportc.insert(
                report
            , function (err, result) {
                if (err) {
                    res.status(500).send("There was a problem adding the information to the database.");
                }
                else {
                    console.log("Entry added");
                    res.status(201).send({"id" : result._id});
                }
            });
          console.log(req.file.filename);
            console.log(req.body.name);
            console.log(req.body.emailId);
            /*console.log(req.body);
             console.log(req.file.filename);*/
        }
    });

});


router.post('/loginPathology',function (req,res,next) {
    username = req.body.username;
    password = req.body.password;
    var pathoc = db.get('pathology');
    pathoc.findOne({"username":username,"password":password}, function (err,docs) {
        console.log(docs);
        if(docs == null)
        {
            console.log("Didnt get");
            res.send({success:"0"});
        }
        else
        {
            console.log("GOT");
            res.send({success:"1",id:docs._id});
        }
        
    })
    
});


router.post('/searchPatients',function(req,res,next){
     console.log("Searching Patients");
     var login = db.get('user');
     var email =".*"+req.body.emailId+".*";
     login.find({"emailId":{$regex: email}},'emailId',function (err,docs) {
         if(err)
             res.send(err);
         else {
             console.log(docs);
             res.send(docs);
         }
     });
});

router.post('/searchPatients',function(req,res,next){
    console.log("Searching Patients");
    var login = db.get('user');
    var email =".*"+req.body.emailId+".*";
    login.find({"emailId":{$regex: email}},'emailId',function (err,docs) {
        if(err)
            res.send(err);
        else {
            console.log(docs);
            res.send(docs);
        }
    });
});
router.post('/verifyPatients',function(req,res,next){
    console.log("Searching Patients");
    var login = db.get('user');
    var email =req.body.emailId;
    login.findOne({"emailId":email},function (err,docs) {
           if(docs==null)
           {
               res.send({"success":0});
           }
            else
           {

               res.send({"success":1});
           }

    });
});
router.get('/getPatients',function(req,res,next){
    var login = db.get('user');
    login.find({},'emailId name',function (err,docs) {
        if(err)
            res.send(err);
        else {
            console.log(docs);
            res.send(docs);
        }
    });
});

module.exports = router;
