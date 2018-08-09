'use strict';

angular.module('BlurAdmin', [
        'ngAnimate',
        'ui.bootstrap',
        'ui.sortable',
        'ui.router',
        'ngTouch',
        'toastr',
        'smart-table',
        "xeditable",
        'ui.slimscroll',
        'ngJsTree',
        'angular-progress-button-styles',
        'colorpicker.module',
        'ui.sortable',
        
        'BlurAdmin.theme',
        'BlurAdmin.pages',
        'BlurAdmin.pages.login',

    ], ['$httpProvider', function($httpProvider){
        $httpProvider.interceptors.push(['$window', '$location', '$q', function($window, $location, $q) {
            return {
                'responseError': function(response) {
                    var status = response.status;
                    if (status == 401) {
                        $window.localStorage.removeItem('currentUser');
                        $location.path('/');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }])
// .constant('AppSetting', {'BASE_URL': 'http://localhost:8000'});
.constant('AppSetting', {'BASE_URL': 'http://hiefficiencybar.com'}); 
