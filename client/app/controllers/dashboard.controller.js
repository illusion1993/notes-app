angular.module('NotesApp')

.controller('DashboardController', DashboardController);

//Injecting dependencies
DashboardController.$inject = ['$scope', '$state', '$stateParams', 'DashboardService', 'AuthenticationService'];

//Controller function
function DashboardController($scope, $state, $stateParams, DashboardService, AuthenticationService) {

    function logout() {
        console.log('DashboardController: logout() called');
        AuthenticationService.logout();
        $state.go('Home');
    }

    if ($stateParams.dashboard) {
        console.log('DashboardController: Dashboard passed as state param');
        $scope.dashboard = $stateParams.dashboard;
    }
    else {
        console.log('DashboardController: Dashboard not passed as state param');
        DashboardService.getDashboard()
            .then(function(response) {
                if(response.success){
                    $scope.dashboard = response.data;
                }
                else {
                    console.log('DashboardController: Unable to load dashboard');
                    logout();
                }
            })
    }

    // Logout function
    $scope.logout = logout;

}