/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-history-ingredient', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-history-ingredient', {
			url: '/manager-ingredient/history/list',
			title: 'Ingredient Histories / List',
			templateUrl: 'app/pages/manager-ingredient/history/list/list.html',
			controller: 'HistoriesIngredientListCtrl',
		});
		
	}

})();
