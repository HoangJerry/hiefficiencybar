/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-categories', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-categories', {
			url: '/manager-drink/categories/list',
			title: 'Categories / List',
			templateUrl: 'app/pages/manager-drink/categories/list/list.html',
			controller: 'CategoriesListCtrl',
		});
		
	}

})();
