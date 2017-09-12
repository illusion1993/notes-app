angular.module('NotesApp')

.controller('HomeController', HomeController);

//Injecting dependencies
HomeController.$inject = ['$state', 'AuthenticationService'];

//Controller function
function HomeController($state, AuthenticationService) {

    AuthenticationService.isLogged()
        .then(function(response){
            if(response.success){
                // window.alert('Success');
                $state.go('Dashboard');
            }
            else {
                // window.alert('Failure');
                $state.go('Login');
            }
        });

}