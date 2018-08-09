/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop($window, $location) {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/pageTop.html',
      link:function($scope, element, attrs) {
        $scope.logout = function() {
          $window.localStorage.removeItem('currentUser');
          $location.path('/login');
        }
      }
    };
  }

})();