sap.ui.define([
    'cgi/hr/so/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/Fragment',
    'sap/m/DisplayListItem',
	"sap/m/ColumnListItem",
	"sap/base/util/Properties"
], function(Controller,
	JSONModel,
	MessageToast,
	MessageBox,
	Fragment,
	DisplayListItem,
	ColumnListItem,
	Properties) {
    'use strict';
    return Controller.extend("cgi.hr.so.controller.Add",{
        onInit: function()
        {
            var  oJsonModel = new JSONModel();
            oJsonModel.setData({
                "prodData":{
                    "ProductId" : "",
                    "TypeCode" : "PR",
                    "Category" : "Notebooks",
                    "Name" : "",
                    "SupplierId" : "0100000051",
                    "SupplierName" : "TECUM",
                    "Description" : "",
                    "Price" : "0.00",
                    "CurrencyCode" : "EUR",
                    "DimUnit" : "CM",
                    "TaxTarifCode" : 1
                  }
            });
            this.getView().setModel(oJsonModel,"prodModel");
            this.oLocalModel = oJsonModel;
            this.setMode("create");
       },
       onClear:function(){
        this.oLocalModel.setData({
            "prodData":{
                "ProductId" : "",
                "TypeCode" : "PR",
                "Category" : "Notebooks",
                "Name" : "",
                "SupplierId" : "0100000051",
                "SupplierName" : "TECUM",
                "Description" : "",
                "Price" : "0.00",
                "CurrencyCode" : "EUR",
                "DimUnit" : "CM",
                "TaxTarifCode" : 1
              }
        });
        
       },
       prodId:"",
       mode:"create",
       setMode:function(sMode){
            this.mode = sMode;
            if(this.mode == "create")
            {
              this.getView().byId("prodId").setEnabled(true);
              this.getView().byId("savebtn").setText("Save");
              this.getView().byId("delbtn").setEnabled(false);            
            }
            else{
              this.getView().byId("prodId").setEnabled(false);
              this.getView().byId("savebtn").setText("Update");
              this.getView().byId("delbtn").setEnabled(true);
              this.getView().byId("idName").focus();      
            }
       },
       onLoadSingle:function(oEvent){
            this.prodId = oEvent.getSource().getValue();
            this.prodId = this.prodId.toUpperCase();
            oEvent.getSource().setValue(this.prodId);
            var oDataModel = this.getView().getModel();
            var that = this;
            oDataModel.read("/zproduct001Set('"+ this.prodId +"')",{
                success:function(data,oResponse){
                    MessageToast.show("Record retrieved successfully");
                    that.oLocalModel.setProperty("/prodData",data);
                    that.setMode("update");
                },
                error:function(){
                    MessageToast.show("Problem in retrieving record");
                    that.setMode("create");  
                }
            })
       },
       onAddRow:function(oEvent){
            var oItem = new sap.m.ColumnListItem({
                cells:[
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                    new sap.m.Input(),
                ]
            });
            var oTable = this.getView().byId("idProductsTable");
            oTable.addItem(oItem);


       },
       onConfirm:function(oEvent){
            var selItem = oEvent.getParameter("selectedItem");
            var sData = selItem.getValue();
            this.oLocalModel.setProperty("/prodData/SupplierId",sData);
            this.oLocalModel.setProperty("/prodData/SupplierName",selItem.getLabel());
        },
       oValueHelp:null,
       onF4Supplier:function(){
            if(!this.oValueHelp){
                var that = this;      
                Fragment.load({
                    fragmentName: "cgi.hr.so.fragments.popup",
                    id: "idf4supplier",
                    type :"XML",
                    controller: this
                }).then(function(oFragment){
                   that.oValueHelp = oFragment;
                   that.oValueHelp.setTitle("F4 help");
                   that.getView().addDependent(that.oValueHelp);
                   that.oValueHelp.bindAggregation("items",{
                    path :'/zsupplierSet' ,
                    template : new DisplayListItem({
                        label : '{SupplierId}',
                        value : '{SupplierName}'
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
       productSelectionChange:function(){
       },
       onUpdate:function(){
        var oTable = this.getView().byId("idProductsTable");
        //var selArray = oTable.getSelectedContexts(false);
        //if (selArray.length === 0){
        //    MessageBox.show("Please select an item to update");
        //    return;
        //}
        var oDataModel = this.getView().getModel();
        if(oDataModel.hasPendingChanges()){
        //var oDeferredGroups = [];
        //oDeferredGroups = oDataModel.getDeferredGroups().push("updateGroup");
        oDataModel.setDeferredGroups(oDataModel.getDeferredGroups().concat(["updateGroup"]));
        oDataModel.setUseBatch(true);
        var oPendingChanges = oDataModel.getPendingChanges();
        var aPathPendingChanges = Object.keys(oPendingChanges);
        var aPendingChangesObjects = aPathPendingChanges.map(sPath => oDataModel.getProperty("/" + sPath));
        //for(var i=0; i<selArray.length; i++){
        //    var oEntry = selArray[i].getObject();
        for(var i=0; i<aPendingChangesObjects.length; i++){
                var oEntry = aPendingChangesObjects[i];
                oDataModel.update("/zproduct001Set('"+  oEntry.ProductId +"')", oEntry, {
                method:"POST",
                groupId:"updateGroup",    
                success:function(){
                    MessageBox.show("Records inserted successfully");
                },
                error:function(oError){
                    MessageBox.show(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                }
            })
        }
        oDataModel.submitChanges({
            groupId:"updateGroup",
            success:function(){
                MessageBox.show("Records updated successfully");
            },
            error:function(oError){
                MessageBox.show(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
            }
        }) }   

        /* var that = this;
        selArray.forEach(function(item){
            var selContext = item;
            var selObject  = selContext.getObject();
            var selPath    = selContext.getPath();  
            that.oDataModel.update(selPath, selObject, {
                success:function(){

                },
                error:function(){
                    MessageBox.show(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                }
            });
        })
            oDataModel.submitChanges({
                success:function(){
                    MessageBox.show("Records updated successfully");
                },
                error:function(){
                    MessageBox.show(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                }
            }) */
       
       },
       onSave:function(){
        var payLoad = this.oLocalModel.getProperty("/prodData");
        if(!payLoad.ProductId || !payLoad.Name)
        {
            MessageBox.show("Please enter valid name and product id"); 
            return;
        }
        var oDataModel = this.getView().getModel();
        if(this.mode == "create"){
        oDataModel.create("/zproduct001Set", payLoad, {
            success:function(){
                MessageBox.show("Record saved to database");
            },
            error:function(oError){
                var errorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                MessageBox.show(errorMessage + "Save has been rejected");    
            }
        })
        }
       else{
        oDataModel.update("/zproduct001Set('"+ this.prodId +"')", payLoad, {
            success:function(){
                MessageToast.show("Record updated successfully");
            },
            error:function(oError){
                var errorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                MessageBox.error("Details of the error is" +  errorMessage);
            }
        })
       } 
    },
    onLoadExpensive: function(){
        var oDataModel = this.getView().getModel();
        var that = this;
        oDataModel.callFunction("/GetMoseExpensiveProduct",
        {
            urlParameters:{
                "i_category":this.getView().byId("category").getSelectedKey()
            },
            success:function(data,oResponse){
                that.oLocalModel.setProperty("/prodData",data);
                that.prodId = data.PRODUCT_ID;
                that.setMode("update");
                    
            }
        })

    },
    onDelete:function(){
        var oDataModel = this.getView().getModel();
        var that = this;
        oDataModel.remove("/ProductSet('"+ this.prodId +"')",{
            success:function(){
                MessageToast.show("Message deleted successfully");
                that.onClear();
            },
            error:function(){
                var errorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                MessageBox.error("oops! save has been rejected Error: " + errorMessage );                   
            }
        })
    }


    });
    
});