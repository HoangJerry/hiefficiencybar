/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.order-carts', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {		
		$stateProvider.state('carts', {
			url: '/order/carts',
			title: 'Order / Carts',
			templateUrl: 'app/pages/order/cart/cart.html',
			controller: 'OrderCartsCtrl',
		});
	}

})();
