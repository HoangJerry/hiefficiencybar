/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-drink')
		.controller('DrinkListCtrl', DrinkListCtrl)
		.controller('DrinkDeleteCtrl', DrinkDeleteCtrl)
		.controller('UploadFileCtrl', UploadFileCtrl);

	/** @ngInject */
	function DrinkListCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listDataDrink = [];

		$scope.maxSize = 10;
		$scope.bigTotalItems = 0;
		$scope.bigCurrentPage = 1;
		$rootScope.offset = 0;
		$scope.keywork = '';
		$scope.sort = '';
		$scope.arr_sort = [];
		$scope.importCsv = '';
		// $scope.arr_sort = ['name', 'status', 'numbers_bought', 'price', 'glass'];
		$scope.static_sort = {
			name: '',
			status: '',
			numbers_bought: '',
			price: '',
			glass: ''
		}

		// ================ pagination ====================
		$scope.changePage = function (page_index) {
			$rootScope.offset = page_index > 1 ? ((page_index - 1) * 10) : 0;
			getList();
		}

		// ============ change Switch ==============
		$scope.countSwitch = 0;
		$scope.changeSwitch = function (data) {
			$scope.countSwitch++;
			if ($scope.countSwitch == 2) {
				$scope.countSwitch = 0;
				console.log(data)


				var _data_row = {
					id: data.id,
					status: data.status == 0 ? '10' : '0',
					ingredients: [],
					garnishes: []
				};
				
				data.ingredients.forEach(function (el) {
					var _obj = {
						ingredient: el.ingredient.id,
						ratio: el.ratio,
						unit: el.unit
					}
					_data_row.ingredients.push(_obj);
				});

				data.garnishes.forEach(function (el) {
					var _obj = {
						garnish: el.garnish.id,
						ratio: el.ratio
						// unit : el.unit
					}
					_data_row.garnishes.push(_obj);
				});

				// _data_row.garnishes = data.garnishes;

				// $scope.data_detail.estimate_time = $scope.est.min * 60 + $scope.est.sec;
				var _data = _data_row;


				console.log(_data)

				// // data.status = data.status == 10 ? 0 : 10;

				DrinkService.updated(_data, $rootScope.userLogin.token).success(function (res) {
					toastr.success('Change status success!');
					// getList();
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

		// ============== sort data =================
		$scope.sortData = function (name, data) {
			if (name === 'name') {
				var _sort = $scope.static_sort.name = data === '' ? 'name' : (data === 'name' ? '-name' : 'name');

				var _check_index = 0;
				for (var key in $scope.arr_sort) {
					var _data = $scope.arr_sort[key];
					if (_data !== name) {
						_check_index++;
					}
				}
				if (_check_index === $scope.arr_sort.length) {
					$scope.arr_sort.push(name);
				}
			}
			if (name === 'status') {
				var _sort = $scope.static_sort.status = data === '' ? 'status' : (data === 'status' ? '-status' : 'status');
				// $scope.arr_sort[1] = $scope.static_sort.status;

				var _check_index = 0;
				for (var key in $scope.arr_sort) {
					var _data = $scope.arr_sort[key];
					if (_data !== name) {
						_check_index++;
					}
				}
				if (_check_index === $scope.arr_sort.length) {
					$scope.arr_sort.push(name);
				}
			}
			if (name === 'numbers_bought') {
				var _sort = $scope.static_sort.numbers_bought = data === '' ? 'numbers_bought' : (data === 'numbers_bought' ? '-numbers_bought' : 'numbers_bought');
				// $scope.arr_sort[2] = $scope.static_sort.numbers_bought;

				var _check_index = 0;
				for (var key in $scope.arr_sort) {
					var _data = $scope.arr_sort[key];
					if (_data !== name) {
						_check_index++;
					}
				}
				if (_check_index === $scope.arr_sort.length) {
					$scope.arr_sort.push(name);
				}
			}
			if (name === 'price') {
				var _sort = $scope.static_sort.price = data === '' ? 'price' : (data === 'price' ? '-price' : 'price');
				// $scope.arr_sort[3] = $scope.static_sort.price;

				var _check_index = 0;
				for (var key in $scope.arr_sort) {
					var _data = $scope.arr_sort[key];
					if (_data !== name) {
						_check_index++;
					}
				}
				if (_check_index === $scope.arr_sort.length) {
					$scope.arr_sort.push(name);
				}
			}
			if (name === 'glass') {
				var _sort = $scope.static_sort.glass = data === '' ? 'glass' : (data === 'glass' ? '-glass' : 'glass');
				// $scope.arr_sort[4] = $scope.static_sort.glass;

				var _check_index = 0;
				for (var key in $scope.arr_sort) {
					var _data = $scope.arr_sort[key];
					if (_data !== name) {
						_check_index++;
					}
				}
				if (_check_index === $scope.arr_sort.length) {
					$scope.arr_sort.push(name);
				}
			}

			var str_sort = '';

			for (var i in $scope.arr_sort) {
				var _data = $scope.arr_sort[i];
				if (str_sort === '') {
					str_sort += $scope.static_sort[_data];
				} else {
					str_sort = str_sort + ',' + $scope.static_sort[_data]
				}
			}

			console.log(str_sort)

			DrinkService.getList($rootScope.userLogin.token, $rootScope.offset, $scope.keywork, str_sort).success(function (res) {
				$rootScope.listDataDrink = res.results;
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

		// ============= change keywork ============
		$scope.changeKeywork = function (keywork) {
			$scope.keywork = keywork;
		}

		// ============== search data ==============
		$scope.searchData = function () {
			DrinkService.getList($rootScope.userLogin.token, $rootScope.offset, $scope.keywork, $scope.sort).success(function (res) {
				$rootScope.listDataDrink = res.results;
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

		// ================= get list ===============
		function getList() {
			DrinkService.getList($rootScope.userLogin.token, $rootScope.offset, $scope.keywork, $scope.sort).success(function (res) {
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listDataDrink = res.results;
				$scope.bigTotalItems = res.count;
				// console.log($rootScope.listDataDrink)
				
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

		// =========== click import ==================

		$scope.onClickImport = function(event){
			var page = 'app/pages/manager-drink/drink/list/confirm/confirm_upload.html';
			function show(myFile) {
				$uibModal.open({
					animation: true,
					templateUrl: page,
					size: 'sm',
					resolve: {
						items: function () {
							return myFile;
						}
					},
					controller: 'UploadFileCtrl',
				});
			}
			var myFile = $(event).prop('files')[0];
				if (myFile.type==="text/csv"){
					show(myFile)
				}
				else{
					toastr.error('File upload was not csv file');
				}
	
				
				
			
		}
		// =========== change active ==================
		$scope.changeActive = function (data) {
			DrinkService.updated(data, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Updated active success!');
				getList();
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

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function (data) {
			var page = 'app/pages/manager-drink/drink/list/confirm/confirm.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: 'sm',
				resolve: {
					items: function () {
						return data;
					}
				},
				controller: 'DrinkDeleteCtrl',
			});
		}

	};

	// controler drinkListDeleteCtrl
	function UploadFileCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		$scope.item = items;
		function getList() {
			DrinkService.getList($rootScope.userLogin.token).success(function (res) {
				$rootScope.listDataDrink = res.results;
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

		$scope.upload = function(){
			toastr.warning("Please don't close the window until success!");
			$uibModalInstance.close();

			DrinkService.importCsv($scope.item,$rootScope.userLogin.token).success(function (res) {
					toastr.success('Import success');
					getList();
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
		
	}

	function DrinkDeleteCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList() {
			DrinkService.getList($rootScope.userLogin.token).success(function (res) {
				$rootScope.listDataDrink = res.results;
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
			DrinkService.removed(data.id, $rootScope.userLogin.token).success(function (res) {
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