'use strict';

app.directive('ensureunique', function ($http) {
    return {
        require: 'ngModel',
        link: function(scope,ele,attrs,controller){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                $http({
                    method: 'POST',
                    url: '/user/find/' + attrs.ensureunique,
                    data: {
                        field: attrs.ensureunique,
                        value: scope.form.name
                    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                }).success(function(data){
                    console.log(data.isnotExit);
                    controller.$setValidity('unique', data.isnotExit);
                }).error(function(data){
                    controller.$setValidity('unique', false);
                })
            })
        }
    };
  });
