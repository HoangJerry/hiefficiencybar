/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.order-carts')
		.controller('OrderCartsCtrl', OrderCartsCtrl);

	/** @ngInject */
	function OrderCartsCtrl($scope, OrderService, ManagerUserService, RobotService, toastr, $rootScope, $location, $window) {
		$scope.listData = [];

        // ================= get list ===============
		function getList(){
			OrderService.addCart($rootScope.userLogin.token).success(function(res){
				console.log(res)
				$scope.listData = res.results;
			}).error(function(err, stt, res){
				if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
			});
		}

		getList();

	}

})();