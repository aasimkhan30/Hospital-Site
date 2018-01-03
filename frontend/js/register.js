/**
 * Created by aasim on 01/10/16.
 */
var url = "http://localhost:3000/";
$( document ).ready(function(){
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
    $('.carousel.carousel-slider').carousel({full_width: true});
    console.log("Everything Ready");
    $('select').material_select();
    $("#docttabc").hide();
    $("#erroapp").hide();
    $("#doneapp").hide();
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 100 ,// Creates a dropdown of 15 years to control year
        format: 'dd/mm/yyyy'
    });

})


function registerUser(){
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var gender = $("#gender option:selected").text();
    var password = document.getElementById("password");
    var date = document.getElementById("date");
    var blood = $("#bloodgrp option:selected").text();
    var address = document.getElementById("address");
    var country = document.getElementById("country");


                $.ajax({
                    type:"POST",
                    url:url + "users/registerUser",
                    dataType:"json",
                    data:{
                        "name" :name,
                        "emailId" : email,
                        "phoneNumber" : phone ,
                        "dob" : date,
                        "gender" : gender,
                        "country" : country,
                        "password" : password,
                        "address" : address,
                        "bloodgrp" : blood
                    },
                    success:function(data){
                        console.log(data.success);
                        if(data.success!= null && data.success==1) {
                            //alert("Appointment Created on "+date);
                            $("#doneapp").show();
                        }
                        else{
                            alert(data.error);

                        }
                    }});

}