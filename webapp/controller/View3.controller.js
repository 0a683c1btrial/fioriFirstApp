sap.ui.define([
    'cgi/hr/so/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast'    
], function(Controller, MessageBox, MessageToast) {
    'use strict';
    return Controller.extend("cgi.hr.so.controller.View3",{
        onInit: function()
        {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("suppl").attachMatched(this.herculis, this);
        },
        herculis: function(oEvent)
        {
            var supplierId = oEvent.getParameter("arguments").supplierId;
            var sPath = '/suppliers/' + supplierId;
            this.getView().bindElement(sPath);
        },
        changeChart: function(oControlEvent)
        {
            var sText = oControlEvent.getParameter("selectedItem").getText();
            this.getView().getModel("local").setProperty("/chartType", sText);
            this.getView().byId("idVizFrame").setVizType(sText);
            var tempobj = oControlEvent.getParameters();
            

        }
       
    });
    
});