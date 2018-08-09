/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-garnish', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-garnish', {
			url: '/manager-drink/garnish/list',
			title: 'Garnish / List',
			templateUrl: 'app/pages/manager-drink/garnish/list/list.html',
			controller: 'GarnishListCtrl',
		});
		
	}

})();
