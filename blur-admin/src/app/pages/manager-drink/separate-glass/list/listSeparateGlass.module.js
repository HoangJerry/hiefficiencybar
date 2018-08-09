/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-separate-glass', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-separate-glass', {
			url: '/manager-drink/separate-glass/list',
			title: 'Glassware / List',
			templateUrl: 'app/pages/manager-drink/separate-glass/list/list-separate-glass.html',
			controller: 'SeparateGlassListCtrl',
		});
		
	}

})();
