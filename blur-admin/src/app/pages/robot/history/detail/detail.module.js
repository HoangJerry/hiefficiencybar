/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-history', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-history', {
			url: '/robot/history/detail/:id',
			title: 'Histories / Detail',
			templateUrl: 'app/pages/robot/history/detail/detail.html',
			controller: 'HistoriesDetailCtrl',
		});
		
	}

})();
