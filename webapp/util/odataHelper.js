sap.ui.define([
    ],function(){
    return({
        callOdataGet:function(odataModel, sPath) {
          return new Promise(function(resolve,reject)
          { 
            odataModel.read(sPath, {
                    urlParameters: { "$expand": "to_items" },
                    success: function (oData, oResposne) {
                       resolve(oData);
                    },
                    error: function (oError) {
                       resolve(oError);
                    }     
                });
            });
        }
    });
    
});