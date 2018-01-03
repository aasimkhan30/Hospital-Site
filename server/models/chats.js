/**
 * Created by aasim on 24/09/16.
 */
function chats(){
    this.userid = null;
    this.messages = null;
    this.emailId = null;
}
exports.create =  function () {
    var instance = new chats();
    return instance;
}