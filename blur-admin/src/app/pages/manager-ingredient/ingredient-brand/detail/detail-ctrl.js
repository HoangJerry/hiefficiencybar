/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-ingredient-brand')
		.controller('IngredientBrandDetailCtrl', IngredientBrandDetailCtrl);

	/** @ngInject */
	function IngredientBrandDetailCtrl($stateParams, $scope, IngredientBrandService, toastr, $rootScope, $location, $window) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.paramt_id
		};
		
		// ========= function get data glass by id ===========
		function getElement(){
			IngredientBrandService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function(res){
				$scope.detail = res;
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

		getElement();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_detail[field] = value;
		}
		
		// =========== function create =================
		$scope.save = function(){
			IngredientBrandService.updated($scope.data_detail, $rootScope.userLogin.token).success(function(res){
				toastr.success('Updated success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-ingredient/ingredient-brand/list');
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