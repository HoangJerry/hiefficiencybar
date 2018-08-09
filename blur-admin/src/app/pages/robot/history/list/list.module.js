/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-history', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-history', {
			url: '/robot/history/list',
			title: 'Histories / List',
			templateUrl: 'app/pages/robot/history/list/list.html',
			controller: 'HistoriesListCtrl',
		});
		
	}

})();
