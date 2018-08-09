/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-ingredient')
		.controller('IngredientListCtrl', IngredientListCtrl)
		.controller('IngredientDeleteCtrl', IngredientDeleteCtrl);

	/** @ngInject */
	function IngredientListCtrl($scope, toastr, IngredientService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];

		$scope.maxSize = 10;
		$scope.bigTotalItems = 0;
		$scope.bigCurrentPage = 1;
		$rootScope.offset = 0;

		$scope.types = [];
		$scope.filter_types = [];
		$scope.brands = [];
		$scope.filter_brands = [];
		$scope.keywork = '';
		$scope.data_filter = {
			filter_brand: '',
			filter_type: ''
		};
		$scope.isShowFilterBrand = false;
		$scope.keywork='';

		// ============ filter ====================
		$scope.changeFilter = function (field, value) {
			$scope.data_filter[field] = value;
			if (field === 'filter_type') {
				getListBrand(value);
				$scope.isShowFilterBrand = true;
				returnDataFilter($scope.data_filter)
			}

			if(field === 'filter_brand' & value === ''){
				returnDataFilter($scope.data_filter);
			}

			if($scope.data_filter.filter_brand !== '' && $scope.data_filter.filter_type !== ''){
				returnDataFilter($scope.data_filter);
			}
		}

		// ============= change keywork ============
		$scope.changeKeywork = function(keywork){
			$scope.keywork = keywork;
		}

		// ============== search data ==============
		$scope.searchData = function(){
			$rootScope.offset = 0;
			IngredientService.searchData($rootScope.userLogin.token, $scope.keywork, $rootScope.offset).success(function(res){
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
				$scope.bigTotalItems = res.count;
			})
		}

		// =============== return data filter ============
		function returnDataFilter(data){
			IngredientService.filterData(data, $rootScope.userLogin.token).success(function(res){
				console.log(res)
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
				$scope.bigTotalItems = res.count;
				console.log($rootScope.listData)
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

		// ======== function search =====================
		$scope.changeSearchInput = function (keywork) {
			$scope.keywork = keywork;
		}

		$scope.searchKey = function () {
		}

		// ================ pagination ====================
		$scope.changePage = function (page_index) {
			$rootScope.offset = page_index > 1 ? ((page_index - 1) * 10) : 0;
			getList();
		}

		// ================= get list ===============
		function getList() {
			IngredientService.getList($rootScope.userLogin.token, $rootScope.offset).success(function (res) {
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
				$scope.bigTotalItems = res.count;
			}).error(function (err, status, res) {
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

		// ========== function get list type ============
		function getListType() {
			IngredientService.getListType($rootScope.userLogin.token).success(function (res) {
				$scope.types = $scope.filter_types = res;
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

				IngredientService.updated(_obj, $rootScope.userLogin.token).success(function(res){
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

		// ============ function get list brand ===========
		function getListBrand(type) {
			IngredientService.getListBrand($rootScope.userLogin.token, type).success(function (res) {
				if (type) {
					$scope.filter_brands = res;
				} else {
					$scope.brands = res;
				}
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

		getListBrand(undefined);

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function (data) {
			var page = 'app/pages/manager-ingredient/ingredient/list/confirm/index.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: 'sm',
				resolve: {
					items: function () {
						return data;
					}
				},
				controller: 'IngredientDeleteCtrl',
			});
		}

	};

	// controler IngredientListDeleteCtrl
	function IngredientDeleteCtrl($scope, toastr, IngredientService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList() {
			IngredientService.getList($rootScope.userLogin.token, $rootScope.offset).success(function (res) {
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
			}).error(function (err, status, res) {
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
		$scope.remove = function (data) {
			IngredientService.removed(data.id, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Deleted success!');
				$uibModalInstance.close();
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
	}

})();