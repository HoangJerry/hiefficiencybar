(function() {
    'use strict';
    angular.module('BlurAdmin')
    .factory('ManagerUserService', function($http, AppSetting){
        return {
            getAllUser: function(token, offset) {
                // return $http.get('http://petshopro.giinger.com/api/users/');
                return $http.get(AppSetting.BASE_URL + '/api/user/?limit=10&offset=' + offset, {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            },
            searchData: function (token, keywork, offset) {
                return $http.get(AppSetting.BASE_URL + '/api/user/?search='+keywork+'&limit=100&offset=' + offset, {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            },
            createUser : function(data, token){
                var fd = new FormData();
                for (var key in data){
                    fd.append(key, data[key])
                }

                return $http.post(AppSetting.BASE_URL + '/api/user/', fd, {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            },
            deleteUser : function(id, token){
                return $http.delete(AppSetting.BASE_URL + '/api/user/' + id + '/', {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            },
            getUser : function(id, token){
                return $http.get(AppSetting.BASE_URL + '/api/user/' + id + '/', {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                })
            },
            getUserOrder : function(id, token){
                return $http.get(AppSetting.BASE_URL + '/api/user/' + id + '/?order=1', {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                })
            }
        }
    });
})();