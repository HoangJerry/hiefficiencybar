(function () {
    'use strict';
    angular.module('BlurAdmin')
        .run(function ($rootScope) {
            $rootScope.userLogin = {};
            $rootScope.loadDataListUser = false;
        })
        .controller('AppCtrl', AppCtrl);

    function AppCtrl($scope, $state, $timeout, $window, $location, $rootScope, SettingsService, toastr) {
        $scope.appState = $state;
        $scope.currentUser = {};
        $scope.$watch('appState.current', function (value) {
            var user = $window.localStorage.getItem('currentUser');
            user = JSON.parse(user);
            $rootScope.userLogin = user;
            if (user && user.token) {
                //logined
                $scope.currentUser = user;
                if (value.url.indexOf('login') !== -1) {
                    $location.path('/');
                }
            } else {
                if (value.url.indexOf('login') === -1) {
                    $location.path('/login');
                }
            }
        }, true);

    }
})();