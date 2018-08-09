/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-drink-types', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-drink-types', {
			url: '/manager-drink/drink-types/list',
			title: 'Drink Types / List',
			templateUrl: 'app/pages/manager-drink/drink-types/list/list.html',
			controller: 'DrinkTypesListCtrl',
		});
		
	}

})();
