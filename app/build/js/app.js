'use strict';

var app = angular.module('app', ['ngAnimate','ui.bootstrap', 'mgcrea.ngStrap', 'ui.router',"isteven-multi-select", "w5c.validator", 'oitozero.ngSweetAlert', "app.admin", "app.common", 'ngCookies','ngTagsInput']);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    var access = routingConfig.accessLevels;
    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'views/login.html',
            controller: ['$scope', '$http', 'Auth', '$rootScope', '$state', function($scope, $http, Auth, $rootScope, $state) {
                $scope.isLogin = true;
                $scope.user = {};
                $scope.login = function() {
                    Auth.login(
                        $scope.user,
                        function(user) {
                            console.log('开始执行跳转页面！');
                            if (user.role == 4) {
                                // $state.go('main.admin')
                                window.location.href = '/admin';
                            } else {
                                // $state.go('main.common')
                                window.location.href = '/common';
                                    // $location.url('/admin')
                            }
                        },
                        function(err) {
                            $rootScope.error = err.msg;
                        })
                }

                $scope.showSignup = function() {
                    $scope.isLogin = false;
                }


                $scope.showLogin = function() {
                    $scope.isLogin = true;
                }

                $scope.signup = function() {

                    Auth.register(
                        $scope.user,
                        function(data) {
                            if (data.success === 1) {
                                $scope.isLogin = true;
                            }
                        },
                        function(err) {
                            $rootScope.error = err.msg;
                        })
                }
            }],
            data: {
                access: access.public
            }
        })
        .state('main', {
            abstract: true,
            templateUrl: 'views/main.html'
        })

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/');
                    console.log(response);
                }
                return $q.reject(response);
            }
        }
    })

}]).config(["w5cValidatorProvider", function(w5cValidatorProvider) {
    // 全局配置
    w5cValidatorProvider.config({
        blurTrig: true,
        showError: true,
        removeError: true

    });
    w5cValidatorProvider.setRules({
        name: {
            required: "输入的用户名不能为空",
            pattern: "用户名必须输入字母、数字、下划线,以字母开头",
            w5cuniquecheck: "输入用户名已经存在，请重新输入"
        },
        repeatPassword: {
            required: "重复密码不能为空",
            repeat: "两次密码输入不一致"
        }
    });
}]).run(['$rootScope', 'Auth', '$state', function($rootScope, Auth, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (!('data' in toState) || !('access' in toState.data)) {
            $rootScope.error = '您访问的路径中没有定义权限！';
            event.preventDefault();
        } else if (!Auth.authorize(toState.data.access)) {
            $rootScope.error = '您没有访问下一个路径的权限哦！';
            event.preventDefault();
            if (fromState.url === '^') {
                if (Auth.isLoggedIn()) {
                    if (Auth.isAdmin()) {
                        console.log('进入root用户状态');
                        $state.go('main.admin');
                    } else {
                        console.log('进入普通用户状态');
                        $state.go('main.common');
                    }
                    // if (fromState.url === '/login') {
                    // }
                } else {
                    console.log('出错了，您还没有登陆！');
                    $rootScope.error = '出错了，您还没有登陆！';
                    window.location.href = '/';
                }
            }
        }
    })
}]);
