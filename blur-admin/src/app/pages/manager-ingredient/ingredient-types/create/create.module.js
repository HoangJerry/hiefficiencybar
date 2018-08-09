/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-ingredient-types', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-ingredient-types', {
			url: '/manager-ingredient/ingredient-types/create',
			title: 'Ingredient Types / Create',
			templateUrl: 'app/pages/manager-ingredient/ingredient-types/create/create.html',
			controller: 'IngredientTypesCreateCtrl',
		});
		
	}

})();
