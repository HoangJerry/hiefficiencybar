/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-user', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		// var helloState = {
		// 	name: 'hello',
		// 	url: '/hello',
		// 	template: '<h3>hello world!</h3>'
		//   }

		//   var aboutState = {
		// 	name: 'about',
		// 	url: '/about',
		// 	template: '<h3>Its the UI-Router hello world app!</h3>'
		//   }

		//   $stateProvider.state(helloState);
		//   $stateProvider.state(aboutState);



		// $stateProvider.state('list-user', {
		// 	url: '/list-user',
		// 	title: 'List User',
		// 	templateUrl: 'app/pages/manager-user/list-user.html',
		// 	controller: 'ManagerUserCtrl',
		// });
		$stateProvider.state('create-user', {
			url: '/manager-user/create-user',
			title: 'Create User',
			templateUrl: 'app/pages/manager-user/user-create/user-create.html',
			controller: 'UserCreateCtrl',
		});
		// $stateProvider.state('user-detail', {
		// 	url: '/user-detail/:id',
		// 	title: 'User Detail',
		// 	templateUrl: 'app/pages/manager-user/user-detail/user-detail.html',
		// 	controller: 'UserDetailCtrl',
		// });
	}

})();
