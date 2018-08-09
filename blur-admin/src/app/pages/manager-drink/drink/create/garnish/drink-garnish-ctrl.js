/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.create-drink')
        .controller('DrinkCreateGarnishCtrl', DrinkCreateGarnishCtrl);

    /** @ngInject */
    function DrinkCreateGarnishCtrl($scope, DrinkService, GarnishService, toastr, $rootScope, $location, $window, $uibModalInstance) {
        $scope.list_garnish = [];
        $scope.data_create = {
            unit: '0',
            ratio : 0
        };
        $scope.garnish = null;

        // =========== get list garnihs ==============
        function getListGarnish() {
            GarnishService.getList($rootScope.userLogin.token).success(function (res) {
                $scope.list_garnish = res;
            })
        }

        getListGarnish();

        // ========== function change from ===============
        $scope.changeInfo = function (field, value) {
            if (field === 'garnish') {
                $scope.garnish = value;
                var _arr = $scope.list_garnish;
                var _val = _arr.filter(function (el) {
                    return String(el.id) === value;
                })[0];
                $scope.data_create.garnish = _val;
            } else {
                $scope.data_create[field] = value;
            }
        }

        // ============== add garnish =============
        $scope.add = function () {
            toastr.success('Add Garnish success!');
            $rootScope.garnishs.push($scope.data_create);
            $uibModalInstance.close();
            $rootScope.loadPageDrinkCreate(true);
        }
    }

})();