/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-history', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-history', {
			url: '/robot/history/create',
			title: 'History / Create',
			templateUrl: 'app/pages/robot/history/create/create.html',
			controller: 'HistoriesCreateCtrl',
		});
	}

})();
