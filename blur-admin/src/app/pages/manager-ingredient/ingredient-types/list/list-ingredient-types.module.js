/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-ingredient-types', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-ingredient-types', {
			url: '/manager-ingredient/ingredient-types/list',
			title: 'Ingredient Types / List',
			templateUrl: 'app/pages/manager-ingredient/ingredient-types/list/list-ingredient-types.html',
			controller: 'IngredientTypesListCtrl',
		});
		
	}

})();
