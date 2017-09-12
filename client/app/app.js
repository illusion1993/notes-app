angular
.module('NotesApp', ['ngMaterial', 'ngRoute', 'ngCookies', 'restangular', 'ui.router', 'ngCookies'])
.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', '$locationProvider', '$mdIconProvider', configFn])
.run(['$rootScope', '$location', '$cookieStore', 'Restangular', runFn]);

function configFn($stateProvider, $urlRouterProvider, RestangularProvider, $locationProvider, $mdIconProvider){
	
	RestangularProvider.setBaseUrl('http://localhost:8000');
	$locationProvider.html5Mode({ enabled: true, requireBase: false });
	$mdIconProvider.fontSet('md', 'material-icons');

	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('Home', {
			url: '/',
			controller: 'HomeController'
		})
		.state('Login', {
			url: '/login',
			controller: 'LoginController',
			templateUrl: 'app/views/login.view.html'
		})
		.state('Register', {
			url: '/register',
			controller: 'RegisterController',
			templateUrl: 'app/views/register.view.html'
		})
		.state('Dashboard', {
			url: '/dashboard',
			controller: 'DashboardController',
			templateUrl: 'app/views/dashboard.view.html',
			params: { dashboard: null }
		})
}

function runFn($rootScope, $location, $cookieStore, Restangular) {
	
	Restangular.addRequestInterceptor(function(element, operation, what, url) {
		var auth_token = $cookieStore.get('auth_token');
		if (auth_token) {
			console.log('Restangular Interceptor: Found auth_token in cookies, adding token in header');
			Restangular.setDefaultHeaders({'Authorization': auth_token});
		}
		else {
			console.log('Restangular Interceptor: Not found auth_token in cookies, not adding token in header');
			Restangular.setDefaultHeaders({});
		}
		return element;
	});
}