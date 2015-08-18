'use strict';

angular.module('app.common', ['ui.router','app'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        var access = routingConfig.accessLevels;
        // console.log(access);
        $stateProvider
            .state('main.common', {
                url: '/common',
                data: {
                    access: access.user
                },
                views: {
                	'@main': {
		                templateUrl: 'views/common.html'
                	},

                	'lastForm@main.common':{
		                templateUrl: 'views/lastedForm.html',
		                controller: ['$scope','$http','$interval',function ($scope,$http,$interval){
                            $interval(function(){
                                // console.log('刷新一次！')
    		                	$http.get('/form/lasted').success(function(form){
    		                		// console.log(form);
    		                		$scope.form = {
    		                			name: form.form_name,
    		                			creater: form.form_creater.name,
    		                			time: form.meta.updateAt
    		                		}
    		                	})
                                
                            },3000)
		                }]
                	},

                    'myFormChecked@main.common':{
                        templateUrl: 'views/formChecked.html',
                        controller: ['$scope','$http','$interval',function ($scope,$http,$interval){
                            $interval(function(){
                                $http.get('/common/answer/checked').success(function(answers){
                                    $scope.answers = [].concat(answers);
                                })
                            },3000)
                        }]
                    }
                }
            })
            .state('main.common.profile',{
                url: '/profile',
                views: {
                    '@main.common': {
                        templateUrl: 'views/profile.html',
                        controller: ['$scope','$http',function ($scope,$http) {
                            $http.get('/profile').success(function(user){
                                $scope.user = user;
                            })

                            $scope.submit = function(){
                                $http.post('/user/update',$scope.user).success(function(data){
                                    if(data.success == 1){
                                        $scope.msg ='更新用户信息成功！'
                                    }
                                })
                            }
                        }]   
                    }
                }
            })
            .state('main.common.formNeedWrite', {
                url: '/form/need',
                templateUrl: 'views/formNeedWrite.html',
                controller: ['$scope', '$http',function ($scope, $http) {
                    $http.get('/common/form/unfinish').success(function(data) {
                        $scope.forms = data;
                        // console.log($scope.forms);
                    })
                    // $interval(function(){
                    // },4000);
                }]
            })
            .state('main.common.formNeedWrite.detail', {
                url: '/:id',
                views: {
                	'@main.common':{
		                controller: 'myFormneedCtrl',
		                templateUrl: 'views/myFormNeed.html'
                	}
                }
            })
            .state('main.common.formHasfinished', {
                url: '/form/finish',
                templateUrl: 'views/submitFormList.html',
                controller: 'submitFormListCtrl'
            })
            .state('main.common.formHasfinished.detail', {
                url: '/:id',
                views: {
                    '@main.common':{
                        templateUrl: 'views/submitFormListItem.html',
                        controller: 'submitFormListItemCtrl'
                    }
                }
            })
            .state('main.common.answerUpdate', {
                url: '/answer/update/:id',
                views: {
                	'@main.common':{
		                templateUrl: 'views/myFormNeed.html',
		                controller: ['$scope','$http','$stateParams','$location',function ($scope,$http,$stateParams,$location){
                            $http.get('/common/answer/detail?id=' + $stateParams.id).success(function(answer){
                                $scope.form = {
                                    form_name: answer.fromName,
                                    form_fields: answer.form_fields,
                                    formId: answer.formId,
                                    _id: answer._id
                                }
                            })

                            $scope.submitted = false;
                            $scope.submit = function(){
                                $scope.submitted = true;
                                $http.post('/admin/answer',$scope.form).success(function(data){
                                    if(data.success == 1){
                                        $location.url('/common/form/finish')
                                    }
                                })
                            }
                        }]
                	}
                }
            })
    }])
