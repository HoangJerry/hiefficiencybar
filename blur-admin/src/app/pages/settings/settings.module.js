/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.settings', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('settings', {
			url: '/settings',
			title: 'Settings',
			templateUrl: 'app/pages/settings/settings.html',
			controller: 'SettingsCtrl',
		});
		
	}

})();
