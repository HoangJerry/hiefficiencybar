/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-garnish', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-garnish', {
			url: '/manager-drink/garnish/create',
			title: 'Garnish / Create',
			templateUrl: 'app/pages/manager-drink/garnish/create/create.html',
			controller: 'GarnishCreateCtrl',
		});
	}

})();
