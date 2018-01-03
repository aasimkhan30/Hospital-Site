var name=null,gen=null,dob=null,em=null,qu=null,timin,timou;
var ph=null,sp=null,choices;
$( document ).ready(function(){
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
    $('.carousel.carousel-slider').carousel({full_width: true});
    console.log("Everything Ready");
    $('select').material_select();
    $('#deleted').hide();
    $('#added').hide();
    if(localStorage.getItem("admin")==null)
    {
        window.location = "adminlogin.html";
    }
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 100 ,// Creates a dropdown of 15 years to control year
        format: 'dd/mm/yyyy'
    });
    viewdoc();
    viewappo();
    viewambu();
    pubnub = PUBNUB.init({
        publish_key: 'pub-c-9de97951-5174-4a04-b384-6f2fb6cc6e72',
        subscribe_key: 'sub-c-800f1908-841a-11e6-8c91-02ee2ddab7fe',
        error: function (error) {
            //  console.log('Error:', error);
        }
    });
    pubnub.subscribe({
        channel : 'emergency',
        message : function(m){

            console.log(m)
            window.location = "admin3.html";
        },
        error : function (error) {
            // Handle error here
            console.log(JSON.stringify(error));
        }
    });
})
function addoc(){
    console.log("add");
    name=document.getElementById("name").value;
    gen=document.getElementById("gender").value;
    sp=document.getElementById("speciality").value;
    qu=document.getElementById("degree").value;
    dob=document.getElementById("daob").value;
    em=document.getElementById("emailId").value;
    ph=document.getElementById("phoneNumber").value;

    timin=$("#timein option:selected").text();
    timou=$("#timeouts option:selected").text();
    //console.log(fname + " " + lname);

                $.ajax({
                    type:"POST",
                    url:"http://localhost:3000/admin/addDoctor",
                    dataType:"json",
                    data:{
                        "name":name,
                         "emailId":em,
                        "gender":gen,
                        "speciality":sp,
                        "degree":qu,
                        "daob":dob,
                        "phoneNumber":ph,
                        "timein":timin,
                        "timeouts":timou
                    },
                    success:function(data){
                            $('#added').hide();
                        console.log(data);
                            console.log("Doctor information added");
                        $('#viewdoc').append(
                            "<tr id=\""+data._id+"\">"
                            +"<td>"+data.name+"</td>"
                            +"<td>"+data.speciality+"</td>"
                            +"<td><button class=\"btn waves-effect waves-light red\" type=\"submit\" name=\"action\""
                            +"\" onclick=\"con('"+data._id+"')\">Delete</button></td>"+
                            "</tr>"
                        );
                        Materialize.toast("Doctor Added",5000);

                    }});
                //console.log("Doctor information added");

}

function con(id){
    $('#agree').attr('onClick', 'remdoc("'+id+'")');
    $("#modal1").openModal();
}
var name,i,j;
function viewdoc()
{
    console.log("viewdoc");
    $.ajax({
        type:"POST",
        url:"http://localhost:3000/admin/viewDoctor",
        dataType:"json",
        data:{
        },
        success:function(data){
            if(data !=null){
                for(i=0;i<data.length;i++){
                    //console.log(data[i]);
                    $('#viewdoc').append(
                        "<tr id=\""+data[i]._id+"\">"
                        +"<td>"+data[i].name+"</td>"
                        +"<td>"+data[i].speciality+"</td>"
                        +"<td><button class=\"btn waves-effect waves-light red\" type=\"submit\" name=\"action\""
                        +"\" onclick=\"con('"+data[i]._id+"')\">Delete</button></td>"+
                        "</tr>"
                    );
                }
            }

        }

    });
}
function remdoc(id)
{
    $("#modal1").closeModal();
    console.log("remove");
    $.ajax({
        type:"POST",
        url:"http://localhost:3000/admin/removeDoctor",
        dataType:"json",
        data:{
            "id":id
        },
        success: function (data) {
            console.log("Hide");
            if (data != null) {
              //  $('#deleted').show();
                Materialize.toast("Doctor Deleted",5000);
                $('#'+id).hide();
            }
        }
    });

}

function viewappo()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    var today = dd+'/'+mm+'/'+yyyy;
    console.log(today);
    console.log("viewappo");
    $.ajax({
        type:"POST",
        url:"http://localhost:3000/admin/viewAppointment",
        dataType:"json",
        data:{
            "date":today
        },
        success:function(data){
            if(data !=null){
                for(i=0;i<data.length;i++){
                    //console.log(data[i]);
                    $('#viewappo').append(
                        "<tr>"
                        +"<td>"+data[i].doctor+"</td>"
                        +"<td>"+data[i].name+"</td>"
                        +"<td>"+data[i].date+"</td>"
                        +"<td>"+data[i].hours+":"+data[i].mins+"</td>"
                            +"<td>"+data[i].phoneNumber+"</td>"
                        +"</tr>"
                    );
                }
            }

        }

    });
}

