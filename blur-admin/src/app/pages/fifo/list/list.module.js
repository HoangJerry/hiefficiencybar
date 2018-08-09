/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-fifo', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-fifo', {
			url: '/fifo/list',
			title: 'FIFO',
			templateUrl: 'app/pages/fifo/list/list.html',
			controller: 'FifoListCtrl',
		});
		
	}

})();
