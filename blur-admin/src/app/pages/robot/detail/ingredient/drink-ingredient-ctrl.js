/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.detail-robot')
        .controller('RobotDetailIngredientCtrl', RobotDetailIngredientCtrl)
        .controller('RobotDeleteIngredientCtrl', RobotDeleteIngredientCtrl);

    /** @ngInject */
    function RobotDetailIngredientCtrl($scope, DrinkService, IngredientService, RobotService, toastr, $rootScope, $location, $window, $uibModalInstance) {
        $scope.offset = 0;
        $scope.list_ingredient = [];
        // $scope.data_create = {
        //     unit: '0',
        //     ratio : 0,
        // };
        $scope.ingredient = null;
        $scope.isDisableBrand = $scope.isDisableIngredient = true;

        $scope.list_robot = [];
        $scope.ingredients = [];
        $scope.data_create = {
            place_number: 0,
            status: 10,
            machine: 1
        }
        $scope.isDisableBrand = true;
        $scope.isDisableIngredient = true;

        // =========== get list ingredient ==============
        function getListIngredient(type, brand) {
            DrinkService.getListIngredient($rootScope.userLogin.token, type, brand).success(function (res) {
                $scope.list_ingredient = res.results;
            })
        }

        // getListIngredient();

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

        // ========== function change from ===============
        // $scope.changeInfo = function (field, value) {
        //     if (field === 'ingredient') {
        //         $scope.ingredient = value;
        //         var _arr = $scope.list_ingredient;
        //         var _val = _arr.filter(function (el) {
        //             return String(el.id) === value;
        //         })[0];
        //         $scope.data_create.ingredient = _val;
        //     } else if (field === 'type') {
        //         $scope.isDisableBrand = false;
        //         $rootScope.brands = [];
        //         $scope.list_ingredient = [];
        //         getListBrand(value)
        //     } else if (field === 'brand') {
        //         $scope.isDisableIngredient = false;
        //         $scope.list_ingredient = [];
        //         getListIngredient($scope.type, $scope.brand);
        //     }
        //     else {
        //         $scope.data_create[field] = value;
        //     }
        // }

        // =========== get list ingredient ==============
        function getListIngredient(type, brand) {
            var _data = {
                filter_type: type,
                filter_brand: brand
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
        function getListRobot() {
            RobotService.getList($rootScope.userLogin.token).success(function (res) {
                $scope.list_robot = res.results;
            }).error(function (err, stt, res) {
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
        $scope.changeInfo = function (field, value) {
            if (field === 'type') {
                $scope.isDisableBrand = false;
                getListBrand(value);
            }
            if (field === 'brand') {
                $scope.isDisableIngredient = false;
                getListIngredient($scope.data_create.type, value);
            }
            $scope.data_create[field] = value;
        }

        // ========== import ==========
        $scope.add = function () {
            RobotService.importHistoryRobo($scope.data_create, $rootScope.userLogin.token).success(function (res) {
                // toastr.success('Import robot success!');
                // $rootScope.robotId = $scope.data_create.machine;
                console.log(res)
                var _obj = {
                    machine: res.machine,
                    creation_date: res.creation_date,
                    id: res.id,
                    place_number: res.place_number,
                    quantity: res.quantity,
                    status: res.status,
                    ingredient: res.ingredient_view
                }
                $rootScope.ingredients.push(_obj);
                $uibModalInstance.close();
                // $window.location.href = '#/robot/history/list';
            }).error(function (err, stt, res) {
                if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
            })
        }

        // ============== add ingredient =============
        // $scope.add = function () {
        //     toastr.success('Add Ingredient success!');
        //     var _obj = $scope.data_create;
        //     console.log($scope.data_create)
        //     $rootScope.ingredients.push(_obj);
        //     $uibModalInstance.close();
        // }
    };

    function RobotDeleteIngredientCtrl($stateParams, items, $scope, DrinkService, IngredientService, RobotService, toastr, $rootScope, $location, $window, $uibModalInstance) {
        $scope.item_del = items;
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

		

        // =========== function delete glass =============
        $scope.remove = function (data) {
            console.log('==> remove')

            RobotService.removedIngredient(items.id, $rootScope.userLogin.token).success(function(res){
                $uibModalInstance.close();
                setTimeout(function() {
                    getElement();
                }, 300)
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error(err.detail)
            });

            // var _arr = $rootScope.garnishs;

            // for (var i = _arr.length; i--;) {
            //     if (_arr[i].garnish.id === items.garnish.id) {
            //         _arr.splice(i, 1);
            //     }
            // }
            // $rootScope.garnishs = _arr;
            // toastr.success('Remove success!');
            // $uibModalInstance.close();

        }
    }

})();