(function() {
    'use strict';
    angular.module('BlurAdmin.pages.login')
        .controller('LoginCtrl', LoginCtrl);

    function LoginCtrl($scope, LoginService, $window, $location, toastr, toastrConfig) {
        $scope.email = '';
        $scope.password = '';

        $scope.login = function() {
            var data = {'email': $scope.email, 'password': $scope.password};
            LoginService.login(data).success(function(result, status) {
                $window.localStorage['currentUser'] = JSON.stringify(result);
                $location.path('/');
            }).error(function(err, status){
                toastr.error('Username or password incorrect', 'Login Failed!', {
                    "autoDismiss": false,
                    "positionClass": "toast-top-right",
                    "type": "error",
                    "timeOut": "3000",
                    "extendedTimeOut": "2000",
                    "allowHtml": false,
                    "closeButton": true,
                    "tapToDismiss": true,
                    "progressBar": false,
                    "newestOnTop": true,
                    "maxOpened": 0,
                    "preventDuplicates": false,
                    "preventOpenDuplicates": false
                });
            });
        }
    }
})();