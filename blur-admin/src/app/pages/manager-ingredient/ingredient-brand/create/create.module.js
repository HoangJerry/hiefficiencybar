/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-ingredient-brand', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-ingredient-brand', {
			url: '/manager-ingredient/ingredient-brand/create',
			title: 'Ingredient Brand / Create',
			templateUrl: 'app/pages/manager-ingredient/ingredient-brand/create/create.html',
			controller: 'IngredientBrandCreateCtrl',
		});
	}

})();
