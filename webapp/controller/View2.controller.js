sap.ui.define([
    'cgi/hr/so/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/routing/History',
    'sap/m/DisplayListItem',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'cgi/hr/so/util/odataHelper'
    
], function(Controller, MessageBox, MessageToast, History, DisplayListItem, Fragment, Filter, FilterOperator, odataHelper) {
    'use strict';
    return Controller.extend("cgi.hr.so.controller.View2",{
        
        onInit: function()
        {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("superman").attachMatched(this.herculis, this);
            },
        herculis: function(oEvent)
        {   
            /* var fruitId = oEvent.getParameter("arguments").fruitId;
               var sPath = '/fruits/' + fruitId;
               this.getView().bindElement(sPath); */

               var productId = oEvent.getParameter("arguments").PRODUCT_ID;
               var sPath = '/' +  productId;
               this.getView().bindElement(sPath,{
                    expand: 'to_supplier'
               });
               var oModel = this.getView().getModel();
            var that = this;
            // oModel.read("/sales_header_data001Set", {
            //     urlParameters: { "$expand": "to_items" },
            //     success: function (oData, oResposne) {
            //          var salesTable = that.getView().byId("idSalesTable");
            //          salesTable.bindItems(oData.results);
            //         MessageToast.show("Records retrieved successfully");
            //     }    
            // });
              odataHelper.callOdataGet(oModel,"/sales_header_data001Set")
              .then(function(odata){
                var salesTable = that.getView().byId("idSalesTable");
                salesTable.bindItems(oData.results);
                MessageToast.show("Records retrieved successfully");
              })
              .catch(function(oError){
                JSON.parse(oError.responeText).error.innerError.errordetails[0].message;
              });
               var prodId = productId.split("'")[1];
               var sServicePath = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.anubhavService.uri;
               sServicePath = sServicePath + "ProductImgSet('"+ prodId +"')/$value";
               this.getView().byId("idImg").setSrc(sServicePath);
               
               /* bind element through product id.
               var sPath = "/ProductSet('"+ productId +"')";
               this.getView().bindElement({path:sPath}); */
               
        },
        onSupplierSelect: function(oEvent){
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            var supplierId = sPath.split("/")[sPath.split("/").length - 1];
            this.oRouter.navTo("suppl",{
                    supplierId : supplierId
            })
        },
        
        goToView1: function(){
            var oParent = this.getView().getParent();
            oParent.to("idV1");    
        },
         onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.oRouter.navTo("spiderman", {}, true /*no history*/);
			}
		},
        onConfirm: function(oEvent){
            var selItem = oEvent.getParameter("selectedItem");
            var sData = selItem.getTitle();
            var sId= oEvent.getSource().getId();
            if(sId.indexOf("idf4help") !=-1){
                this.oField.setValue(sData);
            }
            else{

            }
           var aFilter = [];
            var olistItem = oEvent.getParameter("selectedItems");
            for(var i=0; i<olistItem.length; i++)
            {
                var oLabel = olistItem[i].getLabel();
                var oSup = new Filter("BpId", FilterOperator.EQ, oLabel);
                aFilter.push(oSup);
            }
            var oFilter = new Filter(
                {
                    filters:aFilter,
                    and:false
                }
            );   
            var oTable = this.getView().byId("supTable");
            oTable.getBinding("items").filter(oFilter); 
        }, 
        onDelete: function(){
            var oTable = this.getView().byId("supTable");
            var selItems = oTable.getSelectedItems();
            for(var i =0; i< selItems.length ; i++)
            {
                oTable.removeItem(selItems[i]);
            }
        },
        onSearchPopup: function(oEvent){
            var valToBeSearched = oEvent.getParameter("value");
            var oFilter = new Filter("name", FilterOperator.Contains, valToBeSearched);
            var oPopup = oEvent.getSource();
            oPopup.getBinding("items").filter(oFilter);
        },
        oValueHelp: null,
        oField: null,
        onF4Help: function(oEvent)
        {
            this.oField = oEvent.getSource();
            if(!this.oValueHelp){
                var that = this;      
                Fragment.load({
                    fragmentName: "cgi.hr.so.fragments.popup",
                    id: "idf4help",
                    type :"XML",
                    controller: this
                }).then(function(oFragment){
                   that.oValueHelp = oFragment;
                   that.oValueHelp.setTitle("F4 help");
                   that.getView().addDependent(that.oValueHelp);
                   that.oValueHelp.bindAggregation("items",{
                    path :'/zsupplierSet' ,
                    template : new DisplayListItem({
                        label : '{BpId}',
                        value : '{Country}'
                    })
                   });
                   that.oValueHelp.open();
                });
            }
            else
            {
                this.oValueHelp.open();
            }
        },
        oSupplierPopup: null,
        onFilterSupplier: function()
        {
            if(!this.oSupplierPopup){
                var that = this;
                Fragment.load({
                fragmentName:"cgi.hr.so.fragments.popup",
                type: "XML",
                id: "idSupFrag",
                controller: this
                 }).then(function(oFragment){
                //inside the callback/promise, we cannot access this pointer viz. our controller object
                //but we can access local variables of caller function   
                  that.oSupplierPopup = oFragment
                  that.oSupplierPopup.setTitle("Suppliers");
                  //Grant the access of all resources which view also has access to - model
                  //allowing parasite (fragment) to access body part (model) though immune system (view)
                  that.getView().addDependent(that.oSupplierPopup);    
                  that.oSupplierPopup.bindAggregation("items",
                  {
                    path: '/zsupplierSet',
                    template: new DisplayListItem({
                        label: '{BpId}',
                        value: '{BpRole}'
                    })
                  });
                  that.oSupplierPopup.open();
                });

            }else
            {
              this.oSupplierPopup.open();  
            }
        },
        onSave: function(){
            var oResourceModel = this.getView().getModel("i18n");
                    
            MessageBox.confirm("Do you want to save?",{
                onClose: function(status)
                {
                   if(status === "OK")
                   {
                    var saveText = oResourceModel.getText("XMSG_SAVE");
                    MessageToast.show(saveText);
                   }
                   else
                   {
                    MessageBox.error("Oops!.. something went wrong");
                   }
                }
            });
        }
    });
    
});