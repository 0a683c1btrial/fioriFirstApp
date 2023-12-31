sap.ui.define([
    'cgi/hr/so/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'    
], function(Controller) {
    'use strict';
    return Controller.extend("cgi.hr.so.controller.Search",{
        onInit: function()
        {

        },
        onSearch: function(){
            var name = this.getView().byId("prod_id");
            var category = this.getView().byId("Category");
            var price = this.getView().byId("Price");
            var oDataModel = this.getView().getModel();
            var aFilters = [];
            var oFilter1 = new Filter("PRODUCT_ID", FilterOperator.EQ, name);
            var oFilter2 = new Filter("CATEGORY", FilterOperator.EQ, category);
            aFilters.push(oFilter1);
            aFilters.push(oFilter2);
            var filters = new Filter( {
                filters:aFilters,
                and:false
            });
            oDataModel.read("/ProductSet",
            

            )
            
        }
    });
    
});