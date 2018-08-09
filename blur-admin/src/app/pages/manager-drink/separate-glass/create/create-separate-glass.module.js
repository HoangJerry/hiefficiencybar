/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-separate-glass', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-separate-glass', {
			url: '/manager-drink/separate-glass/create',
			title: 'Separate Glass / Create',
			templateUrl: 'app/pages/manager-drink/separate-glass/create/create-separate-glass.html',
			controller: 'SeparateGlassCreateCtrl',
		});
		
	}

})();
