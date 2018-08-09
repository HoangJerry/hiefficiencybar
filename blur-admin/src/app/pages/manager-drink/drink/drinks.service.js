(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('DrinkService', function ($http, AppSetting) {
            return {
                getList: function (token, offset, keywork, sort) {
                    var query = '/api/drink/?admin=true&limit=100';
                    if (offset){
                        query += '&offset='+ offset ;
                    }
                    if (keywork){
                        query += '&search=' + keywork;
                    }
                    if (sort){
                        query += '&sort='+sort;
                    }
                    
                    return $http.get(AppSetting.BASE_URL + query, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                // searchData: function (token, keywork, offset) {
                //     return $http.get(AppSetting.BASE_URL + '/api/drink/?search='+keywork+'&limit=100&offset=' + offset, {
                //         headers: {
                //             'Content-Type': undefined,
                //             'Authorization': 'Token ' + token
                //         }
                //     });
                // },
                // sortData: function (token, sort, offset) {
                //     return $http.get(AppSetting.BASE_URL + '/api/drink/?search='+keywork+'&limit=100&offset=' + offset, {
                //         headers: {
                //             'Content-Type': undefined,
                //             'Authorization': 'Token ' + token
                //         }
                //     });
                // },
                created: function (data, token) {
                    var fd = new FormData();
                    data.ingredients.forEach(function (el) {
                        // el.ingredient = el.ingredient.id;
                        fd.append('ingredients', JSON.stringify(el))
                    });
                    
                    data.garnishes.forEach(function(el){
                        // el.garnish = el.garnish.id;
                        fd.append('garnishes', JSON.stringify(el))
                    });

                    for (var key in data) {
                        if(!(key === 'garnishes' || key == 'ingredients')){
                            fd.append(key, data[key])
                        }
                            
                        
                    }

                    return $http.post(AppSetting.BASE_URL + '/api/drink/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                removed: function (id, token) {
                    return $http.delete(AppSetting.BASE_URL + '/api/drink/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                updated: function (data, token) {
                    var fd = new FormData();

                    data.ingredients.forEach(function (el) {
                        // el.ingredient = el.ingredient.id;
                        fd.append('ingredients', JSON.stringify(el))
                    });
                    
                    data.garnishes.length > 0 && data.garnishes.forEach(function(el){
                        // el.garnish = el.garnish.id;
                        fd.append('garnishes', JSON.stringify(el))
                    });

                    for (var key in data) {
                        if(!(key === 'garnishes' || key === 'ingredients')){
                            if (key === 'image') {
                                if (data[key])
                                    fd.append(key, data[key]);
                            } else if(key === 'image_background'){
                                if (data[key])
                                    fd.append(key, data[key]);
                            }
                             else {
                                fd.append(key, data[key]);
                            }
                        }
                    }
                    return $http.patch(AppSetting.BASE_URL + '/api/drink/' + data.id + '/?admin', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                changed: function (data, token) {
                    var fd = new FormData();
                    fd.append('filke', data.status);

                    return $http.patch(AppSetting.BASE_URL + '/api/drink/' + data.id + '/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                importCsv: function (data, token) {
                    var fd = new FormData();
                    fd.append('file', data);

                    return $http.post(AppSetting.BASE_URL + '/api/drink/csv/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getElement: function (id, token) {
                    return $http.get(AppSetting.BASE_URL + '/api/drink/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getCategories: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/drink/category/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                getListGlass: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/glass/?admin=true', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                getListIngredient: function (token, type, brand) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/?type=' + type + '&brand=' + brand, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                getListBrand: function (token, type) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/brand/type/?type=' + type, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                }

            }
        });
})();