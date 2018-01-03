/**
 * Created by aasim on 24/09/16.
 */
var express = require('express');
var router = express.Router();
var DBService = require('../services/DBService');
var db = DBService.db;
var chatm = require('../models/chats');
var messagem = require('../models/message');
var docm = require('../models/doctors');
var appointm = require('../models/appointments');
var ambm = require('../models/ambulance');
/* GET admin listing. */
router.get('/', function(req, res, next) {
    res.send('Admin apis will be found here ');
});

router.post('/',function(req,res,next){
    res.send('Admin apis will be found here ');
});

router.post('/getChats',function (req,res,next){
    var chatc = db.get('chat');
    chatc.find({},"-messages",function (err,docs) {
        res.send(docs);
    });
});
router.post('/sendMessage',function(req,res,next) {
    var chat = messagem.create();
    chat.sender = "1";
    chat.text = req.body.text;
    chat.time = new Date().getTime();
    var chatc = db.get('chat');
    chatc.update({"userid": req.body.id}, {$push: {"messages": chat}}, function (err, docs) {
        if (err)
            res.send({"success": "0"});
        else
            res.send({"success": "1"});
    });
});

router.post('/createAmbulance',function(req,res,next)
{
    var ambulance=db.get('ambulance');
    var amb = ambm.create();
    amb.status='Idle';
    amb.lat='19.136326';
    amb.long='72.827660';
    amb.eta='0';
    amb.dispatched="Returned";
    ambulance.insert(amb,function(err,docs)
    {
        res.send({"success":"1",docs});
    });
});

router.post('/addDoctor',function(req,res,next)
{
    var doctor=db.get('doctor');
    var docc = docm.create();
    docc.name = req.body.name;
    docc.gender = req.body.gender;
    docc.daob = req.body.daob;
    docc.emailId=req.body.emailId;
    docc.degree=req.body.degree;
    docc.timein=req.body.timein;
    docc.timeouts=req.body.timeouts;
    docc.phoneNumber=req.body.phoneNumber;
    docc.speciality=req.body.speciality;
    doctor.insert(docc,function(err,docs)
    {
        res.send(docs);
    });
});

router.post('/verifyDoctor',function (req,res,next) {
      var doctorc = db.get('doctor');
      
      doctorc.findOne({"name":req.body.name,"emailId":req.body.emailId},function (err,docs) {
          if(docs == null){
              res.send({success:"1"});

          }
          else{
              
          }
      })
});

router.post('/dispatchAmbulance',function (req,res,next) {
      var ambc = db.get('ambulance');
      ambc.update({"_id":req.body.id},{"status":"Dispatched"},function (err,docs) {
          if(docs == null){
              res.send({success:"0"});

          }
          else{
              res.send({success:"1"});
          }
      })
});

router.post('/loginAdmin',function (req,res,next) {
    emailId = req.body.emailId;
    password = req.body.password;
    var adminc = db.get('admin');
    adminc.findOne({"emailId":emailId,"password":password}, function (err,docs) {
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
router.post('/returnAmbulance',function (req,res,next) {
      var ambc = db.get('ambulance');
      ambc.update({"_id":req.body.id},{"status":"Idle","lat":"19.136326","long":"72.827660"},function (err,docs) {
          if(docs == null){
              res.send({success:"0"});

          }
          else{
              res.send({success:"1"});
          }
      })
});

router.post('/getmessages',function (req,res,next){
    var chatc = db.get('chat');
    chatc.find({"userid":req.body.id},"messages",function (err,docs) {
        res.send(docs);
    });
});

router.post('/viewDoctor',function(req,res,next)
{
    var doctor=db.get('doctor');
    doctor.find({},function(err, docs){
        res.send(docs);

    });
});
router.post('/removeDoctor',function(req,res,next) {
    var doctor = db.get('doctor');
    var docc = docm.create();
    docc.id = req.body.id;
    doctor.remove({"_id": docc.id}, function (err, docs) {
        res.send({"success": "1"});
    });
});
router.post('/viewAppointment',function(req,res,next)
{
    var date = req.body.date;
    var appo=db.get('appointment');  
    appo.find({"date":date},function(err, docs){
        res.send(docs);

    });
});

router.post('/viewAmbulance',function(req,res,next)
{
    var ambu=db.get('ambulance');  
    ambu.find({},function(err, docs){
        res.send(docs);

    });
});
//collection.find({}, {"sort" : [['datefield', 'asc']]} ).toArray(function(err,docs) {});
//collection.find({}, {"sort" : [['datefield', 'asc']]}, function (err, docs) { ... });
module.exports = router;