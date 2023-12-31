sap.ui.define([
   ], function() {
    'use strict';
    return ({
        availableColor:function(available){
            if ( available > 200 )
            {return "Success";}
            else
            { return "Error";}

        }
    });
    
});