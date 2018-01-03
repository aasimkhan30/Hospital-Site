/**
 * Created by aasim on 24/09/16.
 */
function doctor(){
    this.name = null;
    this.gender=null;
    this.daob=null;
    this.emailId = null;
    this.degree=null;
    this.timein=null;
    this.timeouts=null;
    this.speciality=null;
    this.phoneNumber=null;
};

exports.create = function () {
    var instance = new doctor();
    return instance;
};