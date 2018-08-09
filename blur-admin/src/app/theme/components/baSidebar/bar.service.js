(function() {
    'use strict';
    angular.module('BlurAdmin.theme.components')
    .factory('BarLeftService', function($http, AppSetting){
        return {
            // get data drink categories
            getDrinkCategories : function(token){
                return $http.get(AppSetting.BASE_URL + '/api/drink/category/', {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            }
        }
    });
})();