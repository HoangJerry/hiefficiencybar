/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-order', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-order', {
			url: '/order/list',
			title: 'Order History',
			templateUrl: 'app/pages/order/list/list.html',
			controller: 'OrderListCtrl',
		});
		
	}

})();
