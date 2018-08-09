/**
 * @author a.demeshko
 * created on 21.01.2016
 */
 (function () {
 	'use strict';

 	angular.module('BlurAdmin.pages.hmi')
 	.controller('HMICtrl', HMICtrl)
 	.controller('HMIOrderCtrl', HMIOrderCtrl)
 	.controller('HMIUserCtrl', HMIUserCtrl)
 	.controller('HMIDeleteCtrl', HMIDeleteCtrl);

 	/** @ngInject */
 	function HMICtrl($scope, toastr, HMIService, $rootScope, $location, $window, $uibModal, $timeout, baConfig, layoutPaths, $element) {
 		

		getDataChartOrder();

		function getDataChartOrder(){
			HMIService.getDataChartOrder().success(function(res){
				console.log(res);
			}).error(function(err, stt, res){
				console.log(res);
				toastr.error(err.detail)
			})
		}
	}

	// controler IngredientBrandListDeleteCtrl
	function HMIUserCtrl($scope, toastr, HMIService, $rootScope, $location, $window, $uibModal, $timeout, baConfig, layoutPaths, $element){
		var layoutColors = baConfig.colors;
    	
 		var chart = AmCharts.makeChart('userChart', {
 			"type": "serial",
 			"theme": "none",
 			"color": layoutColors.defaultText,
 			"dataDateFormat": "YYYY",
 			"precision": 2,
 			"valueAxes": [{
 				color: layoutColors.defaultText,
 				axisColor: layoutColors.defaultText,
 				gridColor: layoutColors.defaultText,
 				"id": "v1",
 				"title": "Sales",
 				"position": "left",
 				"autoGridCount": false,
 				"labelFunction": function(value) {
 					return "$" + Math.round(value) + "M";
 				}
 			}, {
 				color: layoutColors.defaultText,
 				axisColor: layoutColors.defaultText,
 				gridColor: layoutColors.defaultText,
 				"id": "v2",
 				"title": "Market Days",
 				"gridAlpha": 0,
 				"position": "right",
 				"autoGridCount": false
 			}],
 			"graphs": [{
 				"id": "g3",
 				color: layoutColors.defaultText,
 				"valueAxis": "v1",
 				"lineColor": layoutColors.primaryLight,
 				"fillColors": layoutColors.primaryLight,
 				"fillAlphas": 0.8,
 				"lineAlpha": 0.8,
 				"type": "column",
 				"title": "Actual Sales",
 				"valueField": "sales2",
 				"clustered": false,
 				"columnWidth": 0.5,
 				"lineColorField" : layoutColors.defaultText,
 				"legendValueText": "$[[value]]M",
 				"balloonText": "[[title]]<br/><b style='font-size: 130%'>$[[value]]M</b>"
 			}, {
 				"id": "g4",
 				"valueAxis": "v1",
 				color: layoutColors.defaultText,
 				"lineColor": layoutColors.primary,
 				"fillColors": layoutColors.primary,
 				"fillAlphas": 0.9,
 				"lineAlpha": 0.9,
 				"type": "column",
 				"title": "Target Sales",
 				"valueField": "sales1",
 				"clustered": false,
 				"columnWidth": 0.3,
 				"legendValueText": "$[[value]]M",
 				"balloonText": "[[title]]<br/><b style='font-size: 130%'>$[[value]]M</b>"
 			}, {
 				"id": "g1",
 				"valueAxis": "v2",
 				"bullet": "round",
 				"bulletBorderAlpha": 1,
 				"bulletColor": layoutColors.defaultText,
 				color: layoutColors.defaultText,
 				"bulletSize": 5,
 				"hideBulletsCount": 50,
 				"lineThickness": 2,
 				"lineColor": layoutColors.danger,
 				"type": "smoothedLine",
 				"title": "Market Days",
 				"useLineColorForBulletBorder": true,
 				"valueField": "market1",
 				"balloonText": "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
 			}, {
 				"id": "g2",
 				"valueAxis": "v2",
 				color: layoutColors.defaultText,
 				"bullet": "round",
 				"bulletBorderAlpha": 1,
 				"bulletColor": layoutColors.defaultText,
 				"bulletSize": 5,
 				"hideBulletsCount": 50,
 				"lineThickness": 2,
 				"lineColor": layoutColors.warning,
 				"type": "smoothedLine",
 				"dashLength": 5,
 				"title": "Market Days ALL",
 				"useLineColorForBulletBorder": true,
 				"valueField": "market2",
 				"balloonText": "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
 			}],
 			"chartScrollbar": {
 				"graph": "g1",
 				"oppositeAxis": false,
 				"offset": 30,
 				gridAlpha: 0,
 				color: layoutColors.defaultText,
 				scrollbarHeight: 50,
 				backgroundAlpha: 0,
 				selectedBackgroundAlpha: 0.05,
 				selectedBackgroundColor: layoutColors.defaultText,
 				graphFillAlpha: 0,
 				autoGridCount: true,
 				selectedGraphFillAlpha: 0,
 				graphLineAlpha: 0.2,
 				selectedGraphLineColor: layoutColors.defaultText,
 				selectedGraphLineAlpha: 1
 			},
 			"chartCursor": {
 				"pan": true,
 				"cursorColor" : layoutColors.danger,
 				"valueLineEnabled": true,
 				"valueLineBalloonEnabled": true,
 				"cursorAlpha": 0,
 				"valueLineAlpha": 0.2
 			},
 			"categoryField": "year",
 			"categoryAxis": {
 				"axisColor": layoutColors.defaultText,
 				"color": layoutColors.defaultText,
 				"gridColor": layoutColors.defaultText,
 				"parseDates": true,
 				"dashLength": 1,
 				"minorGridEnabled": true
 			},
 			"legend": {
 				"useGraphSettings": true,
 				"position": "top",
 				"color": layoutColors.defaultText
 			},
 			"balloon": {
 				"borderThickness": 1,
 				"shadowAlpha": 0
 			},
 			"export": {
 				"enabled": true
 			},
 			"dataProvider": [
 			{
 				"year": "2013",
 				"market1": 71,
 				"market2": 75,
 				"sales1": 5,
 				"sales2": 8
 			}, 
 			{
 				"year": "2014",
 				"market1": 74,
 				"market2": 78,
 				"sales1": 4,
 				"sales2": 6
 			}, 
 			{
 				"year": "2015",
 				"market1": 78,
 				"market2": 88,
 				"sales1": 5,
 				"sales2": 2
 			}, 
 			{
 				"year": "2016",
 				"market1": 85,
 				"market2": 89,
 				"sales1": 8,
 				"sales2": 9
 			}, 
 			{
 				"year": "2017",
 				"market1": 82,
 				"market2": 89,
 				"sales1": 9,
 				"sales2": 6
 			}, 
 			{
 				"year": "2018",
 				"market1": 83,
 				"market2": 85,
 				"sales1": 3,
 				"sales2": 5
 			}, 
 			// {
 			// 	"date": "2013-01-22",
 			// 	"market1": 88,
 			// 	"market2": 92,
 			// 	"sales1": 5,
 			// 	"sales2": 7
 			// }, 
 			// {
 			// 	"date": "2013-01-23",
 			// 	"market1": 85,
 			// 	"market2": 90,
 			// 	"sales1": 7,
 			// 	"sales2": 6
 			// }, 
 			// {
 			// 	"date": "2013-01-24",
 			// 	"market1": 85,
 			// 	"market2": 91,
 			// 	"sales1": 9,
 			// 	"sales2": 5
 			// }, 
 			// {
 			// 	"date": "2013-01-25",
 			// 	"market1": 80,
 			// 	"market2": 84,
 			// 	"sales1": 5,
 			// 	"sales2": 8
 			// }, 
 			// {
 			// 	"date": "2013-01-26",
 			// 	"market1": 87,
 			// 	"market2": 92,
 			// 	"sales1": 4,
 			// 	"sales2": 8
 			// }, 
 			// {
 			// 	"date": "2013-01-27",
 			// 	"market1": 84,
 			// 	"market2": 87,
 			// 	"sales1": 3,
 			// 	"sales2": 4
 			// }, 
 			// {
 			// 	"date": "2013-01-28",
 			// 	"market1": 83,
 			// 	"market2": 88,
 			// 	"sales1": 5,
 			// 	"sales2": 7
 			// }, 
 			// {
 			// 	"date": "2013-01-29",
 			// 	"market1": 84,
 			// 	"market2": 87,
 			// 	"sales1": 5,
 			// 	"sales2": 8
 			// }, 
 			// {
 			// 	"date": "2013-01-30",
 			// 	"market1": 81,
 			// 	"market2": 85,
 			// 	"sales1": 4,
 			// 	"sales2": 7
 			// }
 			],
 			pathToImages: layoutPaths.images.amChart
 		});

		
	}

	// controler IngredientBrandListDeleteCtrl
	function HMIOrderCtrl($scope, toastr, HMIService, $rootScope, $location, $window, $uibModal, $timeout, baConfig, layoutPaths, $element){
		var layoutColors = baConfig.colors;

		var areaChart = AmCharts.makeChart('orderChart', {
			type: 'serial',
			theme: 'blur',
			color: layoutColors.defaultText,
			dataProvider: [
			{
				lineColor: layoutColors.info,
				date: '2012-01-01',
				duration: 408
			},
			{
				date: '2012-01-02',
				duration: 482
			},
			{
				date: '2012-01-03',
				duration: 562
			},
			{
				date: '2012-01-04',
				duration: 379
			},
			{
				lineColor: layoutColors.warning,
				date: '2012-01-05',
				duration: 501
			},
			{
				date: '2012-01-06',
				duration: 443
			},
			{
				date: '2012-01-07',
				duration: 405
			},
			{
				date: '2012-01-08',
				duration: 309,
				lineColor: layoutColors.danger
			},
			{
				date: '2012-01-09',
				duration: 287
			},
			{
				date: '2012-01-10',
				duration: 485
			},
			{
				date: '2012-01-11',
				duration: 890
			},
			{
				date: '2012-01-12',
				duration: 810
			}
			],
			balloon: {
				cornerRadius: 6,
				horizontalPadding: 15,
				verticalPadding: 10
			},
			valueAxes: [
			{
				duration: 'mm',
				durationUnits: {
					hh: 'h ',
					mm: 'min'
				},
				gridAlpha: 0.5,
				gridColor: layoutColors.border,
			}
			],
			graphs: [
			{
				bullet: 'square',
				bulletBorderAlpha: 1,
				bulletBorderThickness: 1,
				fillAlphas: 0.5,
				fillColorsField: 'lineColor',
				legendValueText: '[[value]]',
				lineColorField: 'lineColor',
				title: 'duration',
				valueField: 'duration'
			}
			],

			chartCursor: {
				categoryBalloonDateFormat: 'YYYY MMM DD',
				cursorAlpha: 0,
				fullWidth: true
			},
			dataDateFormat: 'YYYY-MM-DD',
			categoryField: 'date',
			categoryAxis: {
				dateFormats: [
				{
					period: 'DD',
					format: 'DD'
				},
				{
					period: 'WW',
					format: 'MMM DD'
				},
				{
					period: 'MM',
					format: 'MMM'
				},
				{
					period: 'YYYY',
					format: 'YYYY'
				}
				],
				parseDates: true,
				autoGridCount: false,
				gridCount: 50,
				gridAlpha: 0.5,
				gridColor: layoutColors.border,
			},
			export: {
				enabled: true
			},
			pathToImages: layoutPaths.images.amChart
		});
	}

	// controler IngredientBrandListDeleteCtrl
	function HMIDeleteCtrl($scope, toastr, HMIService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		
	}

})();