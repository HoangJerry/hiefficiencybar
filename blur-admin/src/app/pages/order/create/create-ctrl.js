/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-order')
		.controller('OrderCreateCtrl', OrderCreateCtrl);

	/** @ngInject */
	function OrderCreateCtrl($scope, OrderService, ManagerUserService, RobotService, toastr, $rootScope, $location, $window) {
        $scope.data_create = {
            transaction_code : '',
            transaction_id : '',
            payer_firstname : '',
            payer_lastname : '',
            payer_email : '',
			tray_number : '',
			slug : ''
        };
        $scope.isDisable = true;
		$scope.list_categories = [];
		$scope.list_users = [];
		$scope.list_robot = [];

        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_create.image = file;
			$scope.isDisable = false;
		}

        // ================= get list ===============
		function getList(){
			OrderService.getList($rootScope.userLogin.token).success(function(res){
				$scope.list_categories = res;
			}).error(function(err, status, res){
				if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
			});
		}

		getList();

		// =========== list user =============
		function getListUser(){
			var offset = 0;
			ManagerUserService.getAllUser($rootScope.userLogin.token, offset).success(function(res){
				$scope.list_users = res.results;
			}).error(function(err, stt, res){
				toastr(err.detail);
			})
		}

		getListUser();

		// =========== list robot ================
		function getListRobot() {
			RobotService.getList($rootScope.userLogin.token).success(function(res){
				$scope.list_robot = res.results;
			}).error(function(err, stt, res){
				if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
			})
		}

		getListRobot();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
		}

		// =========== function create =================
		$scope.create = function(){
            $scope.data_create.slug = $scope.data_create.user;
			OrderService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/order/detail/'+res.id);
				}, 300);
			}).error(function(err, status, res){
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