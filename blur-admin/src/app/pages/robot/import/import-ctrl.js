/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.import-robot')
		.controller('RobotImportHistoryCtrl', RobotImportHistoryCtrl);

	/** @ngInject */
	function RobotImportHistoryCtrl($stateParams, $scope, RobotService, DrinkService, IngredientService, toastr, $rootScope, $location, $window, $uibModal) {
        $scope.list_robot = [];
        $scope.ingredients = [];
        $scope.data_create = {
            place_number : 0,
            status : 10
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
                if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
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
                if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
            });
        }

        
        // ============ get list robot ===========
        function getListRobot(){
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


        // // ========== function change from ===============
		// $scope.changeInfo = function(field, value){
        //     $scope.data_create[field] = value;
        // }
        
        // ========== function change from ===============
		$scope.changeInfo = function(field, value){
            if(field === 'type'){
                $scope.isDisableBrand = false;
                getListBrand(value);
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
                $window.location.href = '#/robot/history/list';
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

	}

})();