var app = angular.module('app');

app.service('country', function($http, apiHost){
    this.getList = function(){
        return $http.get(apiHost + 'countries');
    };
});

app.service('contrat', function($http, apiHost){
    this.getContrat = function(iso){
        return $http.get(apiHost + 'countries/' + iso + '/contracts');
    }
    this.getAllContrat = function(){
        return $http.get(apiHost + 'contracts');
    }
});

app.service('station', function($http, apiHost){
    this.getByContrat = function(idContrat){
        return $http.get(apiHost + 'contracts/' + idContrat + '/stations');
    }
});

