/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.tivi-showing', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('tivi-showing', {
			url: '/tivi-showing',
			title: 'Tivi Showing',
			templateUrl: 'app/pages/tivi-showing/tivi.html',
			controller: 'TiviCtrl',
		});
		
	}

})();
