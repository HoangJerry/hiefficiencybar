/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-separate-glass', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('detail-separate-glass', {
			url: '/manager-drink/separate-glass/detail/:id',
			title: 'Separate Glass / Detail',
			templateUrl: 'app/pages/manager-drink/separate-glass/detail/detail.html',
			controller: 'SeparateGlassDetailCtrl',
		});
		
	}

})();
