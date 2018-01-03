/**
 * Created by aasim on 24/09/16.
 */
function admin(){
    this.emailId=null;
    this.password=null;
}
exports.create=function () {
    var instance = new admin();
    return instance;
}