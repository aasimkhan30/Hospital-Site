var address;
var mins;
var maps;
var route;
var marker2;
var d = 0;
var origin1;
var dest1;
var pubnub;
var booksession;
var id;
var url = "http://localhost:3000/";

function initMap() {


    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 19.1136,
            lng: 72.8697
        },
        zoom: 14,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
        disableDefaultUI: true
    });

    var myLatLng = {
        lat: 19.123121,
        lng: 72.836061
    };
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'My Hospital',
        "icon": 'img/hospital.png',


    });
    pubnub = PUBNUB.init({
        publish_key: 'pub-c-9de97951-5174-4a04-b384-6f2fb6cc6e72',
        subscribe_key: 'sub-c-800f1908-841a-11e6-8c91-02ee2ddab7fe',
        error: function (error) {
            console.log('Error:', error);
        }
    });
    console.log("Pubnub Done");
    pubnub.subscribe({
        channel : 'emergency',
        message : function(m){
            if(m.admin != null)
            {
                $("#modal3").closeModal();
                bookambulance();
            }
        },
        error : function (error) {
            // Handle error here
            console.log(JSON.stringify(error));
        }
    });

    locateUser(); //Locating User on initial load
    //detectmobile();//Detecting wether mobile or not so that they can call too
    new_position(1);
    //Adding gps locator icon 
    var locControlDiv = document.createElement('div');
    var locControl = new locControlc(locControlDiv, map);
    locControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locControlDiv);

    //Adding ambulance booking icon
    /*  var ambControlDiv = document.createElement('div');
     var ambControl = new ambControlc(ambControlDiv, map);
     ambControlDiv.index = 1;
     map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(ambControlDiv);*/

    var timeControlDiv = document.createElement('div');
    var timeControl = new timeControlc(timeControlDiv, map);
    timeControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(timeControlDiv);

    //Adding Pointer on the center of map
    $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
        //do something onclick
        .click(function() {});



    //Geocoder Code
    geocoder = new google.maps.Geocoder;
    var input = (document.getElementById('search'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        $("#search").blur();
        if (!place.geometry) {
            // window.alert("Autocomplete's returned place contains no geometry");
            geocodeAddress(geocoder, map);
            new_position(1);
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            map.setCenter(17);
            new_position(1);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(14);
            new_position(1);
        }
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
    });

    //getting place location at center of pointer
    map.addListener('idle', function() {

        new_position(1);

    });

    map.addListener('dblclick', function() {

        new_position(1);



    });



    //Keeping Map Centre Same when resizing
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

}




function new_position(geo) {
    var search = document.getElementById("search");
    search.style.background = "#e57373";
    if (geo == 1) {
        var geocoder = new google.maps.Geocoder;
        geocodeLatLng(geocoder, map);
    }

    var latlng = map.getCenter();
    origin1 = new google.maps.LatLng(19.123121, 72.836061);

    var distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix({
            origins: [origin1],
            destinations: [map.getCenter()],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            durationInTraffic: true,
            avoidHighways: false,
            avoidTolls: false
        },
        function(response, status) {

            if (status !== google.maps.DistanceMatrixStatus.OK) {
                console.log('Error:', status);

            } else {
                //console.log(response);
                console.log(response.rows[0].elements[0].duration.text);
                time = response.rows[0].elements[0].duration.value;
                console.log(response.rows[0].elements[0].duration.value);
                $("#time").html("<span style='font-size:12px;'>Estimated Time <br></span><span style='font-size:25px;'>" + response.rows[0].elements[0].duration.text + "</span>");
            }
        });

}

function locateUser() {
    console.log("Called Geolocation");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.panTo(pos);
                map.setZoom(14);
                // getRate(map.getCenter(),map);
            },
            function() {
                handleLocationError(true, map.getCenter());
            });
    } else {
        // Browser doesn't support Geolocation

        handleLocationError(false, map.getCenter());
    }
}

function ambControlc(controlDiv, map) {

    // Set CSS for the control border.
    var location_icon_c = document.createElement('div');
    location_icon_c.style.cursor = 'pointer';
    location_icon_c.style.textAlign = 'center';
    location_icon_c.style.marginBottom = '5px';
    location_icon_c.style.background = 'url(img/redcross.png) no-repeat';
    location_icon_c.title = 'About Us';
    location_icon_c.style.backgroundSize = '100%';
    location_icon_c.class = "modal-trigger";
    location_icon_c.href = "#modal1";
    location_icon_c.style.verticalAlign = "center";
    controlDiv.appendChild(location_icon_c);

    // Set CSS for the control interior.
    var location_icon = document.createElement('div');
    location_icon.style.fontFamily = 'Roboto,Arial,sans-serif';
    location_icon.innerHTML = '<img  height="80px" width="80px">';
    location_icon_c.appendChild(location_icon);
    // Setup the click event listeners: simply set the map to Chicago.
    location_icon.addEventListener('click', function() {
        console.log("Clicked");
        $('#modal1').openModal();
    });

}


