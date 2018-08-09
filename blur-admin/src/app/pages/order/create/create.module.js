/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-order', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-order', {
			url: '/order/create',
			title: 'Order / Create',
			templateUrl: 'app/pages/order/create/create.html',
			controller: 'OrderCreateCtrl',
		});
	}

})();
