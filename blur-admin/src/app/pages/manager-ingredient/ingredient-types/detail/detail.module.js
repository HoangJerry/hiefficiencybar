/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-ingredient-types', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-ingredient-types', {
			url: '/manager-ingredient/ingredient-types/detail/:id',
			title: 'Ingredient Types / Detail',
			templateUrl: 'app/pages/manager-ingredient/ingredient-types/detail/detail.html',
			controller: 'IngredientTypesDetailCtrl',
		});
		
	}

})();
