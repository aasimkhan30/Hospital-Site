var username;
var password;
var url = "localhost:3000/";
$( document ).ready(function(){
  $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
     $('.carousel.carousel-slider').carousel({full_width: true});
   console.log("getItem");
    if(localStorage.getItem("pathology")!=null)
  {
    window.location = "patdash.html";
  }
    console.log(url +"pathology/getPatients");
  
})
function login(){
    console.log("login");
    username=document.getElementById("username").value;
    password=document.getElementById("password").value;
   // console.log(username + " " + password);
  $.ajax({
              type:"POST",
              url:url+"pathology/loginPathology",
              dataType:"json",
              data:{
                "username":username,
                "password":password
              },
              success:function(data){
                console.log(data.success);
                if(data.success==1) {
                   localStorage.setItem("pathology", data.id);
                    window.location = "patdash.html";
                   
                }         
}});
}


