/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-separate-glass')
		.controller('SeparateGlassListCtrl', SeparateGlassListCtrl)
		.controller('SeparateGlassListDeleteCtrl', SeparateGlassListDeleteCtrl);

	/** @ngInject */
	function SeparateGlassListCtrl($scope, toastr, SeparateService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listGalss = [];
		$scope.status = true;

		// ================= get list glass ===============
		function getList(){
			SeparateService.getList($rootScope.userLogin.token).success(function(res){
				res.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listGalss = res;
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

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/manager-drink/separate-glass/list/confirm-delete.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'SeparateGlassListDeleteCtrl',
            });
		}

		// ============ change Switch ==============
		$scope.countSwitch = 0;
		$scope.changeSwitch = function (data) {
			$scope.countSwitch ++;
			if($scope.countSwitch == 2){
				$scope.countSwitch = 0;
				var _obj = {
					id : data.id,
					status : data.status ? 0 : 10
				};

				SeparateService.changeStatusGlass(_obj, $rootScope.userLogin.token).success(function(res){
					toastr.success('Change status success!');
					getList();
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
		
	};

	// ======================================================
	// ========== ************************ ==================
	// ======================================================
	function SeparateGlassListDeleteCtrl($scope, toastr, SeparateService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			SeparateService.getList($rootScope.userLogin.token).success(function(res){
				res.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listGalss = res;
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

		

		// =========== function delete glass =============
		$scope.remove = function(data){
			SeparateService.deleteGlass(data.id, $rootScope.userLogin.token).success(function(res){
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
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