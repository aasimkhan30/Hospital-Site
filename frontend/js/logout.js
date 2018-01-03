function logout(){
	localStorage.removeItem("user");
	windows.location("../materialize-3/login.html")
}