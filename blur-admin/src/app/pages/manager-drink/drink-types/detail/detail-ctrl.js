/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-drink-types')
		.controller('DrinkTypesDetailCtrl', DrinkTypesDetailCtrl);

	/** @ngInject */
	function DrinkTypesDetailCtrl($stateParams, $scope, DrinkTypesService, toastr, $rootScope, $location, $window) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.paramt_id
        };
        $scope.isDisable = true;
		
		// ========= function get data glass by id ===========
		function getElement(){
			DrinkTypesService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function(res){
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
        
        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_detail.image = file;
			$scope.isDisable = false;
		}
		
		// =========== function create =================
		$scope.save = function(){
			DrinkTypesService.updated($scope.data_detail, $rootScope.userLogin.token).success(function(res){
				toastr.success('Updated success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/drink-types/list');
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