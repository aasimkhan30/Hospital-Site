var username;
var password;
var url = "http://localhost:3000/";

function logout(){
  localStorage.removeItem("user");
   window.location = "index.html";
}

$(document).ready(function(){
    $("#erroapp").hide();
    $("#doneapp").hide();
    $("#contentload").hide();
  if(localStorage.getItem("user") == null){
      window.location = "login.html";
  }
        $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: false // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
         $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 ,// Creates a dropdown of 15 years to control year
             format: 'dd-mm-yyyy'
  });
        
      loadUser();
     });


function loadUser(){
  var id = localStorage.getItem("user");
   $.ajax({

              type:"POST",
              url:url+"users/loadUser",
              dataType:"json",
              data:{
                "id":localStorage.getItem("user")
              },
              success:function(data){
               if(data != null){
                loadAppointments(data[0].emailId);
                loadReports(data[0].emailId);
                $('#email').text(data[0].emailId);
                $('#username').text(data[0].name);
                $('#phone').text("Phone: "+data[0].phoneNumber);
                $('#dob').text("Date of Birth: "+data[0].dob);
                   $('#')
                $('#blood').text("Blood Grp: "+data[0].bloodgrp);
                $('#country').text("Country: "+data[0].country);

               }
}});

}

function createAppointment(){
    $("#erroapp").hide();
    $("#doneapp").hide();
    console.log("create appoint");
    var id = localStorage.getItem("user");
    var date=document.getElementById('date').value;
    var hours=document.getElementById('hours').value;
    var  mins=document.getElementById('mins').value;
    var speciality=document.getElementById('speciality').value;
    var doctor=document.getElementById('doctorlist').value;
    $.ajax({

        type:"POST",
        url:url+"users/loadUser",
        dataType:"json",
        data:{
            "id":localStorage.getItem("user")
        },
        success:function(data){
            if(data != null){
                var name = data[0].name;
               var email = data[0].emailId;
                var contact = data[0].phoneNumber;
                var age = data[0].dob;
                var gender = data[0].gender;
                var country= data[0].country;

                $.ajax({
                    type:"POST",
                    url:url + "users/verifyAppointments",
                    dataType:"json",
                    data:{
                        "date" : date,
                        "hours" : hours,
                        "mins" : mins,
                        "speciality" : speciality,
                        "doctor" : doctor
                    },
                    success:function(data){
                        console.log(data.success);
                        if(data.success!= null && data.success==1) {
                            $.ajax({
                                type:"POST",
                                url:url + "users/createAppointment",
                                dataType:"json",
                                data:{
                                    "name" :name,
                                    "emailId" : email,
                                    "phoneNumber" : contact ,
                                    "age" : age,
                                    "gender" : gender,
                                    "country" : country,
                                    "date" : date,
                                    "hours" : hours,
                                    "mins" : mins,
                                    "speciality" : speciality,
                                    "doctor" : doctor
                                },
                                success:function(data){
                                    console.log(data.success);
                                    if(data!=null) {
                                        console.log(data);
                                        //alert("Appointment Created on "+date);
                                        $("#doneapp").show();
                                        $('#patappoint').append(
                                            " <tr id='" +data._id+ "'>"
                                            +"<td>" +data.doctor+ "</td>"
                                            +"<td>" +data.speciality+ "</td>"
                                            +"<td>" +data.date+ "</td>"
                                            +"<td><a class='btn' onclick='cancelAppointment(\""+data._id+"\", \""+data.date+"\")'>Cancel This Appointment</a>"
                                            +"</tr>"
                                        );
                                    }
                                    else{
                                        alert("No Appointment");

                                    }
                                }});
                        }
                        else{
                            //alert("TIme Slot Already Booked Please Check For Some Other TIme");
                            $("#erroapp").show();
                        }
                    }});
            }
        }});


}



function loadReports(email){
    console.log(email);
    $.ajax({

        type:"POST",
        url:url+"users/getReports",
        dataType:"json",
        data:{
            "emailId":email
        },
        success:function(data){
            if(data != null){
                for(i=0;i<data.length;i++){
                    console.log(data[i]);
                    $('#reports').append(
                        " <tr id='" +data[i]._id+ "'>"
                        +"<td>" +data[i].emailId+ "</td>"
                        +"<td>" +data[i].reportcat+ "</td>"
                        +"<td>" +data[i].date+ "</td>"
                        +"<td><a class='btn' href='"+data[i].pdf+"'>Download</a>"
                        +"</tr>"
                    );
                }
            }
        }});
}
function loadAppointments(email){
   $.ajax({

              type:"POST",
              url:url+"users/getAppointments",
              dataType:"json",
              data:{
                "emailId":email
              },
              success:function(data){
               if(data != null){
                for(i=0;i<data.length;i++){
                $('#patappoint').append(
                      " <tr id='" +data[i]._id+ "'>"
                      +"<td>" +data[i].doctor+ "</td>"
                      +"<td>" +data[i].speciality+ "</td>"
                      +"<td>" +data[i].date+ "</td>"
                      +"<td><a class='btn' onclick='cancelAppointment(\""+data[i]._id+"\", \""+data[i].date+"\")'>Cancel This Appointment</a>"
                    +"</tr>"
                );
                }
               }
}});

}


function cancelAppointment(id,dates){
    var appoint =  new Date(toDate(dates));
    var date = new Date();
    if(appoint.getTime()>date.getTime()) {
     $.ajax({

            type: "POST",
            url: url + "users/cancelAppointments",
            dataType: "json",
            data: {
                "id": id,
                "date":dates
            },
            success: function (data) {
                if (data != null) {
                    $('#'+id).hide();
                }
            }
        })

    }
    else
    {
        alert("Appointment Date Has Passed Cannot Cancel Now")
    }
}

function createAppoinment() {

}

function onchangesp() {
    var speciality = $("#speciality option:selected").text();
    console.log(speciality);
    $("#contentload").show();
    $.ajax({
        type:"POST",
        url:url + "users/searchDoctors ",
        dataType:"json",
        data:{
            "speciality" : speciality
        },
        success:function(data){
            console.log(data);
            $('#doctorlist').empty();
            $('#doctorlist')
                .append($('<option disabled selected>', { value : ""})
                    .text("Select Doctor"));

            for(i=0;i<data.length;i++) {
                $('#doctorlist').append($('<option>', {
                    value: data[i].name,
                    text: data[i].name
                }));
            }
            $('#doctorlist').material_select();
            $("#contentload").hide();
        }});

}

function onchangedoctors(){
    var doctor = $("#doctorlist option:selected").text();
    var speciality = $("#speciality option:selected").text();
    $.ajax({
        type:"POST",
        url:url + "users/searchDoctors ",
        dataType:"json",
        data:{
            "speciality" : speciality,
            "doctor" : doctor
        },
        success:function(data){
            $('#hours').empty();
            $('#hours')
                .append($('<option disabled selected>', { value : ""})
                    .text("Hours"));

            for(i=data[0].timein;i<data[0].timeouts;i++){
                $('#hours').append($('<option>', {
                    value: i,
                    text: i
                }));
            }
            $('#hours').material_select();
        }});
}

function toDate(dateStr) {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}