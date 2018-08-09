(function() {
    'use strict';
    angular.module('BlurAdmin')
    .factory('LoginService', function($http, AppSetting){
        return {
            login: function(data) {
                return $http.post(AppSetting.BASE_URL + '/api/user/me/', data);
            }
        }
    });
})();