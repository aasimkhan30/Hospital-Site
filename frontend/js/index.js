
var url = "http://localhost:3000/";
$( document ).ready(function(){
	$(".dropdown-button").dropdown();
	  $(".button-collapse").sideNav();
	$('.slider').slider({
		height:100,
	});
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

function createAppointment(){
	console.log("create appoint");
	$("#erroapp").hide();
	$("#doneapp").hide();
var name=document.getElementById('name').value;
var age=document.getElementById('age').value;
var date=document.getElementById('date').value;
var gender=document.getElementById('gender').value;
var contact=document.getElementById('contact').value;
var email=document.getElementById('email').value;
var country=document.getElementById('country').value;
var hours=document.getElementById('hours').value;
var  mins=document.getElementById('mins').value;
var speciality=document.getElementById('speciality1').value;
var doctor=document.getElementById('doctorslist1').value;
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

							$("#doneapp").show();


					}});
			}
			else{
				$("#erroapp").show();
			}
		}});

//var age=do
}

function onchangesp1() {
	var speciality = $("#speciality1 option:selected").text();
	console.log(speciality);
	$.ajax({
		type:"POST",
		url:url + "users/searchDoctors ",
		dataType:"json",
		data:{
			"speciality" : speciality
		},
		success:function(data){
			console.log(data);

			$('#doctorslist1').empty();
			$('#doctorslist1')
				.append($('<option disabled selected>', { value : ""})
					.text("Select Doctor"));

				for(i=0;i<data.length;i++) {
					console.log("Done");
					$('#doctorslist1').append($('<option>', {
						value: data[i].name,
						text: data[i].name
					}));
				}
			$('#doctorslist1').material_select();
		}});

}

function onchangedoctors(){
	var doctor = $("#doctorslist1 option:selected").text();
	var speciality = $("#speciality1 option:selected").text();
	console.log(speciality);
	$.ajax({
		type:"POST",
		url:url + "users/searchDoctors ",
		dataType:"json",
		data:{
			"speciality" : speciality,
			"doctor" : doctor
		},
		success:function(data){
			console.log(data);

			

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

function onchangesp2() {
	var speciality = $("#speciality2 option:selected").text();
	$("#docttabc").hide();
	console.log(speciality);
	$.ajax({
		type:"POST",
		url:url + "users/searchDoctors ",
		dataType:"json",
		data:{
			"speciality" : speciality
		},
		success:function(data){
			console.log(data);
			$('#doctorslist2').empty();
			$('#docttab').empty();
			$('#docttab').append(
				"<tr>"
				+"<th> Name </th>"
				+"<th> Qualifications </th>"
				+"<th> Degree </th>"
				+"<th> Time In </th>"
				+"<th> Time Out </th>"
				+"<th> Email </th>"
				+"</tr>"
			);
			$('#doctorslist2')
				.append($('<option disabled selected>', { value : ""})
					.text("Select Doctor"));
			for(i=0;i<data.length;i++) {
				$('#doctorslist2')
					.append($('<option>', { value : data[i].name })
						.text(data[i].name));
				$('#docttab').append(
					"<tr>"
					+"<td>"+data[i].name+"</td>"
					+"<td>"+data[i].speciality+"</td>"
					+"<td>"+data[i].degree+"</td>"
					+"<td>"+data[i].timein+"</td>"
					+"<td>"+data[i].timeouts+"</td>"
					+"<td>"+data[i].emailId+"</td>"
					+"</tr>"
				);
			}
			$('#doctorslist2').material_select();
		}});

}

function onchangedoc2() {
	var doctor = $("#doctorslist2 option:selected").text();
	var speciality = $("#speciality2 option:selected").text();
	$("#docttabc").hide();
	console.log(speciality);
	$.ajax({
		type:"POST",
		url:url + "users/searchDoctors ",
		dataType:"json",
		data:{
			"speciality" : speciality,
			"doctor" : doctor
		},
		success:function(data){
			console.log(data);
			$('#docttab').empty();
			$('#docttab').append(
				"<tr>"
				+"<th> Name </th>"
				+"<th> Qualifications </th>"
				+"<th> Degree </th>"
				+"<th> Time In </th>"
				+"<th> Time Out </th>"
				+"<th> Email </th>"
				+"</tr>"
			);

				$('#docttab').append(
					"<tr>"
					+"<td>"+data[0].name+"</td>"
					+"<td>"+data[0].speciality+"</td>"
					+"<td>"+data[0].degree+"</td>"
					+"<td>"+data[0].timein+"</td>"
					+"<td>"+data[0].timeouts+"</td>"
					+"<td>"+data[0].emailId+"</td>"
					+"</tr>"
				);

			//$('#doctorslist2').material_select();
		}});

}

function togdoct() {
  $("#docttabc").show();
}