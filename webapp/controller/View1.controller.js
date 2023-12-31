sap.ui.define([
    'cgi/hr/so/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'cgi/hr/so/util/formatter'
], function(Controller, Filter, FilterOperator, formatter) {
    'use strict';
    return Controller.extend("cgi.hr.so.controller.View1",{
        formatter:formatter,
        onInit: function()
        {
            this.oRouter = this.getOwnerComponent().getRouter();
            
        },
        /* goToView2: function(){
            var oParent = this.getView().getParent();
            oParent.to("idV2");    
        }, */
        onItemPressSelect: function(oEvent){
           // code to get Router Object
            
            //code to retrieve item index
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            var sItemIndex = sPath.split("/")[sPath.split("/").length - 1];
            this.oRouter.navTo("superman", {
                PRODUCT_ID: sItemIndex
            }); 
        
         /* var oItem = oEvent.getParameter("listItem");
            var prod_id = oItem.getBindingContext().getProperty("PRODUCT_ID");
            oRouter.navTo("superman", {
                PRODUCT_ID: prod_id
            }); */
        },
        onDelete: function(oEvent){
            var olistItem = oEvent.getParameter("listItem");
            var oList = oEvent.getSource();
            oList.removeItem(olistItem);
        },
        onSearch: function(oEvent){
            var sText = oEvent.getParameter("query");
            /* Below code is for multiple filters
            var oFilter1 = new Filter("name", FilterOperator.Contains, sText);
            var oFilter2 = new Filter("type", FilterOperator.Contains, sText);
            var aFilters = [oFilter1, oFilter2];
            var oFilter = new Filter(
            {
                filters: aFilters,
                and: false
            }
            );
            var list = this.getView().byId("idlist");
            list.getBinding("items").filter(oFilter); */

            var oFilter1 = new Filter("Category", FilterOperator.Contains, sText);
            var list = this.getView().byId("idlist");
            list.getBinding("items").filter(oFilter1);
        },
        onAddProd: function(){
            this.oRouter.navTo("add");
        },
        searchProd: function(){
            this.oRouter.navTo("search");    
        }
    });
    
});