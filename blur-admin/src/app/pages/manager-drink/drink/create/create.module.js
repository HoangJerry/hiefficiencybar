/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-drink', ['ui.multiselect', 'angularjs-dropdown-multiselect'])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-drink', {
			url: '/manager-drink/drink/create',
			title: 'Drink / Create',
			templateUrl: 'app/pages/manager-drink/drink/create/create.html',
			controller: 'DrinkCreateCtrl',
		});
	}

})();
