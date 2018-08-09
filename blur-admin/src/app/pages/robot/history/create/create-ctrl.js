/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-history')
		.controller('HistoriesCreateCtrl', HistoriesCreateCtrl);

	/** @ngInject */
	function HistoriesCreateCtrl($scope, HistoryService, toastr, $rootScope, $location, $window) {
        $scope.data_create = {
            name : '',
            parent : '',
            image : ''
        };
        $scope.isDisable = true;
        $scope.list_categories = [];

        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_create.image = file;
			$scope.isDisable = false;
		}

        // ================= get list ===============
		function getList(){
			HistoryService.getList($rootScope.userLogin.token).success(function(res){
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

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
		}

		// =========== function create =================
		$scope.create = function(){
            $scope.data_create.slug = $scope.data_create.name;
			HistoryService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-ingredient/history/detail/'+res.id);
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