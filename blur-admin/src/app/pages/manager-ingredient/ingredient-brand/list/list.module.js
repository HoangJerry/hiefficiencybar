/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-ingredient-brand', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-ingredient-brand', {
			url: '/manager-ingredient/ingredient-brand/list',
			title: 'Ingredient Brand / List',
			templateUrl: 'app/pages/manager-ingredient/ingredient-brand/list/list.html',
			controller: 'IngredientBrandListCtrl',
		});
		
	}

})();
