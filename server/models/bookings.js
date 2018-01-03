/**
 * Created by aasim on 24/09/16.
 */

function bookings(){
    this.lat = null;
    this.lng=null;
    this.address=null;
    this.time=null;
    this.number=null;
    this.return=null;
};

exports.create = function () {
    var instance = new bookings();
    return instance;
};