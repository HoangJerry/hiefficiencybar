/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-garnish', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-garnish', {
			url: '/manager-drink/garnish/detail/:id',
			title: 'Garnish / Detail',
			templateUrl: 'app/pages/manager-drink/garnish/detail/detail.html',
			controller: 'GarnishDetailCtrl',
		});
		
	}

})();
