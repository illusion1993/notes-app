angular.module('NotesApp')

.service('AuthenticationService', AuthenticationService);

//Injecting required dependencies
AuthenticationService.$inject = ['Restangular', '$cookieStore', '$rootScope'];

//AuthenticationService definition
function AuthenticationService(Restangular, $cookieStore, $rootScope) {

    this.isLogged = function(){
        return Restangular.one('api/is-logged').get().then(
            function(response){
                return{
                    success: true
                };
            },
            function(response){
                return{
                    success: false
                };
        });
    };

    this.login = function(obj){
        return Restangular.one('/api/login').post('', obj).then(
            function(response){
                response = response.plain();

                // Store auth_token in $cookieStore
                if (response.token) {
                    $cookieStore.put('auth_token', response.token);
                }

                return response;
            },
            function(response){
                return response.data;
        });
    };

    this.register = function(obj){
        return Restangular.one('/api/register').post('', obj).then(
            function(response){
                response = response.plain();
                return response;
            },
            function(response){
                return response.data;
        });
    };

    this.logout = function(){
        $cookieStore.remove('auth_token');
    };

}