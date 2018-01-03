var express = require('express');
var router = express.Router();
var db = require('../services/DBService');
var DBService = require('../services/DBService');
var db = DBService.db;
var userm = require('../models/user');
var chatm = require('../models/chats');
var messagem = require('../models/message');
var ambulancem = require('../models/ambulance');
var appointmentm = require('../models/appointments');
var path = require('path');
var mime = require('mime');
var mailer = require('../services/EmailService');
/* GET users listing. */


router.get('/', function(req, res, next) {
  res.send('User apis will be found here');
});


router.post('/',function(req,res,next){
  res.send('User api will be found here ');
});


router.post('/loginUser',function (req,res,next) {
  email = req.body.username;
  password = req.body.password;
  var userc = db.get('user');
  userc.findOne({"emailId":email,"password":password}, function (err,docs) {
    console.log(docs);
    if(docs == null)
    {
      console.log("Didnt get");
      res.send({success:"0",error:"Wrong User Name or Password"});
    }
    else
    {
      console.log("GOT");
      if(docs.verified=="0")
          res.send({success:"0",error:"Verify Email Id First"})
      else
        res.send({success:"1",id:docs._id});
    }

  })

});


router.post('/registerUser' , function (req,res,next){
  console.log("Registing User");
  var user = userm.create();
  user.name = req.body.name;
  user.emailId = req.body.emailId;
  user.phoneNumber = req.body.phoneNumber;
  user.password = req.body.password;
  user.address= req.body.address;
  user.dob= req.body.dob;
  user.gender= req.body.gender;
  user.bloodgrp=req.body.bloodgrp;
  user.country=req.body.country;
  user.verified="0";
  var userc = db.get('user');
  userc.insert(user,function (err,docs) {
    if(err)
    {
      res.send({success:"0"});
    }
    else {
      console.log(docs);
      mailer.sendVerifyMail(docs);
      res.send({success: "1"});
    }
  });
});


router.post('/createAppointment', function (req,res,next){
  console.log("Creating Appointment");
  var appointment = appointmentm.create();
  appointment.name=req.body.name;
  appointment.emailId = req.body.emailId;
  appointment.phoneNumber = req.body.phoneNumber;
  appointment.age = req.body.age;
  appointment.gender= req.body.gender;
  appointment.country = req.body.country;
  appointment.date = req.body.date;
  appointment.hours=req.body.hours;
  appointment.mins=req.body.mins;
  appointment.speciality=req.body.speciality;
  appointment.doctor=req.body.doctor;
  appointment.verified = req.body.verified;
  var appointc = db.get('appointment');
  appointc.insert(appointment,function (err,docs) {
    if(err)
      res.send(err);
    else {
      res.send(docs);
      mailer.appointmentMail(docs);
    }

  });

});


router.post('/searchDoctors',function (req,res,next){
  console.log("Searching Doctors");
  speciality=req.body.speciality;
  doctor=req.body.doctor;
  if(doctor==null)
  {
    var doctorc=db.get('doctor');
    doctorc.find({"speciality":speciality},function(err,docs){
      res.send(docs);
    });
  }
  else
  {
    var doctorc=db.get('doctor');
    doctorc.find({"speciality":speciality,"name":doctor},function(err,docs){
      res.send(docs);
    })
  }

});


router.post('/bookAmbulance',function (req,res,next){
  var ambulance = ambulancem.create();
  var ambulancec = db.get('ambulance');
  ambulancec.findOne({"status":"Idle"},function (err,docs) {
    if(docs == null)
      res.send({success:"0",message:"No Ambulance Available Please Try Again After Some Time"});
    else {
      var temp = docs;
      temp.status = "Booked";
      temp.lat = req.body.lat;
      temp.long = req.body.lng;
      temp.address = req.body.address;
      temp.eta = req.body.eta;
      ambulancec.update({"_id": docs._id}, {
        "status": temp.status,
        "lat": temp.lat,
        "long": temp.lng,
        "address": temp.address,
        "eta": temp.eta
      }, function (err, docs) {
        res.send(temp);
      });
    }
  });
});

