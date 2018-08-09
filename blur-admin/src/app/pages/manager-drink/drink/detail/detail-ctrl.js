/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-drink')
		.controller('DrinkDetailCtrl', DrinkDetailCtrl);

	/** @ngInject */
	function DrinkDetailCtrl($stateParams, $scope, DrinkService, toastr, $rootScope, $location, $window, $uibModal, $filter) {
		$scope.detail = {
			garnishes: [],
			ingredients: [],
			category: []
		};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id: $scope.paramt_id,
			garnishes: [],
			ingredients: [],
			category: []
		};
		$scope.isChange = $scope.isChangeIngredient = $scope.isChangeGarnish = false;
		$scope.categories = [];
		$scope.est = {
			min : 0,
			sec: 0
		};
		$scope.isDisablePrice = false;

		$rootScope.list_categories = $scope.list_glass = $rootScope.ingredients = $rootScope.garnishs = [];

		// ================ select category============
		$scope.selected_baselines = [];

		$scope.selected_baseline_settings = {
			template: '<b>{{option.link}}</b>',
			searchField: 'link',
			enableSearch: true,
			selectionLimit: 4,
			selectedToTop: true
		};

		$scope.selected_baselines_customTexts = { buttonDefaultText: 'Select Users' };
		$scope.isChangeImage = true;
		$scope.isChangeBackgroundImage = true;

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
			$scope.data_detail.category.push(data.id);
			$scope.categories.push(data);

			var _class_el = '.check_' + data.id;

			$rootScope.list_categories.forEach(function (el) {
				if (el.id === data.id) {

					if (el.selected) {
						el.selected = false;
						$(_class_el).children('._check_icon').css('display', 'none');

						$scope.categories = $scope.categories.filter(function (el) {
							return el.id !== data.id;
						})

						$scope.data_detail.category = $scope.data_detail.category.filter(function (el) {
							return el !== data.id;
						})
					} else {
						el.selected = true;
						$(_class_el).children('._check_icon').css('display', 'inline-block');
					}
				}
			});
		}

		// ============ seleced init category ============
		function initCategorySelected() {

		}

		// ========== function get list categories ===========
		function getCategories() {
			DrinkService.getCategories($rootScope.userLogin.token).success(function (res) {
				$rootScope.list_categories = res;

				setTimeout(function () {
					var _arr = $scope.data_detail.category;
					$rootScope.list_categories.forEach(function (el) {
						for (var i = 0; i < _arr.length; i++) {
							var element = _arr[i];
							if (element == el.id) {
								el.selected = true;
							}
						}
					});
				}, 400);

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

		// ========= function get data glass by id ===========
		function getElement() {
			DrinkService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function (res) {
				$scope.detail = res;
				$scope.detail.glass = String(res.glass.id);

				$scope.categories = res.category;


				$scope.est.min = Math.floor($scope.detail.estimate_time / 60);
				$scope.est.sec = Math.floor($scope.detail.estimate_time % 60);

				var _category = res.category;
				_category.forEach(function (el) {
					$scope.data_detail.category.push(el.id)
				});

				// $scope.detail.category = _arr;
				res.ingredients.forEach(function(el){
					el.unit = String(el.unit);
				});
				$rootScope.ingredients = res.ingredients;
				$rootScope.garnishs = res.garnishes;

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

		getElement();

		// ========== function change from ===============
		$scope.changeInfo = function (field, value) {
			if(field == 'is_fit_price'){
				$scope.isDisablePrice = !value;
			}
			$scope.data_detail[field] = value;
			$scope.isChange = true;
		}

		// =========== function create =================
		$scope.save = function () {
			// $rootScope.ingredients.forEach(function(el){
			// 	el.unit = el.unit === 'Part' ? 0 : 10;
			// });

			// $scope.data_detail.garnishes = $rootScope.garnishs;
			// $scope.data_detail.ingredients = $rootScope.ingredients;

			$rootScope.ingredients.forEach(function(el){
				var _obj = {
					ingredient : el.ingredient.id,
					ratio : el.ratio,
					unit : el.unit
				}
				$scope.data_detail.ingredients.push(_obj);
			});

			$rootScope.garnishs.forEach(function(el){
				var _obj = {
					garnish : el.garnish.id,
					ratio : el.ratio
					// unit : el.unit
				}
				$scope.data_detail.garnishes.push(_obj);
			});

			$scope.data_detail.estimate_time = $scope.est.min * 60 + $scope.est.sec;
			var _data = $scope.data_detail;

			DrinkService.updated(_data, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Updated success!');
				setTimeout(function () {
					res.id > 0 && ($window.location.href = '#/manager-drink/drink/list');
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
			$scope.isChangeIngredient = true;
			$scope.isChange = true;

			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: size,
				controller: 'DrinkCreateIngredientCtrl',
			});
		}

		// =========== open modal create garnish ============
		$scope.openCreateGarnish = function (size) {
			$scope.isChangeGarnish = true;
			$scope.isChange = true;
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

		// ========== change image ===========
		$scope.removePicture = function (field) {
			if (field === 'image') {
				$scope.isChangeImage = true;
			} else {
				$scope.isChangeBackgroundImage = true;
			}
		};

		$scope.uploadPicture = function (field) {
			$scope.field_name = field;
			var fileInput = '';
			if (field === 'image_background')
				fileInput = document.getElementById('image_background');
			else
				fileInput = document.getElementById('uploadImage');

			fileInput.click();

		};

		$scope.unconnect = function (item) {
			item.href = undefined;
		};


		$scope.getFile = function () {
			fileReader.readAsDataUrl($scope.file, $scope)
				.then(function (result) {
					$scope.data_profile.picture = result;
				});
		};

		$scope.file = '';
		$scope.onFileSelect = function ($file) {
		}

		$scope.changeAvatar = function () {
		}

		$scope.switches = [true, true, false, true, true, false];

		$scope.stepsModel = [];

		$scope.imageUpload = function (event, field) {
			var files = event.target.files;
			$scope.field_name = field;

			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var reader = new FileReader();
				reader.onload = $scope.imageIsLoaded;
				reader.readAsDataURL(file);
			}
		}

		$scope.imageIsLoaded = function (e) {
			$scope.isUpdated = true;
			$scope.$apply(function () {
				$scope.stepsModel.push(e.target.result);

				var file = undefined;
				if ($scope.field_name === 'image') {
					$scope.isChangeImage = false;
					$scope.image = e.target.result;
					file = $window.document.getElementById('uploadImage');
				}
				else {
					$scope.isChangeBackgroundImage = false;
					$scope.image_background = e.target.result;
					file = $window.document.getElementById('image_background');
				}

				$scope.data_detail[$scope.field_name] = file.files[0];
			});
		}

	}

})();