function timeControlc(controlDiv, map) {

    // Set CSS for the control border.
    var location_icon_c = document.createElement('div');
    location_icon_c.style.cursor = 'pointer';
    location_icon_c.style.textAlign = 'center';
    location_icon_c.style.marginBottom = '5px';
    location_icon_c.style.background = '#e57373';
    location_icon_c.style.margin = "10px";
    location_icon_c.style.padding = "10px";
    location_icon_c.style.color = "#fff";
    location_icon_c.style.fontSize = "15px";
    location_icon_c.title = 'About Us';
    location_icon_c.style.backgroundSize = '100%';
    location_icon_c.class = "modal-trigger";
    location_icon_c.href = "#modal1";
    location_icon_c.style.verticalAlign = "center";
    controlDiv.appendChild(location_icon_c);

    // Set CSS for the control interior.
    var location_icon = document.createElement('div');
    location_icon.style.fontFamily = 'Roboto,Arial,sans-serif';
    location_icon.innerHTML = '<div id="time">Estimated Time<br><span >5 Mins</span></div>';
    location_icon_c.appendChild(location_icon);
    // Setup the click event listeners: simply set the map to Chicago.
    location_icon.addEventListener('click', function() {
        console.log("Clicked");

    });

}

function locControlc(controlDiv, map) {

    // Set CSS for the control border.
    var location_icon_c = document.createElement('div');
    location_icon_c.style.backgroundColor = '#e57373';
    location_icon_c.style.borderRadius = '3px';
    location_icon_c.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    location_icon_c.style.cursor = 'pointer';
    location_icon_c.style.marginBottom = '5px';
    location_icon_c.style.marginRight = '10px';
    location_icon_c.style.textAlign = 'center';

    location_icon_c.title = 'Find Your Location';
    controlDiv.appendChild(location_icon_c);

    // Set CSS for the control interior.
    var location_icon = document.createElement('div');
    location_icon.style.color = 'rgb(25,25,25)';
    location_icon.style.fontFamily = 'Roboto,Arial,sans-serif';
    location_icon.style.fontSize = '10px';
    location_icon.style.color = '#fff';
    location_icon.style.paddingLeft = '5px';
    location_icon.style.paddingRight = '5px';
    location_icon.style.paddingTop = '5px';
    location_icon.innerHTML = '<i class="material-icons">location_searching</i>';
    location_icon_c.appendChild(location_icon);

    // Setup the click event listeners: simply set the map to Chicago.
    location_icon.addEventListener('click', function() {
        locateUser();
    });

}

function onsearchClick() {
    var input = (document.getElementById('search'));
    input.value = "";
    input.style.background = "#fff";
    flag_sclick = 1;
}

function onsearchBlur() {
    console.log("Search Blurred");
    flag_sclick = 0;
    var input = (document.getElementById('search'));
    input.style.background = "#e57373";
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('search').value;
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            resultsMap.setZoom(14);
        } else {
            //alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function geocodeLatLng(geocoder, map) {
    console.log("Called geocoding");
    var latlng = map.getCenter();
    geocoder.geocode({
        'location': latlng
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                address = results[1].formatted_address;
                document.getElementById("search").value = results[1].formatted_address;
                //locality=results[1].address_component.long_name;
            } else {
                //window.alert('No results found');
                var $toastContent = $('<span>No Results Found</span>');
                Materialize.toast($toastContent, 2000, 'amber accent-4');
            }
        } else {
            // window.alert('Geocoder failed due to: ' + status);
        }
    });
}


function geocodeLatLng2(geocoder, latlng) {
    console.log("Called geocoding");
    geocoder.geocode({
        'location': latlng
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                location2 = results[1].formatted_address;
                return location2;
                /*for(var i=0;i<results[1].address_components.length;i++)
                 {
                 for(var j=0;j<results[1].address_components[i].types.length;j++)
                 if(results[1].address_components[i].types[j]=="sublocality_level_1")
                 locality=results[1].address_components[i].long_name;
                 }*/
                //locality=results[1].address_component.long_name;
            } else {
                //window.alert('No results found');
            }
        } else {
            // window.alert('Geocoder failed due to: ' + status);
        }
    });
}
$(document).ready(function() {
    $(".button-collapse").sideNav();
})




