/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-ingredient', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-ingredient', {
			url: '/manager-ingredient/ingredient/detail/:id',
			title: 'Ingredient / Detail',
			templateUrl: 'app/pages/manager-ingredient/ingredient/detail/detail.html',
			controller: 'IngredientDetailCtrl',
		});
		
	}

})();
