'use strict';

app.directive('addleader', function ($http) {
    return {
        require: 'ngModel',
        link: function(scope,ele,attrs,controller){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                $http({
                    method: 'POST',
                    url: '/admin/lab/addLeader?name='+scope.form.founder                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                }).success(function(founder){
                    scope.leader = founder;
                    console.log(scope.leader);
                })
            })
        }
    };
  });