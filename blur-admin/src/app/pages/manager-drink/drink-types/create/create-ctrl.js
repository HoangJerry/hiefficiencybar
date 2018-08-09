/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-drink-types')
		.controller('DrinkTypesCreateCtrl', DrinkTypesCreateCtrl);

	/** @ngInject */
	function DrinkTypesCreateCtrl($scope, DrinkTypesService, toastr, $rootScope, $location, $window) {
        $scope.data_create = {
            name : '',
            image : null
        };
        $scope.isDisable = true;

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
        }

        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_create.image = file;
            $scope.isDisable = false;
		}

		// =========== function create =================
		$scope.create = function(){
			DrinkTypesService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/drink-types/detail/'+res.id);
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