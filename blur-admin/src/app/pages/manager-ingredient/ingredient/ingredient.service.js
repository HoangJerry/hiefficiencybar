(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('IngredientService', function ($http, AppSetting) {
            return {
                getList: function (token, offset) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/?admin=true&limit=10&offset=' + offset, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                searchData: function (token, keywork, offset) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/?admin=true&search=' + keywork + '&limit=100&offset=' + offset, {
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
                    return $http.post(AppSetting.BASE_URL + '/api/ingredient/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                removed: function (id, token) {
                    return $http.delete(AppSetting.BASE_URL + '/api/ingredient/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                updated: function (data, token) {
                    var fd = new FormData();

                    for (var key in data) {
                        if (key === 'image') {
                            if (data[key])
                                fd.append(key, data[key]);
                        } else {
                            fd.append(key, data[key]);
                        }
                    }
                    return $http.patch(AppSetting.BASE_URL + '/api/ingredient/' + data.id + '/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                changed: function (data, token) {
                    var fd = new FormData();
                    fd.append('status', data.status);

                    return $http.patch(AppSetting.BASE_URL + '/api/ingredient/' + data.id + '/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getElement: function (id, token) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getListType: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/type/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                getListBrand: function (token, type) {
                    if (type) {
                        return $http.get(AppSetting.BASE_URL + '/api/ingredient/brand/type/?type=' + type, {
                            headers: {
                                'Content-Type': undefined,
                                'Authorization': 'Token ' + token
                            }
                        });
                    } else {
                        return $http.get(AppSetting.BASE_URL + '/api/ingredient/brand/', {
                            headers: {
                                'Content-Type': undefined,
                                'Authorization': 'Token ' + token
                            }
                        });
                    }

                },
                filterData: function (data, token) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/?type=' + data.filter_type + '&brand=' + data.filter_brand , {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                }
            }
        });
})();