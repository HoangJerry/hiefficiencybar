/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-garnish')
		.controller('GarnishCreateCtrl', GarnishCreateCtrl);

	/** @ngInject */
	function GarnishCreateCtrl($scope, GarnishService, toastr, $rootScope, $location, $window) {
        $scope.data_create = {
            name : '',
            active : false
		};
		$scope.isChangeImage = true;

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
        }

		// =========== function create =================
		$scope.create = function(){
			GarnishService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/garnish/detail/'+res.id);
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

				$scope.data_create[$scope.field_name] = file.files[0];
			});
		}

	}

})();