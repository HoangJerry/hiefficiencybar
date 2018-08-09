(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('SettingsService', function ($http, AppSetting) {
            return {
                getList: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/settings/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                created: function (data, token) {
                    var fd = new FormData();
                    for (var key in data) {
                        fd.append(key, data[key])
                    }
                    return $http.post(AppSetting.BASE_URL + '/api/settings/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                removed: function (id, token) {
                    return $http.delete(AppSetting.BASE_URL + '/api/settings/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                updated: function (data, token) {
                    var fd = new FormData();

                    // data.ingredients && data.ingredients.forEach(function (el) {
                    //     el.ingredient = el.ingredient.id;
                    //     fd.append('ingredients', JSON.stringify(el))
                    // });

                    for (var key in data) {
                        // if (key !== 'ingredients') {
                            fd.append(key, data[key]);
                        // }
                    }
                    return $http.patch(AppSetting.BASE_URL + '/api/settings/1/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                changed: function (data, token) {
                    var fd = new FormData();
                    fd.append('status', data.status);

                    return $http.patch(AppSetting.BASE_URL + '/api/settings/' + data.id + '/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getElement: function (id, token) {
                    return $http.get(AppSetting.BASE_URL + '/api/settings/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                // =========== import history =========
                importHistoryRobo: function (data, token) {
                    var fd = new FormData();

                    for (var key in data) {
                        fd.append(key, data[key]);
                    }

                    return $http.post(AppSetting.BASE_URL + '/api/ingredient/history/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                }
            }
        });
})();