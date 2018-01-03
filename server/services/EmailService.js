var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport

var smtpConfig = {
    host: 'smtp.gmail.com',
	service: "Gmail",
    auth: {
        user: 'mumbaihospitalsp@gmail.com',
        pass: 'jadhavcoder'
    },
};

var transporter = nodemailer.createTransport(smtpConfig);

var baseUrl = "http://hospitalnodespit.herokuapp.com";
//var baseUrl = "http://localhost:3000";
var verifyUrl = baseUrl + "/users/verify?id=";
var resetUrl = baseUrl + "reset/?id=";

exports.sendVerifyMail = function(item){
	// setup e-mail data with unicode symbols
	console.log("Verify"+item.emailId);
	var mailOptions = {
	    from: 'Hospital Spit <mumbaihospitalsp@gmail.com>', // sender address
	    to: item.emailId, // list of receivers
	    subject: 'Hospital User Verification', // Subject line
	    html: 'Welcome to SPIT Hospital, <b>'
	    		 + item.name
	    		 + '</b>! <br/> '
	    		 + '<a href="'+ verifyUrl + item._id + '">Click Here</a>'
	    		 + ' to verify your account.'
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}

exports.appointmentMail = function(item){
	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: 'Hospital Spit <mumbaihospitalsp@gmail.com>', // sender address
		to: item.emailId, // list of receivers
		subject: 'Hospital User Verification', // Subject line
		html: 'Welcome to Mumbai Hospital, <b>'
		+ item.name
		+ '</b>! <br/> '
		+ ' Your Appointment is Booked for. ' + item.doctor + ' for time '+ item.hours + ':' + item.mins+'<br> You will also receive a confirmation call on Appointment Day'
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
}
exports.sendForgotMail = function(item){
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'Slapdash <support@slapdash.in>', // sender address
	    to: item.user.emailId, // list of receivers
	    subject: 'Slapdash Password Reset', // Subject line
	    html: 'Hey <b>'
	    		 + item.user.name 
	    		 + '</b>! <br/> To reset your password on Slapdash, ' 
	    		 + '<a href="' + resetUrl + item._id + '"> Click Here. </a>'
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}

exports.sendFinalPaymentMail = function(userName, emailId, link, paymentAmount){
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'Slapdash <support@slapdash.in>', // sender address
	    to: emailId, // list of receivers
	    subject: 'Slapdash Final Outstanding Payment', // Subject line
	    html: 'Hey <b>'
	    		 + userName 
	    		 + '</b>! <br/> Slapdash Tshirt Market has closed and your outstanding amount to be paid is: <br/> ' 
	    		 + " <h3 style=''> &#8377; " + paymentAmount +'/- </h3>'
	    		 + '<a href="' + link + '"> <b> Click Here </b> </a> to view details of your payment.'
	    		 + '<br/> NOTE: You have to complete this payment within 36 hours or the booking amount you paid <b> won\'t be refunded </b>.'
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}