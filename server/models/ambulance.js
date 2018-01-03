/**
 * Created by aasim on 24/09/16.
 */
function ambulance(){
    this.number=null;
    this.status=null;
    this.lat=null;
    this.lng=null;
    this.address=null;
    this.eta=null;
}
exports.create = function () {
    var instance = new  ambulance();
    return instance;
}