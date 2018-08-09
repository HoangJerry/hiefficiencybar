/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-user', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {

		$stateProvider.state('list-user', {
			url: '/manager-user/list-user',
			title: 'List User',
			templateUrl: 'app/pages/manager-user/list-user.html',
			controller: 'ManagerUserCtrl',
		});
		$stateProvider.state('user-detail', {
			url: '/manager-user/user-detail/:id',
			title: 'User Detail',
			templateUrl: 'app/pages/manager-user/user-detail/user-detail.html',
			controller: 'UserDetailCtrl',
		});
	}

})();