$(document).ready(function() {
    //detectmobile();
    $("#call").hide();
});
function  book(){
    $('#modal1').closeModal();
    $('#modal3').openModal();
    //console.log(map.getCenter().lat() +" " +map.getCenter().lng()+" "+address+" "+localStorage.getItem("time"));
    $.ajax({
        type:"POST",
        url:url+"users/bookAmbulance",
        dataType:"json",
        data:{
            "lat":map.getCenter().lat(),
            "lng":map.getCenter().lng(),
            "address":address,
            "eta":localStorage.getItem("time")
        },
        success:function(data){
            if(data != null) {
                console.log(data);
                if (data.success == undefined) {
                id = data._id; 
                pubnub.publish({
                    channel: 'emergency',
                    message: data._id,
                    callback: function (m) {
                        console.log(m)
                    }
                });
            }
                else{
                    $('#modal3').closeModal();
                    $('#modal4').openModal();
                }
            }
        }});
    


}
function bookamb() {
    if (parseInt(time) < 1800) {
        $('#modal1').openModal();
        $("#address").html("<span style='font-size:20px;color:#e57373'>" + address);
    } else {
        $('#modal2').openModal();
    }
}

function bookambulance() {
    console.log("booking");
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    directionsDisplay.setOptions({
        suppressMarkers: true
    });
    var myLatLng = map.getCenter();

    var icon = {
        url: "img/pointer.png", // url
        scaledSize: new google.maps.Size(20, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Your destination',
        "icon": icon,


    });
    marker.setMap(map);
    //document.getElementsByClassName("centerMarker").style.visibility="hidden";
    $(".centerMarker").hide();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    $('#modal1').closeModal();

    $("#book").hide();
    detectmobile();
    $("#call").show();
    var options = $.extend({
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
    }, options);
    map.setOptions(options);

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear();


    if (typeof(Storage) !== "undefined") {
        // Store
        localStorage.setItem("booking", "1");
        localStorage.setItem("destination", map.getCenter());
        localStorage.setItem("time", time);
        localStorage.setItem("booktime", time);
        localStorage.setItem("ambloc", new google.maps.LatLng(19.123121, 72.836061));
        var d = new Date();
        var n = d.getTime();
        localStorage.setItem("verify", n);

    }




}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    dest1 = map.getCenter();
    directionsService.route({
        origin: new google.maps.LatLng(19.123121, 72.836061),
        destination: map.getCenter(),
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            console.log(response);
            for (i = 0; i < response.routes[0].overview_path[i].length; i++) {

            }
            route = response.routes[0].overview_path;


            var icon2 = {
                url: "img/ambulance.png", // url
                scaledSize: new google.maps.Size(30, 30), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
            marker2 = new google.maps.Marker({
                position: new google.maps.LatLng(route[0].lat(), route[0].lng()),
                map: map,
                title: "ambulance",
                easing: "easeOutExpo",
                "icon": icon2,
            });
            marker2.setMap(map);
            setTimeout(animate(0), 2000);



            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}


function animate() {
    if (d == route.length) {
        $('#modal5').openModal();
        return;
    }
    else {
        console.log(d);
        marker2.setPosition(new google.maps.LatLng(route[d].lat(), route[d].lng()));
        var distanceService = new google.maps.DistanceMatrixService();
        distanceService.getDistanceMatrix({
                origins: [new google.maps.LatLng(route[d].lat(), route[d].lng())],
                destinations: [dest1],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                durationInTraffic: true,
                avoidHighways: false,
                avoidTolls: false
            },
            function(response, status) {

                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    console.log('Error:', status);

                } else {
                    //console.log(response);
                    console.log(response.rows[0].elements[0].duration.text);
                    time = response.rows[0].elements[0].duration.value;
                    console.log(response.rows[0].elements[0].duration.value);
                    $("#time").html("<span style='font-size:12px;'>Estimated Time <br></span><span style='font-size:25px;'>" + response.rows[0].elements[0].duration.text + "</span>");
                }
            });
        d++;
        setTimeout("animate()", 1000);
    }
}

function detectmobile() {
    var ua = navigator.userAgent;
    var checker = {
        iphone: ua.match(/(iPhone|iPod|iPad)/),
        blackberry: ua.match(/BlackBerry/),
        android: ua.match(/Android/)
    };
    var callButton = document.getElementById("call");
    if (checker.iPhone == null && checker.blackberry == null && checker.android == null)
        callButton.style.visibility = "hidden";
}