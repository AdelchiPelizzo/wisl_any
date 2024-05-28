/**
 * Created by adpel on 09/05/2024.
 */

({
	  doInit: function(component){
			  let getObjects = component.get("c.getObjectList");
			  getObjects.setCallback( this, (response) => {
            let state = response.getState();
            console.log('>>> '+response.getReturnValue());
            if (state === "SUCCESS") {
							  component.set("v.SObjects", response.getReturnValue());
       			}else if (state === "INCOMPLETE") {
                             // do something
					  }
					 	else if (state === "ERROR") {
							 	var errors = response.getError();
							 	if (errors) {
									 	if (errors[0] && errors[0].message) {
											 	console.log("Error message: " + errors[0].message);
									  }
							 	} else {
									 console.log("Unknown error");
							 }
					  }
				});
				$A.enqueueAction(getObjects);
   },

 		getFieldName: function( component){
				var getFields = component.get("c.getFieldsName");
				getFields.setParam( {objectAPIName: "Account" });
				getFields.setCallback(this, function(response) {
						var state = response.getState();
						if (state === "SUCCESS"){
								var result = response.getReturnValue();
								var plValues = [];
								for (var i = 0; i < result.length; i++) {
										plValues.push({
												label: result[i],
												value: result[i]
										});
								}
								component.set("v.GenreList", plValues);
						}
				});
				$A.enqueueAction(action);
    },

 		handleObjectSelection: function(component, event){
				var selectedValue = event.target.value;
				console.log("object > "+event.target.value);
				component.set("v.selectedObject", selectedValue);
				var getFields = component.get("c.getFieldsName");
				var object = component.get("v.selectedObject");
				console.log("object >> "+object);
				getFields.setParams( {"objectAPIName": object });
				getFields.setCallback(this, function(response) {
						var state = response.getState();
						if (state === "SUCCESS"){
								var result = response.getReturnValue();
								var fieldsValues = [];
								for (var i = 0; i < result.length; i++) {
										fieldsValues.push({value: result[i], label: result[i]});
								}
								component.set("v.Fields", fieldsValues);
						}
				});
				$A.enqueueAction(getFields);
    },

		handleFieldSelection : function(component, event, helper){
				var selectedValues = component.get("v.selectedFields");
				console.log('Selected Fields: ' + selectedValues);
		},

		saveSettings: function(component, event){
			  let sv = component.get("c.saveViewerSettings");
			  let f = component.get("v.selectedFields").join();
			  let object = component.get("v.selectedObject");
			  console.log("saving ..."+object);
			  sv.setParams({ fieldList: f, obj: object});
			  sv.setCallback(this, (response) =>{
					  var state = response.getState();
						if (state === "SUCCESS") {
							  let recId = response.getReturnValue().Id;
							  console.log(recId);
								var navService = component.find("navService");
								var pageReference = {
										type: 'standard__recordPage',
										attributes: {
												recordId: recId,
												actionName: 'view',
												objectApiName: 'Viewer_Setting__c'
										}
								};
								navService.navigate(pageReference);
						}
						else if (state === "INCOMPLETE") {
								// do something
						}
						else if (state === "ERROR") {
								var errors = response.getError();
								if (errors) {
										if (errors[0] && errors[0].message) {
												console.log("Error message: " +
																 errors[0].message);
										}
								} else {
										console.log("Unknown error");
								}
						}
     		});
			 $A.enqueueAction(sv);
   },
});