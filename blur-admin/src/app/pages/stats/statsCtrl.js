/**
 * @author a.demeshko
 * created on 12/16/15
 */
 (function () {
 	'use strict';

 	angular.module('BlurAdmin.pages.stats')
 	.controller('StatsCtrl', StatsCtrl);

 	/** @ngInject */
 	function StatsCtrl($scope, $window, baConfig, StatsService, toastr, $rootScope) {
 		var layoutColors = baConfig.colors;
 		$scope.colors = [layoutColors.primary, layoutColors.warning, layoutColors.danger, layoutColors.info, layoutColors.success, layoutColors.primaryDark];
 		$scope.filterOrder = 'month';
 		$scope.filterUser = 'month';

 		getDataChartOrder($scope.filterOrder);
 		getDataChartUser($scope.filterUser);

 		$scope.changeFilterOrder = function (value){
 			if(value !== $scope.filterOrder){
 				$scope.filterOrder = value;
 				getDataChartOrder(value);
 			}
 		}

 		$scope.changeFilterUser = function (value){
 			if(value !== $scope.filterUser){
 				$scope.filterUser = value;
 				getDataChartUser(value);
 			}
 		}

 		function getDataChartOrder(data){
 			StatsService.getDataChartOrder(data).success(function(res){
 				$scope.lineData = res.result;
 			}).error(function(err, stt, res){
 				$scope.lineData = [];
 				toastr.error(err.detail);
 			});
 		}

 		function getDataChartUser(data){
 			StatsService.getDataChartUser(data).success(function(res){
 				$scope.barData = res.result;
 			}).error(function(err, stt, res){
 				toastr.error(err.detail);
 			});
 		}

 		// $scope.lineData = [
	 	// 	{
	 	// 		count: 1, 
		 // 		drink_order: 1, 
		 // 		income_order: 7,
		 // 		month: "2018-6"
		 // 	},
	 	// 	{
	 	// 		count: 7, 
		 // 		drink_order: 6, 
		 // 		income_order: 6,
		 // 		month: "2018-7"
		 // 	},
	 	// 	{
	 	// 		count: 2, 
		 // 		drink_order: 4, 
		 // 		income_order: 8,
		 // 		month: "2018-8",
		 // 	},
	 	// 	{
	 	// 		count: 5, 
		 // 		drink_order: 8, 
		 // 		income_order: 2,
		 // 		month: "2018-9"
		 // 	}

	 	// 	// {count: "2007", drink_order: 75, income_order: 65},
	 	// 	// {count: "2008", drink_order: 50, income_order: 40},
	 	// 	// {count: "2009", drink_order: 75, income_order: 65},
	 	// 	// {count: "2010", drink_order: 50, income_order: 40},
	 	// 	// {count: "2011", drink_order: 75, income_order: 65},
	 	// 	// {count: "2012", drink_order: 100, income_order: 90}
 		// ];
 		// $scope.areaData = [
	 	// 	{y: "2006", a: 100, b: 90},
	 	// 	{y: "2007", a: 75, b: 65},
	 	// 	{y: "2008", a: 50, b: 40},
	 	// 	{y: "2009", a: 75, b: 65},
	 	// 	{y: "2010", a: 50, b: 40},
	 	// 	{y: "2011", a: 75, b: 65},
	 	// 	{y: "2012", a: 100, b: 90}
 		// ];
 		// $scope.barData = [
	 	// 	{y: "2006", a: 100, b: 90},
	 	// 	{y: "2007", a: 75, b: 65},
	 	// 	{y: "2008", a: 50, b: 40},
	 	// 	{y: "2009", a: 75, b: 65},
	 	// 	{y: "2010", a: 50, b: 40},
	 	// 	{y: "2011", a: 75, b: 65},
	 	// 	{y: "2012", a: 100, b: 90}
 		// ];

 		angular.element($window).bind('resize', function () {
 		});
 	}

})();