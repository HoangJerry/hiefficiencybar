/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-categories', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-categories', {
			url: '/manager-drink/categories/detail/:id',
			title: 'Categories / Detail',
			templateUrl: 'app/pages/manager-drink/categories/detail/detail.html',
			controller: 'CategoriesDetailCtrl',
		});
		
	}

})();
