/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.profile')
        .controller('ProfilePageCtrl', ProfilePageCtrl);

    function ProfilePageCtrl($window, $scope, fileReader, $filter, $uibModal, ProfileService, baProgressModal, toastr, $rootScope) {
        $scope.picture = $filter('profilePicture')('Nasta');

        $scope.data_profile = {};
        $scope.isChangePassword = false;
        $scope.isConfirmPassword = true;
        $scope.errorMsg = '';
        $scope.isChangeAvatar = false;
        $scope.data_update = {};
        $scope.isUpdated = false;

        $scope.option = {
			"autoDismiss": false,
			"positionClass": "toast-bottom-right",
			"type": "success",
			"timeOut": "5000",
			"extendedTimeOut": "2000",
			"allowHtml": false,
			"closeButton": false,
			"tapToDismiss": false,
			"progressBar": false,
			"newestOnTop": false,
			"maxOpened": 0,
			"preventDuplicates": false,
			"preventOpenDuplicates": false
		};

        getUser();

        function getUser() {
            ProfileService.getUser($scope.currentUser).success(function (res) {
                $scope.data_profile = res;
                $scope.birthday = new Date(res.birthday);
                $scope.last_login = new Date(res.last_login);
                $scope.date_joined = new Date(res.date_joined);
            })
        }

        //   ==================== open modal change password ================
        $scope.openChangePassword = function (size) {
            var page = 'app/pages/profile/change-password/modalChangePassword.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                resolve: {
                    token: function () {
                        return $scope.currentUser.token;
                    }
                },
                controller: 'ProfileModalCtrl',
            });
        };

        // ============= save model change password ==============
       

        //===========  updateProfile ================================
        $scope.updateProfile = function (field, value) {
            $scope.data_update[field] = value;
            $scope.isUpdated = true;
        }

        $scope.changeBirthday = function (value) {
            var _birthday = $filter('date')(value, 'yyyy-MM-dd', 'GMT');
            $scope.birthday = _birthday;
            $scope.data_update.birthday = _birthday;
            $scope.isUpdated = true;
        }

        $scope.confirmPassword = function (password, res_password) {
            if (res_password !== password) {
                $scope.isConfirmPassword = false;
                $scope.old_password = $scope.new_password = $scope.res_password = '';
                $scope.errorMsg = 'Error password!';
            } else {
                $scope.data_update.new_password = password;
            }
        }

        // submit Profile
        $scope.submitProfile = function () {

            $scope.data_update.token = $scope.currentUser.token;
            $scope.data_update.id = $scope.data_profile.id;

            ProfileService.submitProfile($scope.data_update).success(function (res) {
                toastr.success('', 'Change profile success!');
                $scope.data_profile = res;
                $scope.birthday = new Date(res.birthday);
                $scope.last_login = new Date(res.last_login);
                $scope.date_joined = new Date(res.date_joined);
                res.token = $scope.currentUser.token;
                $window.localStorage['currentUser'] = JSON.stringify(res);
                $rootScope.userLogin = res;
            }).error(function (err, status, response) {
                toastr.error('', err.detail);
            });
        }

        // ========================= datepicker=========================
        $scope.today = function () {
            $scope.birthday = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.birthday = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openDatePicker = function (name) {
            name === 'birthday' ? $scope.popupDatePicker.openBirthday = true : (name === 'lastLogin' ? $scope.popupDatePicker.openLastLogin = true
                : $scope.popupDatePicker.openDateJoined = true);
            // $scope.popupDatePicker.opened = true;
        };


        $scope.setDate = function (year, month, day) {
            $scope.birthday = new Date(year, month, day);
        };

        $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popupDatePicker = {
            openBirthday: false,
            openLastLogin: false,
            openDateJoined: false
        };


        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
        // ==========================================================================





        $scope.removePicture = function () {
            $scope.picture = $filter('appImage')('theme/no-photo.png');
            $scope.noPicture = true;
        };

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();

        };

        $scope.unconnect = function (item) {
            item.href = undefined;
        };

        $scope.showModal = function (item) {
            $uibModal.open({
                animation: false,
                controller: 'ProfileModalCtrl',
                templateUrl: 'app/pages/profile/profileModal.html'
            }).result.then(function (link) {
                item.href = link;
            });
        };

        $scope.getFile = function () {
            fileReader.readAsDataUrl($scope.file, $scope)
                .then(function (result) {
                    $scope.data_profile.picture = result;
                });
        };

        $scope.file = '';
        $scope.onFileSelect = function ($file) {
        }

        $scope.changeAvatar = function () {
        }

        $scope.switches = [true, true, false, true, true, false];

        $scope.stepsModel = [];

        $scope.imageUpload = function (event) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }

        $scope.imageIsLoaded = function (e) {
            $scope.isUpdated = true;
            $scope.$apply(function () {
                $scope.stepsModel.push(e.target.result);
                $scope.isChangeAvatar = true;
                $scope.picture = e.target.result;

                var file = $window.document.getElementById('uploadFile');
                $scope.data_update.avatar = file.files[0];
            });
        }
    }

})();
