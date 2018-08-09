(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('SeparateService', function ($http, AppSetting) {
            return {
                getList: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/glass/?admin=true', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                createGlass: function (data, token) {
                    var fd = new FormData();
                    for (var key in data) {
                        fd.append(key, data[key])
                    }
                    return $http.post(AppSetting.BASE_URL + '/api/glass/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                deleteGlass: function (id, token) {
                    return $http.delete(AppSetting.BASE_URL + '/api/glass/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                updateGlass: function (data, token) {
                    var fd = new FormData();

                    for (var key in data) {
                        if(key === 'image'){
							if(data[key])
								fd.append(key, data[key]);
						}
						 else{
							fd.append(key, data[key]);
						}
                    }
                    return $http.patch(AppSetting.BASE_URL + '/api/glass/' + data.id + '/', fd , {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                changeStatusGlass: function(data, token){
                    var fd = new FormData();
                    fd.append('status', data.status);

                    return $http.patch(AppSetting.BASE_URL + '/api/glass/'+ data.id + '/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getGlass : function(id, token){
                    return $http.get(AppSetting.BASE_URL + '/api/glass/'+ id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                }
            }
        });
})();