var username;
var password;
var url = "http://hospitalnodespit.herokuapp.com/";
$( document ).ready(function(){
  $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
     $('.carousel.carousel-slider').carousel({full_width: true});
   console.log("getItem");
    if(localStorage.getItem("user")!=null)
  {
    window.location = "patlog.html";
  }
  console.log("Done");
})
function login(){
    console.log("login");
    username=document.getElementById("email").value;
    password=document.getElementById("password").value;
    console.log(username + " " + password);
  $.ajax({
              type:"POST",
              url:url+"users/loginUser",
              dataType:"json",
              data:{
                "username":username,
                "password":password
              },
              success:function(data){
                console.log(data.success);
                if(data.success==1) {
                   localStorage.setItem("user", data.id);
                    window.location = "patlog.html";
                   
                }         
}});
}



function reguser(){
  console.log("registeruser");
  //$("#erroapp").hide();
  //$("#doneapp").hide();
  var pass=document.getElementById('password').value;    
var name=document.getElementById('name').value;
var gender=document.getElementById('gender').value;
var contact=document.getElementById('phoneNumber').value;
var email=document.getElementById('emailId').value;
var add=document.getElementById('address').value;
var dob=document.getElementById('dob').value;
var bg=document.getElementById('bloodgrp').value;
var country=document.getElementById('country').value;
  $.ajax({
    type:"POST",
    url:url + "users/verifyUser",
    dataType:"json",
    data:{
      "name":name,
      "emailId":email    
    },
    success:function(data){
      console.log(data.success);
      if(data.success!= null && data.success==1) {
        $.ajax({
          type:"POST",
          url:url + "users/registerUser",
          dataType:"json",
          data:{
            "phoneNumber" : contact ,
            "pass":pass,
            "gender" : gender,
            "country" : country,
            "address":add,
            "dob":dob,
            "bloodgrp":bg
            },
          success:function(data){
            console.log(data.success);
            if(data.success!= null && data.success==1) {
              //alert("Appointment Created on "+date);
              //$("#doneapp").show();
              console.log("User added");
            }
            else{
              alert(data.error);

            }
          }});
      }
      else{
        //alert("TIme Slot Already Booked Please Check For Some Other TIme");
        console.log("User Exists");
        //$("#erroapp").show();
      }
    }});

//var age=do
}
