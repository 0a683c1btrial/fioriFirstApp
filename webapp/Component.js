sap.ui.define([
    'sap/ui/core/UIComponent'  
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("cgi.hr.so.Component",{
     
        metadata:{
            manifest:"json"
        },
        init: function(){
            UIComponent.prototype.init.apply(this, arguments);
            var oRouter = this.getRouter();
            oRouter.initialize();
            
        }

       /* createContent: function(){
            var oView = new sap.ui.view({
                viewName:"cgi.hr.so.view.App",
                type: "XML",
                id: "idAppView"
            });
            var oView1 = new sap.ui.view({
                viewName:"cgi.hr.so.view.View1",
                type: "XML",
                id: "idV1"
            });
            var oView2 = new sap.ui.view({
                viewName:"cgi.hr.so.view.View2",
                type: "XML",
                id: "idV2"
            });
            var contCont = oView.byId("splitApp");
            contCont.addMasterPage(oView1).addDetailPage(oView2);
            return oView;
         } ,*/
       
    });
});