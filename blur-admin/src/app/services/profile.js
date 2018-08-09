(function () {
	'use strict';
	angular.module('BlurAdmin')
		.factory('ProfileService', function ($http, AppSetting) {
			return {
				getUser: function (data) {
					var url = AppSetting.BASE_URL + '/api/user/' + data.id + '/';

					return $http.get(url, {
						headers: {
							'Content-Type': undefined,
							'Authorization': 'Token ' + data.token
						}
					});
				},
				submitProfile: function (data) {
					var url = AppSetting.BASE_URL + '/api/user/' + data.id + '/';
					var fd = new FormData();

					for (var key in data) {
						if(key === 'avatar'){
							if(data[key])
								fd.append(key, data[key]);
						}
						 else{
							fd.append(key, data[key]);
						}
					}
					return $http.patch(url, fd, {
						headers: {
							'Content-Type': undefined,
							'Authorization': 'Token ' + data.token
						}
					})
				},
				changePassword : function(data, token){
					var url = AppSetting.BASE_URL + '/api/user/change/password/';
					var fd  = new FormData();

					for (var key in data){
						fd.append(key, data[key])
					}
					
					return $http.post(url, fd, {
						headers: {
							'Content-Type': undefined,
							'Authorization': 'Token ' + token
						}
					})
				}
			}
		});
})();