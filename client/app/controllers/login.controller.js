angular.module('NotesApp')

.controller('LoginController', LoginController);

//Injecting dependencies
LoginController.$inject = ['$scope', '$state', 'AuthenticationService', 'DashboardService'];

//Controller function
function LoginController($scope, $state, AuthenticationService, DashboardService) {

    $scope.loginForm = {
        submit: function () {
            AuthenticationService.login($scope.loginForm)
                .then(function(response) {
                    if(response.success){
                        DashboardService.getDashboard()
                            .then(function(response) {
                                if(response.success){
                                    $state.go('Dashboard', { dashboard: response.data });
                                }
                                else {
                                    console.log('LoginController: Unable to load dashboard after login');
                                }
                            })
                    }
                    else{
                        console.log('LoginController: Unable to login');
                        console.log(response.data);
                    }
                });
        }
    };

}