(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('StatsService', function ($http, AppSetting, $rootScope) {
            var _headers = {
                headers: {
                    'Content-Type': undefined,
                    'Authorization': 'Token ' + $rootScope.userLogin.token
                }
            };
            var now = new Date();

            return {
                getDataChartOrder: function(filter) {
                    if(filter === 'month'){
                        var _url = AppSetting.BASE_URL + '/api/statistic/order/?year=' + now.getFullYear() ;
                    }
                    if(filter === 'day'){
                        var _url = AppSetting.BASE_URL + '/api/statistic/order/?year=' + now.getFullYear() + '&month=' + now.getMonth() ;
                    }
                    return $http.get(_url, _headers);
                },

                getDataChartUser: function(filter){
                    if(filter === 'month'){
                        var _url = AppSetting.BASE_URL + '/api/statistic/user/?year=' + now.getFullYear() ;
                    }
                    if(filter === 'day'){
                        var _url = AppSetting.BASE_URL + '/api/statistic/user/?year=' + now.getFullYear() + '&month=' + now.getMonth() ;
                    }
                    return $http.get(_url, _headers);
                },

                getList: function (token, offset) {
                    return $http.get(AppSetting.BASE_URL + '/api/user/order/?robot=true&limit=10&offset='+offset, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },

                getElement: function (id, token) {
                    return $http.get(AppSetting.BASE_URL + '/api/user/order/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                }
            }
        });
})();