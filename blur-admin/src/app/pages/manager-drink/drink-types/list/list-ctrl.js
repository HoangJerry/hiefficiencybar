/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-drink-types')
		.controller('DrinkTypesListCtrl', DrinkTypesListCtrl)
		.controller('DrinkTypesDeleteCtrl', DrinkTypesDeleteCtrl);

	/** @ngInject */
	function DrinkTypesListCtrl($scope, toastr, DrinkTypesService, $rootScope, $location, $window, $uibModal) {
        $rootScope.listDataDrinkType = [];

        $scope.maxSize = 10;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        $rootScope.offset = 0;
        
        // ================ pagination ====================
        $scope.changePage =  function(page_index){
            $rootScope.offset = page_index > 1 ? ((page_index - 1)*10) : 0;
            getAllUser();
        }

        $scope.selectPage = function(page_number, e){
        }
		
		// ================= get list ===============
		function getList(){
			DrinkTypesService.getList($rootScope.userLogin.token, $rootScope.offset).success(function(res){
				$rootScope.listDataDrinkType = res.results;
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
        
        // =========== change active ==================
        $scope.changeActive = function(data){
            DrinkTypesService.updated(data, $rootScope.userLogin.token).success(function(res){
                toastr.success('Updated active success!');
                getList();
            }).error(function(err, stt, res){
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
		$scope.confirmDelete = function(data){
			var page = 'app/pages/manager-drink/drink-types/list/confirm/index.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'DrinkTypesDeleteCtrl',
            });
		}

	};

	// controler GarnishListDeleteCtrl
	function DrinkTypesDeleteCtrl($scope, toastr, DrinkTypesService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			DrinkTypesService.getList($rootScope.userLogin.token, $rootScope.offset).success(function(res){
				$rootScope.listDataDrinkType = res.results;
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
			DrinkTypesService.removed(data.id, $rootScope.userLogin.token).success(function(res){
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