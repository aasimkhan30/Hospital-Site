/**
 * Created by aasim on 04/10/16.
 */
var url = "http://localhost:3000/";
$( document ).ready(function(){
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
    $('.carousel.carousel-slider').carousel({full_width: true});
    console.log("getItem");
    if(localStorage.getItem("pathology")==null)
    {
        window.location = "patlog.html";
    }
    console.log("Done");
    var options = {
        url: url + "pathology/getPatients",

        getValue: "emailId",

        template: {
            type: "description",
            fields: {
                description: "name"
            }
        },

        list: {
            match: {
                enabled: true
            }
        },

    };
    console.log(url +"pathology/getPatients");

    $("#patientid").easyAutocomplete(options);
    
  /*  $("form#uploadForm").submit(function(){
        console.log("Fome");
        var formData = new FormData($(this)[0]);
        $.ajax({
            url: "http://localhost:3000/"+"pathology/uploadReports",
            type: 'POST',
            data: formData,
            async: false,
            success: function (data) {
                alert(data)
            },
            cache: false,
            contentType: false,
            processData: false
        });

        return false;
    });*/
});

function uploadFile() {
    $.ajax({

        type:"POST",
        url:url+"users/verifyPatients",
        dataType:"json",
        data:{
            "id":localStorage.getItem("user")
        },
        success:function(data){
            if(data.success == 0){
                Materialize.toast("User Not Found");
            }
            else
            {
                console.log("upload");
                console.log(document.getElementById("reportid").value+"");
                var fd = new FormData();
                if($("#reportpdf")[0].files[0] != null ) {
                    fd.append('file', $("#reportpdf")[0].files[0]);
                    fd.append('name', document.getElementById("reportid").value);
                    fd.append('emailId', document.getElementById("patientid").value);

                    $.ajax({
                        url: url + "pathology/uploadReports",
                        type: 'POST',
                        data: fd,
                        success: function (data) {
                            console.log(data);
                            Materialize.toast("Reported Uploaded SuccessFully");
                        },
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                }
                else
                {
                    console.log("Else");
                }
            }
        }});

}
function logout(){
    localStorage.removeItem("pathology");
    windows.location("pathlog.html")
}


