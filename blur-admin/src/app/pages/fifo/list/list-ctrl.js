/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-fifo')
		.controller('FifoListCtrl', FifoListCtrl)
		.controller('FifoShowQRCodeCtrl', FifoShowQRCodeCtrl)
		.controller('FifoDeleteCtrl', FifoDeleteCtrl);

	/** @ngInject */
	function FifoListCtrl($scope, toastr, FifoService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];
		$rootScope.priorityDefault = [];

		$scope.pageSize =  [
	      {label: '10 results', value: 10},
	      {label: '25 results', value: 25},
	      {label: '50 results', value: 50},
	      {label: '100 results', value: 100}
	    ];
		$scope.maxSize = '10';
        $scope.bigTotalItems = 0;
		$scope.bigCurrentPage = 1;
		$rootScope.offset = 0;

		// ================ sortable ====================
		$scope.sortableOptions = {
		    update: function(e, ui) {
				setTimeout(function () {
					$rootScope.priorityDefault.forEach(function(item, index) {
						$rootScope.listData[index].priority = item;
						FifoService.updated($rootScope.listData[index], $rootScope.userLogin.token).success(function (res) {					
						});
					})//end foreach
				},500);
				toastr.success('Change success!');
		    },
		};
		
		// ================ pagination ====================
        $scope.changePage =  function(page_index){
            $rootScope.offset = page_index > 1 ? ((page_index - 1)*$scope.maxSize) : 0;
            getList();
        }

        $scope.selectPage = function(page_number, e){
        	console.log(page_number);
        }

        // =============== show zoom QR Code =====================
        $scope.showQR = function(image){
        	console.log(image)
        	var page = 'app/pages/fifo/list/show-qr-code.html';

            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return image;
                    }
                },
                controller: 'FifoShowQRCodeCtrl',
            });
        }

        // =============== fucntion change status ================
		$scope.changeStatus = function (data) {
			data.active === true ? data.active = false : data.active = true;
			var _obj = {
				id: data.id,
				active: data.active
			}
			FifoService.updated(_obj, $rootScope.userLogin.token).success(function (res) {
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
		
		// ================= change size page ===============

		$scope.changeSizePage = function(data){
			$scope.maxSize = data.toString();
			getList(data);
		}
		// ================= get list ===============
		function getList(){
			var _key = 1;
			FifoService.getList($rootScope.userLogin.token,$scope.maxSize,$rootScope.offset).success(function(res){
				$rootScope.listData = res.results;
				$scope.bigTotalItems = res.count;
				$rootScope.listData.forEach(function(item,index){
					$rootScope.priorityDefault[index]=item.priority
				});
				// console.log($rootScope.listData)
				// $rootScope.listData.products.forEach(function(el){
				// 	el.key = _key;
				// 	_key++;
				// });
				$scope.products = $rootScope.listData.products;
				$scope.bigTotalItems = res.count;
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
			var page = 'app/pages/fifo/list/confirm/index.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'FifoDeleteCtrl',
            });
		}

	};

	// controler IngredientBrandListDeleteCtrl
	function FifoDeleteCtrl($scope, toastr, FifoService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			FifoService.getList($rootScope.userLogin.token, $rootScope.offset).success(function(res){
				$rootScope.listData = res.results;
				$rootScope.listData.forEach(function(item,index){
					$rootScope.priorityDefault[index]=item.priority
				});
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
			
			FifoService.removed(data.id, $rootScope.userLogin.token).success(function(res){
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
				// $rootScope.listData.forEach(function(item, index) {
				// 	if (item.id == data.id){
				// 		$rootScope.listData.splice(index,1)
				// 	}
				// })
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

	// controler IngredientBrandListDeleteCtrl
	function FifoShowQRCodeCtrl($scope, toastr, FifoService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.qr_code = items;
	}

})();