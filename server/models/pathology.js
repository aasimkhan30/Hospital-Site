/**
 * Created by aasim on 24/09/16.
 */
function pathology(){
    this.username=null;
    this.password=null;
}
exports.create = function () {
    var instance = new pathology();
    return instance;
}