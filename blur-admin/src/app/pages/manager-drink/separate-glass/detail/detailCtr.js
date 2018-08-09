/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-separate-glass')
		.controller('SeparateGlassDetailCtrl', SeparateGlassDetailCtrl);

	/** @ngInject */
	function SeparateGlassDetailCtrl($stateParams, $scope, toastr, $rootScope, $location, $window, SeparateService) {
		$scope.glass = {};
		$scope.glass_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.glass_id
		};
		$scope.isChangeImage = true;
		
		// ========= function get data glass by id ===========
		function getGlassById(){
			SeparateService.getGlass($scope.glass_id, $rootScope.userLogin.token).success(function(res){
				res.status = res.status === 0 ? '0' : '10';
				res.unit = res.unit === 0 ? '0' : '10';
				$scope.glass = res;
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

		getGlassById();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_detail[field] = value;
		}
		
		// ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_detail.image = file;
			$scope.isDisable = false;
		}

		// =========== function create =================
		$scope.save = function(){
			SeparateService.updateGlass($scope.data_detail, $rootScope.userLogin.token).success(function(res){
				toastr.success('Updated success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/separate-glass/list');
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

		// ============================= upload image =================
		$scope.removePicture = function () {
            $scope.isChangeImage = true;
        };

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadImage');
            fileInput.click();

        };

        $scope.unconnect = function (item) {
            item.href = undefined;
        };

        $scope.showModal = function (item) {
            $uibModal.open({
                animation: false,
                controller: 'ProfileModalCtrl',
                templateUrl: 'app/pages/profile/profileModal.html'
            }).result.then(function (link) {
                item.href = link;
            });
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

        $scope.imageUpload = function (event) {
            var files = event.target.files;

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
                $scope.isChangeImage = false;
                $scope.image = e.target.result;
                var file = $window.document.getElementById('uploadImage');
                $scope.data_detail.image = file.files[0];
            });
        }

	}

})();