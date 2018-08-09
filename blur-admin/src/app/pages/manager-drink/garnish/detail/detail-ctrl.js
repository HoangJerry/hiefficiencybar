/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-garnish')
		.controller('GarnishDetailCtrl', GarnishDetailCtrl);

	/** @ngInject */
	function GarnishDetailCtrl($stateParams, $scope, GarnishService, toastr, $rootScope, $location, $window) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.paramt_id
		};
		$scope.isChangeImage = true;
		
		// ========= function get data glass by id ===========
		function getElement(){
			GarnishService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function(res){
				$scope.detail = res;
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

		getElement();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_detail[field] = value;
		}
		
		// =========== function create =================
		$scope.save = function(){
			GarnishService.updated($scope.data_detail, $rootScope.userLogin.token).success(function(res){
				toastr.success('Updated success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/garnish/list');
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