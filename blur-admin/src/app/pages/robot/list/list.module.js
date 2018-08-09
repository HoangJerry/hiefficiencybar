/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-robot', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-robot', {
			url: '/robot/list',
			title: 'Robot / List',
			templateUrl: 'app/pages/robot/list/list.html',
			controller: 'RobotListCtrl',
		});
		
	}

})();
