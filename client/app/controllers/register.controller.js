angular.module('NotesApp')

.controller('RegisterController', RegisterController);

//Injecting dependencies
RegisterController.$inject = ['$scope', '$state', 'AuthenticationService'];

//Controller function
function RegisterController($scope, $state, AuthenticationService) {

    $scope.registerForm = {
        submit: function () {
            AuthenticationService.register($scope.registerForm)
                .then(function(response) {
                    if(response.success){
                        console.log('RegisterController: Registered user, moving to login state');
                        $state.go('Login');
                    }
                    else{
                        console.log('RegisterController: Unable to register');
                        console.log(response.data);
                    }
                });
        }
    };

}