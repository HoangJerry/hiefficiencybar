/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tivi-showing')
        .controller('TiviCtrl', TiviCtrl);

    /** @ngInject */
    function TiviCtrl($stateParams, $scope, TiviService, toastr, $rootScope, $location, $window, $uibModal) {
        $rootScope.products = [];
        $rootScope.action = '';
        $rootScope.data_socket = {};
        $rootScope.data_updated = {};
        $scope.status_view = '';
        $scope.pk = undefined;

        $scope.myInterval = 3000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        $rootScope.users_orders = [];
        $rootScope.user_key = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;
        $scope.drink_finish = {};

        $scope.addSlide = function () {
            var newWidth = 600 + slides.length + 1;
            slides.push({
                image: '//unsplash.it/' + newWidth + '/300',
                text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
                id: currIndex++
            });
        };

        $scope.randomize = function () {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };

        for (var i = 0; i < 4; i++) {
            $scope.addSlide();
        }

        // Randomize logic below

        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].id = indexes.pop();
            }
        }

        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }

        // =================== user order status ==============
        function getUserOrderStatus(){
            TiviService.getUserOrderStatus().success(function(res){
                console.log(res)
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

        getUserOrderStatus();

        // ==================== twitter ===================
        function getTwitter(){
            TiviService.getTwitter().success(function(res){
                $scope.twitters = res.result;
                // console.log($scope.twitters)
            }).error(function(err, stt, res){
                toastr.error(detail.err);
            });
        }

        getTwitter();

        setTimeout(function(){
            getTwitter();
        }, 15000);

        // ===================== Counter ===========================
        function animateValue(id, start, end, duration) {
            var range = end - start;
            var current = start;
            var increment = end > start? 1 : -1;
            var stepTime = Math.abs(Math.floor(duration / range));
            var obj = document.getElementById(id);
            var timer = setInterval(function() {
                current += increment;
                obj.innerHTML = current;
                if (current == end) {
                    clearInterval(timer);
                }
            }, stepTime);
        }

        // ================================================
        // =================== get list order ===============
        $scope.data_order = [];
        $scope.data_pending = [];
        $scope.data_processing = [];
        $scope.data_complete = [];

        getDataOrder();

        function getDataOrder(){
            TiviService.getListOrder($rootScope.userLogin.token, 1).success(function(res){
                $scope.data_order = res.results;
                $scope.data_order.forEach(function(item){
                    if(item.status === 0){
                        $scope.data_pending.push(item)
                    } else if(item.status === 10){
                        $scope.data_processing.push(item)
                        $scope.data_processing[0].products.forEach(function(el){
                            if (el.status > 30) {
                                $scope.drink_finish = el;
                                var _index = el.status - 31;
                                console.log(_index)
                                showIngredient(el.drink, el.drink.ingredients[_index]);
                            }
                        })
                    }
                })
            }).error(function(err, stt, res){
                console.log(err)
                if (err.detail){
                    toastr.error(err.detail);
                }
                for( var key in err){
                    var x = 'err.'+key;
                    toastr.error(key.toUpperCase()+": "+eval(x)[0]);
                }
            })
        }

        // ================= socket ==============

        function WebSocketTest() {
            if ("WebSocket" in window) {
                // alert("WebSocket is supported by your Browser!");
                console.log('WebSocket is supported by your Browser!')

                // var us open a web socket
                var ws = new WebSocket("ws://hiefficiencybar.com:80/");
                // var ws = new WebSocket("ws://localhost:8000/");
                ws.onopen = function () {
                    // Web Socket is connected, send data using send()
                    var data = {
                        stream: "orders",
                        payload: {
                            action: "subscribe",
                            data: {
                                action: "create"
                            },
                        }
                    }
                    var mgs = JSON.stringify(data)
                    ws.send(mgs);
                    //alert("Message is sent...");
                    data = {
                        stream: "orders",
                        payload: {
                            action: "subscribe",
                            data: {
                                action: "update"
                            },
                        }
                    }
                    mgs = JSON.stringify(data);
                    ws.send(mgs);


                };

                ws.onmessage = function (evt) {
                    var received_msg = JSON.parse(evt.data);
                    $rootScope.action = received_msg.payload.action;
                    $rootScope.data_socket = received_msg.payload.data;
                    $scope.pk = $rootScope.data_socket.id;

                    if ($rootScope.action === 'create') {
                        if ($rootScope.data_socket.user) {
                            var _user = $rootScope.data_socket.user;
                            _user.key = $scope.pk;
                            $rootScope.users_orders.push(_user);
                            $rootScope.user_key++;

                            $rootScope.data_socket.robot > 0 && animateValue("timer_robot", 0, $rootScope.data_socket.robot, 1);
                            $rootScope.data_socket.tray_number > 0 && animateValue("timer_pickup", 0, $rootScope.data_socket.tray_number, 1);
                            $rootScope.data_socket.statistic_orders_today > 0 && animateValue("timer_drink_served", 0, $rootScope.data_socket.statistic_orders_today, 1);
                        }
                    } else {
                        if ($rootScope.data_socket.status === 10) {
                            $rootScope.products = $rootScope.data_socket.products;
                            $rootScope.user_updated = $rootScope.data_socket.user;

                            $rootScope.users_orders = $rootScope.users_orders.filter(function (el) {
                                return el.key !== $scope.pk;
                            })

                            $rootScope.products.forEach(function (el) {
                                if (el.status > 30) {
                                    $scope.drink_finish = el;
                                    var _index = el.status - 31;
                                    showIngredient(el.drink, el.drink.ingredients[_index]);
                                }
                            });
                        }
                    }

                };

                ws.onclose = function () {
                    console.log('Connection is closed...')
                };

                window.onbeforeunload = function (event) {
                    socket.close();
                };
            }

            else {
                // The browser doesn't support WebSocket
                alert("WebSocket NOT supported by your Browser!");
            }
        }

        WebSocketTest();


        // $('._ingredient').remove();
        var _top = 100;
        var _height = 80;
        var _width_bottom = 60;
        var _bottom = 0;
        var _height_img = $('#_img_ingredient').height();
        var _width_img = $('#_img_ingredient').width();
        var _height_ml = _height_img * 0.8;
        var _height_ml_el = _height_ml;
        var _height_el = 0;
        var _left = 45;
        var _width_top_part = (_height_ml / _height_img) * (_width_img - 0.6 * _width_img) + 0.6 * _width_img;
        var _width_el = _width_img;
        var width_ml = _width_top_part;
        var _transition = 30;
        var _level = 1;

        function showIngredient(data, ingredient) {
            console.log('*************************************')
            console.log(data)
            console.log(ingredient)
            var _ingredients = data.ingredients;
            var _total_part = data.total_part;

            if (ingredient) {
                // _ingredients.forEach(function (el) {
                // var height = Number(_height * Number(el.ratio / _total_part));
                if (ingredient.unit !== 'mL') {
                    var height = _height_ml * (ingredient.ratio / _total_part);
                    _height_el += height;
                    var _left_border = _left * (ingredient.ratio / _total_part);
                    var width = (_height_el / _height_img) * (_width_el - 0.6 * _width_el) + 0.6 * _width_el;

                    var _div = '<div class="color_' + _level + ' _ingredient animated zoomIn" style="animation-duration ' + _transition + 's ; bottom : ' + (_bottom)
                        + 'px ; width : ' + width + 'px ; border-top: ' + height + 'px solid; border-left: ' + _left_border + 'px solid transparent; border-right: '
                        + _left_border + 'px solid transparent;" ></div>';

                    _bottom += height;

                } else {
                    // width_ml += 5;
                    var _left_border = _left * (ingredient.ratio / _total_part);

                    var _div = '<div class="color_' + _level + ' _ingredient animated zoomIn" style="animation-duration ' + _transition + 's ; bottom : ' + (_height_ml_el) + 'px ; width : ' + width_ml + 'px ; border-top: ' + 7 + 'px solid;" ></div>';

                    _height_ml_el += 7;
                }

                var color_ingredient = '<p class="animated zoomIn" style="animation-duration ' + _transition + 's ;"><i class="ingre_color_' + _level + '"></i> '+ ingredient.ingredient.name +'</p>'

                $('#_ingredient').append(_div);
                $('#_ingredient_ctn').append(color_ingredient);

                _level++;
                _transition += 2;
                // });
            }

        }

    }

})();