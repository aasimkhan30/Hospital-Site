/**
 * Created by aasim on 24/09/16.
 */
function reports(){
    this.emailId = null;
    this.name = null;
    this.link = null;
    this.date = null;
}
exports.create = function () {
    var instance = new reports();
    return instance;
}