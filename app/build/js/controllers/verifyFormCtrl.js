'use strict';

app.controller('verifyFormCtrl', function($scope, $http, $stateParams,SweetAlert) {
    $http.get('/admin/answer/list').success(function(answers) {
        var formName = [],
             res = [],
             data = [];
        for(var index in answers){
            formName.push(answers[index].fromName)
        }
        formName.sort();
        for(var i = 0; i< formName.length;){
            var count = 0;
            for(var j = i; j< formName.length; j++){
                if(formName[i] == formName[j]){
                    count++;
                }
            }
            res.push([formName[i],count]);
            i+= count;
        }
        // console.log(res);
        for(var i = 0; i< res.length; i++){
            data[i] = [];
            for(var index in answers){
                if(answers[index].fromName == res[i][0]){
                    data[i].push(answers[index])
                }
            }
            data[i].unshift(res[i][0])
        }
        $scope.answers = [].concat(data);
    })
    
    $scope.check = function($index){
        SweetAlert.swal({
           title: "你确定吗？",
           text: "即将将整个报表记录都审核完",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",confirmButtonText: "确认审核",
           cancelButtonText: "取消审核",
           closeOnConfirm: false,
           closeOnCancel: false }, 
        function(isConfirm){ 
           if (isConfirm) {
              SweetAlert.swal("已经审核完!", "审核完的消息记录将会消失", "success");
              var send = [].concat($scope.answers[$index]);
              // console.log(send[0]);
        	$http.get('/admin/answer/check?formName='+ send[0]).success(function(data){
        		if(data.success == 1){
    		    	$scope.answers.splice($index,1);
        		}
        	})
           } else {
              SweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
           }
        });
    }
});