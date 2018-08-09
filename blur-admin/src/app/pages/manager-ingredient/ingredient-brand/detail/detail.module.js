/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-ingredient-brand', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-ingredient-brand', {
			url: '/manager-ingredient/ingredient-brand/detail/:id',
			title: 'Ingredient Brand / Detail',
			templateUrl: 'app/pages/manager-ingredient/ingredient-brand/detail/detail.html',
			controller: 'IngredientBrandDetailCtrl',
		});
		
	}

})();
