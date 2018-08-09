/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.hmi', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('hmi', {
			url: '/hmi',
			title: 'HMI',
			templateUrl: 'app/pages/hmi/hmi.html',
			controller: 'HMICtrl',
		});
		
	}

})();
