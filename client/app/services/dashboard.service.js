angular.module('NotesApp')

.service('DashboardService', DashboardService);

//Injecting required dependencies
DashboardService.$inject = ['Restangular'];

//DashboardService definition
function DashboardService(Restangular) {

    this.getDashboard = function(){
        return Restangular.one('api/dashboard').get().then(
            function(response){
                response = response.plain();
                return response;
            },
            function(response){
                return response.data;
        });
    };

}