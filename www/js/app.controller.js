var app = angular.module('app');


// creation du controleur
app.controller('homeController', function($scope, country, contrat, station) {
    
    $scope.handleClickPays = function(iso){
        
        contrat.getContrat(iso)
            .then(function(response){
                if (typeof($scope.contrats) == 'undefined' || $scope.contrats == null || $scope.contrats[0].countryIso2 != response.data[0].countryIso2){
                    $scope.contrats = response.data;
                }
                else{
                    $scope.contrats = null;
                }
            })

            .catch(function(error){
                console.error(error.message);
            });
    }

    $scope.handleClickContrat = function(idContrat){
        station.getByContrat(idContrat)
            .then(function(response){
                if (typeof($scope.stations) == 'undefined' ||  $scope.stations == null || $scope.stations[0].id != response.data[0].id){
                    $scope.stations = response.data;
                }
                else{
                    $scope.stations = null;
                }
            })

            .catch(function(error){
                console.error(error.message);
            });
    }

    country.getList()
        .then (function(response){
            $scope.countries = response.data;
        })
        .catch (function(error){
            console.error(error.message);
        }); 
    
});

app.controller('mapController', function($scope, $state, $cordovaGeolocation, contrat,station) {
    var options = {timeout: 10000, enableHighAccuracy: true};
   
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
        center: latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var closestDistance = null;
    var closestTown = null;
    var currentLocation = latLng;

    contrat.getAllContrat()
        .then(function(response){
            $scope.allContrat = response.data;
            
            //on cherche la ville la plus proche
            angular.forEach(response.data, function(value,key) {
                var position = new google.maps.LatLng(value.latitude , value.longitude);
                var distance = google.maps.geometry.spherical.computeDistanceBetween( currentLocation, position );
                if(closestDistance == null || distance < closestDistance){
                    closestDistance = distance;
                    closestTown = value.id;
                }
            }, this);
            //on récup_re les stations
            station.getByContrat(closestTown)
                .then(function(response){
                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                    var closestStationDistance = null;
                    var closestStationId = null;
                    var currentLocation = latLng;
                    //on cherche la station la plus proche
                    angular.forEach(response.data, function(value,key){
                        var position = new google.maps.LatLng(value.latitude , value.longitude);
                        var distance = google.maps.geometry.spherical.computeDistanceBetween( currentLocation, position );
                        if(closestStationDistance == null || distance < closestStationDistance){
                            closestStationDistance = distance;
                            closestStationId = value.id;
                        }     
                    }, this);
                    angular.forEach(response.data, function(value,key){
                        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                            
                            if(value.id == closestStationId){
                                var marker = new google.maps.Marker({
                                    map: $scope.map,
                                    animation: google.maps.Animation.DROP,
                                    position: new google.maps.LatLng(value.latitude, value.longitude),
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                }); 
                            }else{
                                var marker = new google.maps.Marker({
                                    map: $scope.map,
                                    animation: google.maps.Animation.DROP,
                                    position: new google.maps.LatLng(value.latitude, value.longitude)
                                });   
                            }
                            

                            var infowindow = new google.maps.InfoWindow({
                                content: value.name + ',</br>' +  value.address + ',</br>' + value.availableBikes +  ' vélo(s) disponible(s),</br> '  + value.availableFreeSpots + ' place(s) libre(s)'
                            });
                            
                            google.maps.event.addListener(marker, 'click', function() {
                                if(!marker.open){

                                    infowindow.open(map,marker);
                                    marker.open = true;
                                }
                                else{
                                    infowindow.close();
                                    marker.open = false;
                                }
                            });
                        });
                    }, this);

                    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: latLng,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        }); 
                        var infowindow = new google.maps.InfoWindow({
                                content: 'Vous êtes ici !'
                            });
                            
                            google.maps.event.addListener(marker, 'click', function() {
                                if(!marker.open){

                                    infowindow.open(map,marker);
                                    marker.open = true;
                                }
                                else{
                                    infowindow.close();
                                    marker.open = false;
                                }
                            });
                    });

                    }, function(error){
                        console.log("Could not get location");
                    });
                })
                .catch(function(error){

                })
        })
        .catch (function(error){
            console.error(error.message);
        })
    
});