/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.detail-ingredient')
        .controller('IngredientDetailCtrl', IngredientDetailCtrl)
        .controller('IngredientDetailExportCtrl', IngredientDetailExportCtrl)
        .controller('IngredientDetailImportCtrl', IngredientDetailImportCtrl);

    /** @ngInject */
    function IngredientDetailCtrl($stateParams, $scope, IngredientService, toastr, $rootScope, $location, $window, $uibModal) {
        $scope.detail = {};
        $scope.paramt_id = $stateParams.id;
        $scope.data_detail = {
            id: $scope.paramt_id,
        };
        $scope.types = [];
        $scope.brands = [];
        $scope.isDisable = true;
        $scope.isChangeImage = true;

        // =============== import ingredint ================
        $scope.openImport = function(filter){
            var page = 'app/pages/manager-ingredient/ingredient/detail/import/index.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: 'md',
                resolve: {
                    items: function () {
                        return filter;
                    }
                },
                controller: 'IngredientDetailImportCtrl',
            });
        }

        // ============= export ingredient =================
        $scope.openExport = function(filter) {
            var page = 'app/pages/manager-ingredient/ingredient/detail/export/index.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: 'md',
                resolve: {
                    items: function () {
                        return filter;
                    }
                },
                controller: 'IngredientDetailExportCtrl',
            });
        }

        // ========= function get data glass by id ===========
        function getElement() {
            IngredientService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function (res) {
                res.status = String(res.status);
                res.type_search = String(res.type_search);
                res.brand = String(res.brand.id);
                $scope.detail = res;
                $scope.detail.type = res.type.id;
                getListType();
                getListBrand($scope.detail.type);
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

        $rootScope.getElementRoot = function(){
            getElement();
        }

        // ========== function get list type ============
        function getListType() {
            IngredientService.getListType($rootScope.userLogin.token).success(function (res) {
                $scope.types = res;
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

        // ============ function get list brand ===========
        function getListBrand(type) {
            IngredientService.getListBrand($rootScope.userLogin.token, type).success(function (res) {
                $scope.brands = res;
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

        // ========== function change from ===============
        $scope.changeInfo = function (field, value) {
            $scope.data_detail[field] = value;
        }

        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_detail.image = file;
			$scope.isDisable = false;
		}

        // =========== function create =================
        $scope.save = function () {
            IngredientService.updated($scope.data_detail, $rootScope.userLogin.token).success(function (res) {
                toastr.success('Updated success!');
                setTimeout(function () {
                    res.id > 0 && ($window.location.href = '#/manager-ingredient/ingredient/list');
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

    };

    // controler IngredientListDeleteCtrl
    function IngredientDetailImportCtrl($scope, toastr, IngredientService, RobotService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
        $scope.import = items;
        $scope.data_import = {};

        $scope.changeInfo = function(field, value){
            $scope.data_import[field] = value;
        }

        // ========== import ==========
        $scope.import = function(){
            $scope.data_import.type = items.type;
            $scope.data_import.brand = items.brand;
            $scope.data_import.ingredient = items.id;
            $scope.data_import.status = 0;
            RobotService.importHistoryRobo($scope.data_import, $rootScope.userLogin.token).success(function(res){
                toastr.success('Import robot success!');
                $uibModalInstance.close();
                // $rootScope.robotId = $scope.data_create.machine;
                // $window.location.href = '#/manager-ingredient/history/list';

                $rootScope.getElementRoot();
            }).error(function(err, stt, res){
                toastr.error('Error!');
            })
        }
    };

    // controler IngredientListDeleteCtrl
    function IngredientDetailExportCtrl($scope, toastr, IngredientService, RobotService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
        $scope.import = items;
        $scope.data_import = {};

        $scope.changeInfo = function(field, value){
            $scope.data_import[field] = value;
        }

        // ========== import ==========
        $scope.export = function(){
            $scope.data_import.type = items.type;
            $scope.data_import.brand = items.brand;
            $scope.data_import.ingredient = items.id;
            $scope.data_import.status = 0;
            RobotService.importHistoryRobo($scope.data_import, $rootScope.userLogin.token).success(function(res){
                toastr.success('Export robot success!');
                $uibModalInstance.close();
                // $rootScope.robotId = $scope.data_create.machine;
                // $window.location.href = '#/manager-ingredient/history/list';

                $rootScope.getElementRoot();
            }).error(function(err, stt, res){
                toastr.error('Error!');
            })
        }
    }


})();