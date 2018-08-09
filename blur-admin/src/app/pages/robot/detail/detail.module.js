/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-robot', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-robot', {
			url: '/robot/detail/:id',
			title: 'Robot / Detail',
			templateUrl: 'app/pages/robot/detail/detail.html',
			controller: 'RobotDetailCtrl',
		});
		
	}

})();
