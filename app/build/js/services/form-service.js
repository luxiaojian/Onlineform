'use strict';

app.service('FormService', function FormService($http) {

    var formsJsonPath = './static-data/sample_forms.json';

    return {
        fields:[
            {
                name : 'line',
                value : '标题'
            },
            {
                name : 'textfield',
                value : '文本行'
            },
            {
                name : 'email',
                value : '邮箱'
            },
            {
                name : 'password',
                value : '密码'
            },
            {
                name : 'radio',
                value : '单选按钮组'
            },
            {
                name : 'dropdown',
                value : '下拉列表'
            },
            {
                name : 'date',
                value : '日期'
            },
            {
                name : 'textarea',
                value : '文本域'
            },
            {
                name : 'checkbox',
                value : '复选框'
            }
            
        ],
        form:function (id) {
            // $http returns a promise, which has a then function, which also returns a promise
            return $http.get(formsJsonPath).then(function (response) {
                var requestedForm = {};
                angular.forEach(response.data, function (form) {
                    if (form.form_id == id) requestedForm = form;
                });
                return requestedForm;
            });
        },
        forms: function() {
            return $http.get(formsJsonPath).then(function (response) {
                return response.data;
            });
        }
    };
});
