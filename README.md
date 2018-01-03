# Hospital Website

It's a web application used to manage Hospital Appointment Bookings, Emergency Ambulance Bookings and Lab Report Deliveries. It has a nice simple user dashboard where the patient can keep a track of all reports and appointments. In addition to that, there are some static pages which can be used to give more information about the hospital and it's facilities.

## Getting Started

The project is divided into 2 parts. The NodeJs server and the Jquery frontend. A mongodb No SQL database is used to store the data. 

### Prerequisites

You need to have the following things installed in your system.



### Installing

* Install NodeJS
* Install MongoDB
* Install all the modules which the node server asks

```
> $npm install module_name
```

### Running
These are the 3 major steps you'll have to follow everytime

1. Setting storage path for Mongodb Server. Be sure you set the same path everytime else it will create a new Database which will be very large in size.
```
># mongod --dbpath "<path-to-project>"
```

2. Running the Node Backend Server.
```
># <path-to-project>/Server> node app.js
```

3. Use Xampp or some other webserver to access the webpages in the frontend folder. (Using a server is recommended as some browsers act wierdly when directly opening HTML files and won't allow the pages to communicate to the server)

## Deployment

* To deploy this application on the live system, simply create a Heroku app and upload the file to the heroku server.
* Use some free MongoDB online Server like Mlab.



## Authors

* **Aasim Khan** 


## Acknowledgments

* Pubnub's API for implementing emergency ambulance booking system.


