/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-separate-glass')
		.controller('SeparateGlassCreateCtrl', SeparateGlassCreateCtrl);

	/** @ngInject */
	function SeparateGlassCreateCtrl($scope, SeparateService, toastr, $rootScope, $location, $window) {
        $scope.glass = {
			name : '',
			image : '',
			size : null,
			unit : '0',
			status : '0'
		};
		$scope.isDisable = true;

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.glass[field] = value;
		}

		// ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.glass.image = file;
			$scope.isDisable = false;
		}

		// =========== function create =================
		$scope.create = function(){
			SeparateService.createGlass($scope.glass, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/separate-glass/detail/'+res.id);
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