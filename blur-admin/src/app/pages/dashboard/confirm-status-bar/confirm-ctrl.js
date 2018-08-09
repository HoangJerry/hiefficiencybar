/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.theme.components')
		.controller('ChangeStatusBarCtrl', ChangeStatusBarCtrl);

	/** @ngInject */
	function ChangeStatusBarCtrl($uibModalInstance, items, $stateParams, $scope, SettingsService, toastr, $rootScope, $location, $window) {

		$scope.yes = function(){
			SettingsService.updated($rootScope.detail_settings, $rootScope.userLogin.token).success(function(res){
				toastr.success('Change Bar status success!');
				$uibModalInstance.close();
			}).error(function(err, stt, res){
				toastr.error(err.detail)
			})
		}

		$scope.closed = function(){
			$rootScope.detail_settings.bar_status = !items.bar_status;
			$uibModalInstance.close();
		}

	}

})();