/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-categories', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-categories', {
			url: '/manager-drink/categories/create',
			title: 'Categories / Create',
			templateUrl: 'app/pages/manager-drink/categories/create/create.html',
			controller: 'CategoriesCreateCtrl',
		});
	}

})();
