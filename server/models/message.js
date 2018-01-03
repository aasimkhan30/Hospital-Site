/**
 * Created by aasim on 24/09/16.
 */
function message() {
    this.text = null;
    this.time = null;
    this.sender = null;
}
exports.create = function () {
    var instance = new message();
    return instance;
}