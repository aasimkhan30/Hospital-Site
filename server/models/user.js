function user(){
    this.name = null;
    this.emailId = null;
    this.phoneNumber = null;
    this.gender = null;
    this.password = null;
    this.address= null;
    this.dob=null;
    this.bloodgrp=null;
    this.country=null;
    this.verified = null;
};

exports.create = function () {
    var instance = new user();
    return instance;
};