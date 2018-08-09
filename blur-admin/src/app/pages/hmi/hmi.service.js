(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('HMIService', function ($http, AppSetting, $rootScope) {
            var _headers = {
                headers: {
                    'Content-Type': undefined,
                    'Authorization': 'Token ' + $rootScope.userLogin.token
                }
            }

            return {
                getDataChartOrder: function() {
                    var _url = AppSetting.BASE_URL + '/api/statistic/order/?year=2018';
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
                // created: function (data, token) {
                //     var fd = new FormData();
                //     for (var key in data) {
                //         if (key === 'status') {
                //             data[key] = Number(data[key]);
                //         }
                //         fd.append(key, data[key])
                //     }
                //     return $http.post(AppSetting.BASE_URL + '/api/user/order/', fd, {
                //         headers: {
                //             'Content-Type': undefined,
                //             'Authorization': 'Token ' + token
                //         }
                //     });
                // },
                // removed: function (id, token) {
                //     return $http.delete(AppSetting.BASE_URL + '/api/user/order/' + id + '/', {
                //         headers: {
                //             'Content-Type': undefined,
                //             'Authorization': 'Token ' + token
                //         }
                //     })
                // },
                // updated: function (data, token) {
                //     var fd = new FormData();

                //     for (var key in data) {
                //         if (key === 'status') {
                //             data[key] = Number(data[key]);
                //         }
                //         fd.append(key, data[key]);
                //     }
                //     return $http.patch(AppSetting.BASE_URL + '/api/user/order/' + data.id + '/', fd, {
                //         headers: {
                //             'Content-Type': undefined,
                //             'Authorization': 'Token ' + token
                //         }
                //     })
                // },
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