/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-robot')
		.controller('RobotDetailCtrl', RobotDetailCtrl);

	/** @ngInject */
	function RobotDetailCtrl($stateParams, $scope, RobotService, toastr, $rootScope, $location, $window, $uibModal) {
		$rootScope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id: $scope.paramt_id
		};
		$scope.isDisable = true;
		$rootScope.ingredients = [];
		$rootScope.robotId = 0;

		// ========= function get data glass by id ===========
		function getElement() {
			RobotService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function (res) {
				// res.status = String(res.status);
				res.status = res.status === 0 ? true : false;
				$rootScope.detail = res;
				$rootScope.robotId = res.id;
				$rootScope.ingredients = res.ingredients ? res.ingredients : [];
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

		// =========== open modal create ingredient ============
		$scope.openCreateIngredient = function (size) {
			var page = 'app/pages/robot/detail/ingredient/add.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: size,
				controller: 'RobotDetailIngredientCtrl',
			});
		}

		// =========== open modal confirm delete Ingredient ===========
		$scope.confirmDelete = function (data) {
			var page = 'app/pages/manager-drink/drink/create/ingredient/delete.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: 'sm',
				resolve: {
					items: function () {
						return data;
					}
				},
				controller: 'RobotDeleteIngredientCtrl',
			});
		}

		// =========== function create =================
		$scope.save = function () {
			console.log($rootScope.ingredients)
			$scope.data_detail.ingredients = $rootScope.ingredients;
			RobotService.updated($scope.data_detail, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Updated success!');
				setTimeout(function () {
					res.id > 0 && ($window.location.href = '#/robot/list');
				}, 300);
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

		// =========== Open modal graphic =================
		$scope.openGraphic = function(){
            var page = 'app/pages/robot/detail/graphic/index.html';

            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: 'lg',
                // resolve: {
                //     token: function () {
                //         return $scope.currentUser.token;
                //     },
            
                // },
                // controller: 'RobotGraphicCtrl',
            });
        }

	}

})();