function viewambu()
{
    console.log("viewambu");
    $.ajax({
        type:"POST",
        url:"http://localhost:3000/admin/viewAmbulance",
        dataType:"json",
        data:{
            date:new Date('')
        },
        success:function(data){
            if(data !=null){
                for(i=0;i<data.length;i++){
                    //console.log(data[i]);
                    if(data[i].status=="Idle"){
                        $('#viewambulance').append(
                            "<div class=\"row\">"+
                            "<div class=\"col s12 m7\">"+
                            "<div class=\"card\">"+
                            "<div class=\"card-content\">"+
                            "<p>Id: "+data[i]._id+"</p>"+
                            "<p>Status: "+data[i].status+"</p>"+
                            "</div>"+
                            "</div>"+
                            "</div>"+
                            "</div>"
                        );
                    }
                    if(data[i].status=="Booked"){
                    $('#viewambulance').append(
                        "<div class=\"row\">"+
                        "<div class=\"col s12 m7\">"+
                        "<div class=\"card\">"+
                        "<div class=\"card-content\">"+
                        "<p>Id: "+data[i]._id+"</p>"+
                        "<p>Status: "+data[i].status+"</p>"+
                        "<a class=\"waves-effect waves-light btn blue \" id=\"d"+data[i]._id+"\" onclick=\"dispatch('"+data[i]._id+"')\">Dispatch</a>"+
                        "</div>"+
                        "</div>"+
                        "</div>"+
                        "</div>"
                    );
                }
                if(data[i].status=="Dispatched")
                {
                    $('#viewambulance').append(
                        "<div class=\"row\">"+
                        "<div class=\"col s12 m7\">"+
                        "<div class=\"card\">"+
                        "<div class=\"card-content\">"+
                        "<p>Id: "+data[i]._id+"</p>"+
                        "<p>Status: "+data[i].status+"</p>"+
                        "<a class=\"waves-effect waves-light btn blue\" id=\"r"+data[i]._id+"\"onclick=\"returnam('"+data[i]._id+"')\">Return</a>"+
                        "</div>"+
                        "</div>"+
                        "</div>"+
                        "</div>");
                }
            }

        }

    }});
}
function addambu(){
    // console.log("addambu");
    //console.log(fname + " " + lname);
    $.ajax({
        type:"POST",
        url:"http://localhost:3000/admin/createAmbulance",
        dataType:"json",
        data:{
        },
        success:function(data){
            console.log(data.success);
            if(data.success==1){
                console.log("Ambucreated");
            }
        window.location =  "admin3.html";
        }});
}

function dispatch(id)
{
    // console.log("dispatchambu");
    //console.log(fname + " " + lname);
    var mess = {admin:'1',
        id:id};
    pubnub.publish({
        channel: 'emergency',
        message: mess,
        callback: function (m) {
            console.log(m)
        }
    });
    $.ajax({
        type:"POST",
        url:"http://localhost:3000/admin/dispatchAmbulance",
        dataType:"json",
        data:{
            "id":id
        },
        success:function(data){
            console.log(data.success);
            if(data.success==1) {
                console.log("Ambudispatched");
                $('#d'+id).hide();
                $('#r'+id).show();
                window.location =  "admin3.html";
            }

        }});
}

function returnam(id)
{
    //console.log("returnambu");
    //console.log(fname + " " + lname);
    $.ajax({
        type:"POST",
        url:"http://localhost:3000/admin/returnAmbulance",
        dataType:"json",
        data:{
            "id":id

        },
        success:function(data){
            // console.log(data.success);
            if(data.success==1) {
                $('#d'+id).show();
                $('#r'+id).hide();
                // console.log("Ambureturned");
                window.location =  "admin3.html";
            }

        }});
}

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


function logout(){
    localStorage.removeItem("admin");
    window.location= "adminlogin.html"
}



/*<div class="row">
 <div class="col s12 m7">
 <div class="card">
 <div class="card-image">
 <img src="images/sample-1.jpg">
 <span class="card-title">Healthcab #12</span>
 </div>
 <div class="card-content">
 <p>Dispatched From: Azad Nagar<br>Dispatched To: D.N. Nagar<br>Time Of Dispatch: 1400hrs</p>
 </div>
 </div>
 </div>
 </div>
 */