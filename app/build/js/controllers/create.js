'use strict';

app.controller('CreateCtrl', function ($scope, $modal, FormService,$http,$stateParams,$location) {
    // new form
    $scope.form = {};
    // preview form mode
    $scope.previewMode = false;
    // previewForm - for preview purposes, form will be copied into this
    // otherwise, actual form might get manipulated in preview mode
    $scope.previewForm = {};

    // add new field drop-down:
    $scope.addField = {};
    $scope.addField.types = FormService.fields;
    $scope.addField.new = $scope.addField.types[0].name;
    $scope.addField.lastAddedID = 0;

    // accordion settings
    $scope.accordion = {}
    $scope.accordion.oneAtATime = true;

    if($stateParams.id){    
        $http.get('/admin/form/'+$stateParams.id).success(function(form){
            $scope.form = form;
        })
    }else{
        $scope.form.form_id = 1;
        $scope.form.form_name = '我的第一份报表';
        $scope.form.form_fields = [];
        // create new field button click
             
    }
    
    $scope.addNewField = function(){

            // incr field_id counter
            $scope.addField.lastAddedID++;
            if($scope.addField.new == 'textarea'){
                var newField = {
                    "field_id" : $scope.addField.lastAddedID,
                    "field_title" : "题目- " + ($scope.addField.lastAddedID),
                    "field_type" : 'textarea',
                    "field_value" : "在这里输入内容",
                    "field_required" : true
                    // "field_disabled" : false
                };  
            }else{
                var newField = {
                    "field_id" : $scope.addField.lastAddedID,
                    "field_title" : "题目- " + ($scope.addField.lastAddedID),
                    "field_type" : $scope.addField.new,
                    "field_value" : "",
                    "field_required" : true
                    // "field_disabled" : false
                }; 
            }
            $scope.form.form_fields.push(newField);
        } 

    // add new option to the field
    $scope.addOption = function (field){
        if(!field.field_options)
            field.field_options = new Array();

        var lastOptionID = 0;

        if(field.field_options[field.field_options.length-1])
            lastOptionID = field.field_options[field.field_options.length-1].option_id;

        // new option's id
        var option_id = lastOptionID + 1;

        var newOption = {
            "option_id" : option_id,
            "option_title" : "选项" + option_id,
            "option_value" : option_id
        };

        // put new option into field_options array
        field.field_options.push(newOption);
    }
    // delete particular option
    $scope.deleteOption = function (field, option){
        for(var i = 0; i < field.field_options.length; i++){
            if(field.field_options[i].option_id == option.option_id){
                field.field_options.splice(i, 1);
                break;
            }
        }
    }
    // deletes all the fields
    $scope.reset = function (){
        $scope.form.form_fields.splice(0, $scope.form.form_fields.length);
        $scope.addField.lastAddedID = 0;
    }

    // deletes particular field on button click
    $scope.deleteField = function (field_id){
        for(var i = 0; i < $scope.form.form_fields.length; i++){
            if($scope.form.form_fields[i].field_id == field_id){
                $scope.form.form_fields.splice(i, 1);
                break;
            }
        }
    }

    // preview form
    $scope.previewOn = function(){
        if($scope.form.form_fields == null || $scope.form.form_fields.length == 0) {
           $modal({title: '出错了', content: '您还没添加任何表单不能预览', show: true});
        }
        else {
            $scope.previewMode = !$scope.previewMode;
            $scope.form.submitted = false;
            console.log($scope.form);
            angular.copy($scope.form, $scope.previewForm);
        }
    }

    // hide preview form, go back to create mode
    $scope.previewOff = function(){
        $scope.previewMode = !$scope.previewMode;
        $scope.form.submitted = false;
    }

    // decides whether field options block will be shown (true for dropdown and radio fields)
    $scope.showAddOptions = function (field){
        if(field.field_type == "radio" || field.field_type == "dropdown")
            return true;
        else
            return false;
    }

    $scope.send = function (){
        $http.post('/admin/form',$scope.form).success(function(data){
            if(data.success == 1){
                console.log('successful!');
                $location.url('/admin/forms/my');
            }
        })
    }
    
})