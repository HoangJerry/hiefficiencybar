(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('OrderService', function ($http, AppSetting) {
            return {
                getList: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/user/order/?admin=true&status=30', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                created: function (data, token) {
                    var fd = new FormData();
                    for (var key in data) {
                        if (key === 'status') {
                            data[key] = Number(data[key]);
                        }
                        fd.append(key, data[key])
                    }
                    return $http.post(AppSetting.BASE_URL + '/api/user/order/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                removed: function (id, token) {
                    return $http.delete(AppSetting.BASE_URL + '/api/user/order/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                updated: function (data, token) {
                    var fd = new FormData();

                    for (var key in data) {
                        if (key === 'status') {
                            data[key] = Number(data[key]);
                        }
                        fd.append(key, data[key]);
                    }
                    return $http.patch(AppSetting.BASE_URL + '/api/user/order/' + data.id + '/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getElement: function (id, token) {
                    return $http.get(AppSetting.BASE_URL + '/api/user/order/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                addCart : function(token){
                    var _url = AppSetting.BASE_URL + '/api/user/me/tab/?pending=true';
                    return $http.get(_url, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                }
            }
        });
})();