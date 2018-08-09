/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.import-robot', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('import-robot', {
			url: '/robot/import/',
			title: 'Robot / Import',
			templateUrl: 'app/pages/robot/import/import.html',
			controller: 'RobotImportHistoryCtrl',
		});
		
	}

})();