router.post('/getAppointments',function (req,res,next) {
  console.log("Getting Appointments");
  emailId=req.body.emailId;
  var appointc = db.get('appointment');
  appointc.find({"emailId":emailId},function (err,docs) {
    res.send(docs);
  });
});


router.post('/getReports',function (req,res,next) {
  console.log("Getting Reports");
  emailId=req.body.emailId;
  var appointc = db.get('reports');
  appointc.find({"emailId":emailId},function (err,docs) {
    res.send(docs);
  });
});

router.post('/verifyAppointments',function (req,res,next) {
  var appointc = db.get('appointment');
  appointc.findOne({"hours":req.body.hours,"mins":req.body.mins,"doctor":req.body.doctor,"speciality":req.body.speciality,"date":req.body.date},function (err,docs) {
    if(docs == null){
      res.send({success:"1"});

    }
    else{
      res.send({success:"0"});
    }
  })
});

router.post('/cancelAppointments',function (req,res,next) {
  var appointc = db.get('appointment');
  appointc.remove({"_id":req.body.id,"date":req.body.date},function (err,docs) {
    if(docs == null){
      res.send({success:"1"});

    }
    else{
      res.send({success:"0"});
    }
  })
});

router.post('/viewReports',function (req,res,next){
  console.log("Viewing Reports");
  emailId=req.body.emailId;
  var reportc = db.get('report');
  reportc.find({"emailId":emailId},function (err,docs) {
    res.send(docs);
  });

});


router.post('/checkEmail',function (req,res,next){
  console.log("Checking Existing Emails");
  var userc = db.get('user');

  userc.findOne({"emailId":req.body.emailId},function (err,docs) {
    if(docs == null){
      res.send({success:"1"});
    }
    else{
      res.send({success:"0"});
    }
  }) ;
});

router.post('/createChat',function (req,res,next) {
  var chat = chatm.create();
  chat.userid = req.body.id;
  chat.messages = [];
  chat.emailId = req.body.emailId;
  var chatc = db.get('chat');
  chatc.insert(chat,function (err,docs) {
    if(err)
      res.send({"success":"0"});
    else
      res.send({"success":"1"});
  });
});
router.post('/sendMessage',function(req,res,next){
  var chat = messagem.create();
  chat.sender = req.body.id;
  chat.text = req.body.text;
  chat.time = new Date().getTime();
  var chatc = db.get('chat');
  chatc.update({"userid":req.body.id},{$push : {"messages":chat}},function (err,docs) {
    if(err)
      res.send({"success":"0"});
    else
      res.send({"success":"1"});
  });


});
router.post('/getchats',function (req,res,next) {

  var chatc = db.get('chat');
  chatc.find({"userid":req.body.id},"messages",function (err,docs) {
    res.send(docs);
  });
});

router.post('/loadUser',function (req,res,next) {
  var userc = db.get('user');
  userc.find({"_id":req.body.id},function(err,docs){
    res.send(docs);
  });

});

router.post('/verifyUser',function (req,res,next) {
  var userc = db.get('user');
  userc.findOne({"name":req.body.name,"emailId":req.body.emailId},function (err,docs) {
    if(docs == null){
      res.send({success:"1"});

    }
    else{
      res.send({success:"0"});
    }
  })
});

router.get('/verify',function (req,res) {
  var id=req.query.id;
  var userc = db.get('user');
  userc.update({"_id":id},{$set :{"verified": "1"}});
      res.send(
        "<html>"+"<body>"+
            "<H3>User Verified </H3><br>"
        +"<h1><a href= 'http://hospitalspit.esy.es/login.html'>LOGIN</a></h1>"+"</body>"+"</html>"
      );
});
router.get('/download', function(req, res){

  var file = __dirname + '/uploads/'+req.query.file;
  console.log(__dirname + '/uploads/'+req.query.file);
  var d = new Date(date || Date.now()),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  var date= [month, day, year].join('/');

  res.download(file,'Report'+date+".pdf"); // Set disposition and send it.
});

module.exports = router;
