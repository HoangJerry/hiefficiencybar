/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-ingredient')
		.controller('IngredientCreateCtrl', IngredientCreateCtrl);

	/** @ngInject */
	function IngredientCreateCtrl($scope, IngredientService, toastr, $rootScope, $location, $window, $uibModal) {
        $scope.data_create = {
            name : '',
            type : null,
            status : '0',
            price : 0,
            bottles : 0,
            quanlity_of_bottle : 1,
            brand : null,
            image : null,
            background_color:''
        };
        $scope.types = [];
        $rootScope.brands = [];
        $scope.isDisableBrand = true;
        $scope.isDisable = true;
		$scope.isAddElement = {
			type : true,
			brand : true
        };
        $rootScope.create_new_type = undefined;
        $rootScope.create_new_brand = undefined;

        $rootScope.load_page = function(){
            if($rootScope.create_new_type){
                $scope.data_create.type = String($rootScope.create_new_type.id);
                getListType();
                $scope.isDisableBrand = false;
                getListBrand($scope.data_create.type);
            }
            if($rootScope.create_new_brand){
                var _arr = [
                    $rootScope.create_new_brand
                ];
                $rootScope.brands = _arr;
                $scope.data_create.brand = String($rootScope.create_new_brand.id);
            }

        }

        
        
        // =============== function opne modal add type ===========
        $scope.openAddType = function(size){
            var page = 'app/pages/manager-ingredient/ingredient/create/type/create.html';

            $uibModal.open({
				animation: true,
				templateUrl: page,
                size: size,
                controller : 'IngredientCreateNewTypeCtrl'
			});
        }
        
        // =============== function opne modal add brand ===========
        $scope.openAddBrand = function(size){
            var page = 'app/pages/manager-ingredient/ingredient/create/brand/create.html';

            $uibModal.open({
				animation: true,
				templateUrl: page,
                size: size,
                controller : 'IngredientCreateNewBrandCtrl'
			});
        }
        
        // ========== function get list type ============
        function getListType(){
            IngredientService.getListType($rootScope.userLogin.token).success(function(res){
                $scope.types = res;

                $scope.types.length === 0 && ($scope.isAddElement.type = true);
            }).error(function(err, stt, res){
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
        function getListBrand(type){
            IngredientService.getListBrand($rootScope.userLogin.token, type).success(function(res){
                $rootScope.brands = res;

                $rootScope.brands.length === 0 && ($scope.isAddElement.brand = true);
            }).error(function(err, stt, res){
                if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
            });
        }

        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_create.image = file;
			$scope.isDisable = false;
		}

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
            if(field === 'type'){
                $scope.isDisableBrand = false;
                getListBrand($scope.data_create.type)
            }
            $scope.data_create[field] = value;
		}

		// =========== function create =================
		$scope.create = function(){
			IngredientService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-ingredient/ingredient/detail/'+res.id);
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