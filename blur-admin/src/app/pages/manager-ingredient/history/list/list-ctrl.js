/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-history')
		.controller('HistoriesIngredientListCtrl', HistoriesIngredientListCtrl)
		.controller('HistoriesIngredientDeleteCtrl', HistoriesIngredientDeleteCtrl);

	/** @ngInject */
	function HistoriesIngredientListCtrl($scope, toastr, HistoryIngredientService, IngredientService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];

		$scope.maxSize = 10;
        $scope.bigTotalItems = 0;
		$scope.bigCurrentPage = 1;
		// $scope.ingredients = [];
		
		// ================ pagination ====================
        $scope.changePage =  function(page_index){
            $rootScope.offset = page_index > 1 ? ((page_index - 1)*10) : 0;
            getList();
        }

        $scope.selectPage = function(page_number, e){
        }

        // =============== fucntion change status ================
		$scope.changeStatus = function (data) {
			data.active === true ? data.active = false : data.active = true;
			var _obj = {
				id: data.id,
				active: data.active
			}
			HistoryIngredientService.updated(_obj, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Change status success!');
				getList();
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
		
		// ================= get list ===============
		function getList(){
			HistoryIngredientService.getList($rootScope.userLogin.token).success(function(res){
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
			}).error(function(err, status, res){
                $window.location.href = '#/robot/list';
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
			var page = 'app/pages/robot/history/list/confirm/index.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'HistoriesIngredientDeleteCtrl',
            });
		}

	};

	// controler IngredientBrandListDeleteCtrl
	function HistoriesIngredientDeleteCtrl($scope, toastr, HistoryIngredientService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			HistoryIngredientService.getList($rootScope.userLogin.token).success(function(res){
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
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
			HistoryIngredientService.removed(data.id, $rootScope.userLogin.token).success(function(res){
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