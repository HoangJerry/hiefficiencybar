/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.profile')
		.controller('ProfileModalCtrl', ProfileModalCtrl);

	/** @ngInject */
	function ProfileModalCtrl($scope, $uibModalInstance, ProfileService, token, toastr) {
		$scope.data_password = {
			old_password: '',
			new_password: '',
			res_password: ''
		};
		$scope.isConfirm = true;
		$scope.isActive = true;

		$scope.updateProfile = function (field, value) {
			if (String(value).length > 5) {
				$scope.isActive = false;
			}
			$scope.data_password[field] = value;
		}

		$scope.confirmPassword = function (new_pass, res_pass) {
			if (new_pass === res_pass) {
				$scope.data_password.new_password = $scope.data_password.res_password = new_pass;
				$scope.isConfirm = false;
			}
		}

		$scope.option = {
			"autoDismiss": false,
			"positionClass": "toast-bottom-right",
			"type": "success",
			"timeOut": "5000",
			"extendedTimeOut": "2000",
			"allowHtml": false,
			"closeButton": false,
			"tapToDismiss": false,
			"progressBar": false,
			"newestOnTop": false,
			"maxOpened": 0,
			"preventDuplicates": false,
			"preventOpenDuplicates": false
		};

		$scope.save = function () {
			var data_body = {
				old_password: $scope.data_password.old_password,
				new_password: $scope.data_password.new_password
			};
			ProfileService.changePassword(data_body, token).success(function (res) {
				toastr.success('', 'Change password success!', $scope.option);
				$uibModalInstance.close($scope.link);
			});

		};
	}

})();