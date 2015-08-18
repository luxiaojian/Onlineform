'use strict';

angular.module('app.admin', ['ui.router','oitozero.ngSweetAlert','app'])
	.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		var access = routingConfig.accessLevels;
		// console.log(access.user);
		// console.log(access.admin);
		$stateProvider
			.state('main.admin',{
			    url: '/admin',
			    data: {
			    	access: access.admin
			    },
			    views: {
			    	'@main': {
					    templateUrl: 'views/admin.html'
			    	},

			    	'lastForm@main.admin':{
		                templateUrl: 'views/lastedForm.html',
		                controller: ['$scope','$http','$interval',function ($scope,$http,$interval){
		                	$interval(function(){
			                	$http.get('/form/lasted').success(function(form){
			                		$scope.form = {
			                			name: form.form_name,
			                			creater: form.form_creater.name,
			                			time: form.meta.updateAt
			                		}
			                	})
		                	},3000)
		                }]
                	},

                	'formChecked@main.admin':{
		                templateUrl: 'views/adminCheckForm.html',
		                controller: ['$scope','$http','$interval',function ($scope,$http,$interval){
		                	$interval(function(){
			                	$http.get('/admin/answer/checked').success(function(answers){
			                		$scope.answers = [].concat(answers);
			                	})
		                	},3000)
		                }]
                	}
			    }
			})
			.state('main.admin.profile',{
			    url: '/profile',
			    views: {
			        '': {
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
			.state('main.admin.createform',{
			    url: '/form/create',
			    templateUrl: 'views/create.html',
			    controller: 'CreateCtrl'
			})
			.state('main.admin.verifyForm',{
			    url: '/verify/forms',
			    templateUrl: 'views/verifyForm.html',
			    controller: 'verifyFormCtrl'
			})
			.state('main.admin.verifyForm.detail',{
			    url: '/:id',
			    views: {
			    	'@main.admin':{
					    templateUrl: 'views/submitFormListItem.html',
					    controller: ['$scope','$http','$stateParams','$location','SweetAlert',function($scope,$http,$stateParams,$location,SweetAlert){
				    	    $scope.admin = true;
					    	$http.get('/common/answer/detail?id='+ $stateParams.id).success(function(answer) {
					    	    $scope.answer = answer;
					    	})
					    	$scope.checkItem = function(){
					    		$http.post('/admin/answer/check/item?id='+ $stateParams.id).success(function(data) {
					    		    if(data.success == 1){
					    		    	SweetAlert.swal("真棒！", "你刚刚审核通过了一份报表！", "success");
					    		    	$location.url('/admin/verify/forms');
					    		    }
					    		})
					    	}
					    	$scope.sendBack = function(){
					    		$http.post('/admin/answer/sendBack/item?id='+ $stateParams.id).success(function(data) {
					    		    if(data.success == 1){
					    		    	SweetAlert.swal("好残忍！", "你刚刚退回了一份报表", "warning");
					    		    	$location.url('/admin/verify/forms');
					    		    }
					    		})
					    	}
					    }]	
			    	}
			    }
			})
			.state('main.admin.myCreateForm',{
			    url: '/forms/my',
			    templateUrl: 'views/myForm.html',
			    controller: 'myFormCtrl'
			})
			.state('main.admin.mangeLabs',{
			    url: '/labs/mange',
			    templateUrl: 'views/labDetail.html',
			    controller: 'labDetailCtrl'
			})
			.state('main.admin.mangeUsers',{
			    url: '/users/mange',
			    templateUrl: 'views/userDetail.html',
			    controller: 'userDetailCtrl'
			})
			.state('main.admin.mangeUsers.update',{
			    url: '/update/:id',
			    views:{
			    	'@main.admin':{
					    templateUrl: 'views/editUser.html',
					    controller: ['$scope','$http','$stateParams','$location',function($scope,$http,$stateParams,$location){
					    	$http.get('/admin/user/update?id=' + $stateParams.id).success(function(user){
					    		$scope.user = user[0];
					    	})

					    	$scope.submit = function(){
					    		$http({
					    			method: 'POST',
					    			url: '/user/signup',
					    			data: $scope.user
					    		}).success(function(data){
					    			if(data.success == 1){
					    				$location.url('/admin/users/mange')
					    			}
					    		})
					    	}
					    }]
			    	}
			    }
			})
			.state('main.admin.formEdit',{
			    url: '/form/edit/:id',
			    templateUrl: 'views/create.html',
			    controller: 'CreateCtrl'
			})
	}])
