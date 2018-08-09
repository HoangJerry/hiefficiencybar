/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.import-ingredient')
		.controller('IngredientImportHistoryCtrl', IngredientImportHistoryCtrl);

	/** @ngInject */
	function IngredientImportHistoryCtrl($stateParams, $scope, RobotService, IngredientService, DrinkService, toastr, $rootScope, $location, $window, $uibModal) {
        $scope.ingredients = [];
        $scope.data_create = {
            quantity : 0,
            status : 0
        }
        $scope.isDisableBrand = true;
        $scope.isDisableIngredient = true;

         // =========== get list ingredient ==============
         function getListIngredient(type, brand) {
            var _data = {
                filter_type : type,
                filter_brand : brand
            };
            IngredientService.filterData(_data, $rootScope.userLogin.token).success(function (res) {
                $scope.list_ingredient = res.results;
            })
        }

        // ========== function get list type ============
        function getListType() {
            $scope.types = [];
            $scope.list_ingredient = [];
            $rootScope.brands = [];
            IngredientService.getListType($rootScope.userLogin.token).success(function (res) {
                $scope.types = res;
                $scope.types.length === 0 && ($scope.isAddElement.type = true);
            }).error(function (err, stt, res) {
                console.log(res)
                toastr.error('Error!');
            });
        }

        getListType();

        // ============ function get list brand ===========
        function getListBrand(type) {
            $scope.list_ingredient = [];
            $rootScope.brands = [];
            DrinkService.getListBrand($rootScope.userLogin.token, type).success(function (res) {
                $rootScope.brands = res;
                $rootScope.brands.length === 0 && ($scope.isAddElement.brand = true);
            }).error(function (err, stt, res) {
                console.log(res)
                toastr.error('Error!');
            });
        }

        // ========== function change from ===============
		$scope.changeInfo = function(field, value){
            if(field === 'type'){
                getListBrand(value);
                $scope.isDisableBrand = false;
            }
            if(field === 'brand'){
                $scope.isDisableIngredient = false;
                getListIngredient($scope.data_create.type, value);
            }
            $scope.data_create[field] = value;
		}

        // ========== import ==========
        $scope.import = function(){
            RobotService.importHistoryRobo($scope.data_create, $rootScope.userLogin.token).success(function(res){
                toastr.success('Import robot success!');
                $rootScope.robotId = $scope.data_create.machine;
                $window.location.href = '#/manager-ingredient/history/list';
            }).error(function(err, stt, res){
                toastr.error('Error!');
            })
        }

	}

})();