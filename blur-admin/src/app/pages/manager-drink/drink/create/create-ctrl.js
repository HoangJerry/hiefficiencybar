/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-drink')
		.controller('DrinkCreateCtrl', DrinkCreateCtrl)
		.controller('DrinkDeleteIngredientCtrl', DrinkDeleteIngredientCtrl)
		.controller('DrinkDeleteGarnishCtrl', DrinkDeleteGarnishCtrl);

	/** @ngInject */
	function DrinkCreateCtrl($scope, DrinkService, toastr, $rootScope, $location, $window, $uibModal) {
		$scope.data_create = {
			name: '',
			active: false,
			price: 0,
			key_word: '',
			estimate_time: 0,
			category: [],
			ingredients : [],
			garnishes : [],
			is_fit_price : false,
		};
		$rootScope.list_categories = [];
		$scope.list_glass = [];
		$rootScope.ingredients = [];
		$rootScope.garnishs = [];
		$scope.categories = [];
		$scope.est = {
			min : 0,
			sec: 0
		};
		$scope.isDisablePrice = true;

		// ============ load data ==========
		function loadData() {
		}

		$rootScope.loadPageDrinkCreate = function (val) {
			if (val) {
				loadData();
			}
		}

		// ============ select multi category ==============
		$scope.selectCategory = function (data) {
			$scope.data_create.category.push(data.id);
			$scope.categories.push(data);

			var _class_el = '.check_' + data.id;

			$rootScope.list_categories.forEach(function (el) {
				if (el.id === data.id) {

					if(el.selected){
						el.selected = false;
						$(_class_el).children('._check_icon').css('display', 'none');

						$scope.categories = $scope.categories.filter(function(el){
							return el.id !== data.id;
						})
						
						$scope.data_detail.category = $scope.data_detail.category.filter(function(el){
							return el !== data.id;
						})
					} else{
						el.selected = true;
						$(_class_el).children('._check_icon').css('display', 'inline-block');
					}
				}
			});
		}

		// ========== function get list categories ===========
		function getCategories() {
			DrinkService.getCategories($rootScope.userLogin.token).success(function (res) {
				$rootScope.list_categories = res;
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

		getCategories();

		// ============ get list glass ====================
		function getListGlass() {
			DrinkService.getListGlass($rootScope.userLogin.token).success(function (res) {
				$scope.list_glass = res;
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

		getListGlass();

		// ========== function change from ===============
		$scope.changeInfo = function (field, value) {
			if(field == 'is_fit_price'){
				$scope.isDisablePrice = !value;
			}
			$scope.data_create[field] = value;
		}

		// ========= fucntion upload image ===============
		$scope.imageUpload = function (e, field) {
			var file = event.target.files[0];
			$scope.data_create[field] = file;
			$scope.isDisable = false;
		}

		// =========== function create =================
		$scope.create = function () {
			// $scope.data_create.garnishes = $rootScope.garnishs;
			// $scope.data_create.ingredients = $rootScope.ingredients;

			$rootScope.ingredients.forEach(function(el){
				var _obj = {
					ingredient : el.ingredient.id,
					ratio : el.ratio,
					unit : el.unit
				}
				$scope.data_create.ingredients.push(_obj);
			});

			$rootScope.garnishs.forEach(function(el){
				var _obj = {
					garnish : el.garnish.id,
					ratio : el.ratio
					// unit : el.unit
				}
				$scope.data_create.garnishes.push(_obj);
			});
			

			$scope.data_create.estimate_time = $scope.est.min * 60 + $scope.est.sec;
			var _data = $scope.data_create;

			DrinkService.created(_data, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Created success!');
				setTimeout(function () {
					res.id > 0 && ($window.location.href = '#/manager-drink/drink/detail/' + res.id);
				}, 300);
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

		// =========== open modal create ingredient ============
		$scope.openCreateIngredient = function (size) {
			var page = 'app/pages/manager-drink/drink/create/ingredient/add.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: size,
				controller: 'DrinkCreateIngredientCtrl',
			});
		}

		// =========== open modal create garnish ============
		$scope.openCreateGarnish = function (size) {
			var page = 'app/pages/manager-drink/drink/create/garnish/add.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: size,
				controller: 'DrinkCreateGarnishCtrl',
			});
		}

		// =========== open modal confirm delete Ingredient ===========
		$scope.confirmDelete = function (data) {
			var page = 'app/pages/manager-drink/drink/create/ingredient/delete.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: 'sm',
				resolve: {
					items: function () {
						return data;
					}
				},
				controller: 'DrinkDeleteIngredientCtrl',
			});
		}

		// =========== open modal confirm delete garnish ===========
		$scope.confirmDeleteGarnish = function (data) {
			var page = 'app/pages/manager-drink/drink/create/garnish/delete.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: 'sm',
				resolve: {
					items: function () {
						return data;
					}
				},
				controller: 'DrinkDeleteGarnishCtrl',
			});
		}

	}

	// controler DrinkDeleteIngredientCtrl
	function DrinkDeleteIngredientCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		$scope.item_del = items;

		// =========== function delete glass =============
		$scope.remove = function (data) {
			var _arr = $rootScope.ingredients;

			for (var i = _arr.length; i--;) {
				if (_arr[i].ingredient.id === items.ingredient.id) {
					_arr.splice(i, 1);
				}
			}
			$rootScope.ingredients = _arr;
			toastr.success('Remove success!');
			$uibModalInstance.close();

		}
	}

	// controler DrinkDeleteGarnishCtrl
	function DrinkDeleteGarnishCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		$scope.item_del = items;

		// =========== function delete glass =============
		$scope.remove = function (data) {
			var _arr = $rootScope.garnishs;

			for (var i = _arr.length; i--;) {
				if (_arr[i].garnish.id === items.garnish.id) {
					_arr.splice(i, 1);
				}
			}
			$rootScope.garnishs = _arr;
			toastr.success('Remove success!');
			$uibModalInstance.close();

		}
	}

})();