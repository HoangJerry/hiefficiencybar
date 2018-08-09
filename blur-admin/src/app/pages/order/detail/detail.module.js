/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-order', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-order', {
			url: '/order/detail/:id',
			title: 'Histories / Detail',
			templateUrl: 'app/pages/order/detail/detail.html',
			controller: 'OrderDetailCtrl',
		});
		
	}

})();
