/**
 * Created by aasim on 24/09/16.
 */
function appointments(){
    this.name = null;
    this.emailId = null;
    this.phoneNumber = null;
    this.age = null;
    this.gender= null;
    this.country = null;
    this.date = false;
    this.hours=false;
    this.mins=null;
    this.speciality=null;
    this.doctor=null;
    this.verified=null;
}
exports.create = function () {
    var instance = new appointments();
    return instance;
};