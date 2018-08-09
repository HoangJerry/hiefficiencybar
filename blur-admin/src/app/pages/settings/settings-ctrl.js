/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.settings')
		.controller('SettingsCtrl', SettingsCtrl);

	/** @ngInject */
	function SettingsCtrl($stateParams, $scope, SettingsService, toastr, $rootScope, $location, $window, $uibModal) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id: $scope.paramt_id
		};
		$scope.isDisable = true;
		$rootScope.ingredients = [];
		$rootScope.robotId = 0;

		// ========= function get data glass by id ===========
		function getElement() {
			SettingsService.getElement(1, $rootScope.userLogin.token).success(function (res) {
				// res.status = String(res.status);
				// res.status = res.status === 0 ? true : false;
				res.fee_unit = String(res.fee_unit);
				$scope.detail = res;
				// $rootScope.robotId = res.id;
			}).error(function (err, status, res) {
				if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
			})
		}

		getElement();

		// ========== function change from ===============
		$scope.changeInfo = function (field, value) {
			if(field === 'status'){
				value = value ? 0 : 10;
			}
			$scope.data_detail[field] = value;
		}


		// =========== function create =================
		$scope.save = function () {
			$scope.data_detail.ingredients = $rootScope.ingredients;
			SettingsService.updated($scope.data_detail, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Updated success!');
				// setTimeout(function () {
				// 	res.id > 0 && ($window.location.href = '#/robot/list');
				// }, 300);
			}).error(function (err, status, res) {
				if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
			})
		}

	}

})();