/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-drink', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-drink', {
			url: '/manager-drink/drink/detail/:id',
			title: 'Drink / Detail',
			templateUrl: 'app/pages/manager-drink/drink/detail/detail.html',
			controller: 'DrinkDetailCtrl',
		});
		
	}

})();
