sap.ui.define([
    'sap/ui/core/mvc/Controller'
    
], function(Controller) {
    'use strict';
    return Controller.extend("cgi.hr.so.controller.BaseController",{
       reuseFunction: function(){
        alert('Hi');
       }
    })
});