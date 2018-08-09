/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-drink-types', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-drink-types', {
			url: '/manager-drink/drink-types/detail/:id',
			title: 'Ingredient Brand / Detail',
			templateUrl: 'app/pages/manager-drink/drink-types/detail/detail.html',
			controller: 'DrinkTypesDetailCtrl',
		});
		
	}

})();
