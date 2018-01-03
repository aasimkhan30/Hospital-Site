/**
 * Created by aasim on 04/10/16.
 */
function login(){
    console.log("login");
    email=document.getElementById("emailId").value;
    password=document.getElementById("password").value;
    //console.log(username + " " + password);
    $.ajax({
        type:"POST",
        url:"http://localhost:3000/admin/loginAdmin",
        dataType:"json",
        data:{
            "emailId":email,
            "password":password
        },
        success:function(data){
            console.log(data.success);
            if(data.success==1) {
                localStorage.setItem("admin", data.id);
                window.location = "admin1.html";

            }
        }});
}
$( document ).ready(function(){
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
    $('.carousel.carousel-slider').carousel({full_width: true});
    console.log("Everything Ready");
    $('select').material_select();
    if(localStorage.getItem("admin")!=null)
    {
        window.location = "admin1.html";
    }
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 ,// Creates a dropdown of 15 years to control year
        format: 'dd-mm-yyyy'
    });
})