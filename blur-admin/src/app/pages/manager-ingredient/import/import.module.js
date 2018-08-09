/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.import-ingredient', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('import-ingredient', {
			url: '/manager-ingredient/ingredient/import/',
			title: 'Ingredient / Import',
			templateUrl: 'app/pages/manager-ingredient/import/import.html',
			controller: 'IngredientImportHistoryCtrl',
		});
		
	}

})();
