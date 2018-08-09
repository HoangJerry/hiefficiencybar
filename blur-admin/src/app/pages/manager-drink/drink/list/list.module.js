/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-drink', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-drink', {
			url: '/manager-drink/drink/list',
			title: 'Drink / List',
			templateUrl: 'app/pages/manager-drink/drink/list/list.html',
			controller: 'DrinkListCtrl',
		});
		
	}

})();
