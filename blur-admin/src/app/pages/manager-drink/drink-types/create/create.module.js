/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-drink-types', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-drink-types', {
			url: '/manager-drink/drink-types/create',
			title: 'Drink Types / Create',
			templateUrl: 'app/pages/manager-drink/drink-types/create/create.html',
			controller: 'DrinkTypesCreateCtrl',
		});
	}

})();
