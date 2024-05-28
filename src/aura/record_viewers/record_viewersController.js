/**
 * Created by adpel on 07/04/2024.
 */

({
	  doInit: function(component){

					const empApi = component.find('empApi');
					const start = component.find('startView').get('v.value');
					const end = component.find('endView').get('v.value');
					const replayId = -1;

					empApi.subscribe(start, replayId, $A.getCallback(eventReceived => {
							console.log('Received start event ', JSON.stringify(eventReceived));
							let existingEvents = component.get("v.evtInfo");
							existingEvents.push(eventReceived);
							component.set("v.evtInfo", existingEvents);
					}))
					.then(subscription => {
							component.set('v.subscription', subscription);
					});
				 empApi.subscribe(end, replayId, $A.getCallback(eventReceived => {
							console.log('Received end event ', JSON.stringify(eventReceived));
							let existingEvents = component.get("v.evtInfo");
							existingEvents.splice(0, 1);
							component.set("v.evtInfo", existingEvents);
							workspaceAPI.getAllTabInfo().then((result) => {
//									let isTabOpen = false;
//									for (let i = 0; i < result.length; i++) {
//											let caseNr = result[i].title;
//											if (caseNr == result.pageReference.attributes.recordId) {
//													isTabOpen = true;
//											}
//									}
									let existingEvents = component.get("v.evtInfo");
									console.log('event end viewer ' + JSON.stringify(result));
//									if (existingEvents.length > 0) {
//											for (let i = 0; i < existingEvents.length; i++) {
//													let toastEventOut = $A.get("e.force:showToast");
//													toastEventOut.setParams({
//															title: 'Case #' + existingEvents[i].data.payload.caseNumber__c,
//															message: 'Is no longer viewed  by ' + existingEvents[i].data.payload.viewerName__c,
//															mode: "sticky",
//															type: "success",
//													});
//													console.log("round " + i);
//													if (existingEvents[i].data.payload.caseNumber__c === eventReceived.data.payload.caseNumber__c &&
//															existingEvents[i].data.payload.viewerName__c === eventReceived.data.payload.viewerName__c) {
//															if (
//																	existingEvents[i].data.payload.viewerId__c !== userId &&
//																	existingEvents[i].data.payload.caseNumber__c === eventReceived.data.payload.caseNumber__c &&
//																	!isTabOpen
//															) {
//																	console.log(">>> Inactive Notification >>");
//																	let noteInactive = component.get("v.valueInactive");
//																	console.log(">>>" + noteInactive);
//																	let inactiveSoundOn = noteInactive.includes("InactiveSoundOn");
//																	console.log(inactiveSoundOn);
//																	let inactivePopUpOn = noteInactive.includes("InactivePopUpOn");
//																	console.log(inactivePopUpOn);
//
//																	if (inactivePopUpOn) {
//																			toastEventOut.fire();
//																	}
//																	if (inactiveSoundOn) {
//																			let getSound = $A.get('$Resource.alarmEditingOff');
//																			let playSound = new Audio(getSound);
//																			console.log(component.get("v.volume"));
//																			playSound.volume = component.get("v.volume") / 100;
//																			playSound.play();
//																	}
//															}
//															existingEvents.splice(i, 1);
//															component.set("v.evtInfo", existingEvents);
//													}
//											}
//									}
							}).catch(function(error) {
									console.log(error);
							});
					})).then(subscription => {
							component.set('v.subscriptionU', subscription);
					});

			  let getObjName = component.get("c.getSObjectName");
			  getObjName.setParams({ "recId" : component.get("v.rId")});
			  getObjName.setCallback(this, function(response){
					  console.log(JSON.stringify(response));
//					  component.set("v.sObject", response.descriptor);
     		});
			 $A.enqueueAction(getObjName);

				let allViewers = component.get("c.getList");
				allViewers.setCallback(this, function(response) {
					  console.log("get list of viewers");
					  console.log(response.getState());
					  console.log(response.returnValue);
					  console.log(JSON.stringify(response.returnValue));
						component.set("v.evtInfo", JSON.parse(JSON.stringify(response.returnValue)));
				});
			 $A.enqueueAction(allViewers);
   },

 		onTabClose: function(component, event, helper) {
				let tId = event.getParam("tabId");
				let allTab = component.get("v.allTabInfo");
			 	console.log("tab closing ....");
				for(let i = 0; i < allTab.length; i++){
						console.log(allTab[i].tabId);
						console.log("length before >> "+allTab.length);
						if(allTab[i].tabId == tId){
								let recordId = allTab[i].pageReference.attributes.recordId;
								console.log("all tab ..."+allTab);
								allTab.splice(i, 1);
								console.log("all tab ..."+allTab);
								let deleteViewer = component.get("c.deleteViewer");
								deleteViewer.setParams({
										"cId" : recordId,
								});
								deleteViewer.setCallback(this, (response) => {
										if(response.state == "SUCCESS"){
												console.log("viewer deleted");
										}else{
												console.log(response.error[0].message);
										}
								});
								$A.enqueueAction(deleteViewer);
						}
				}
						console.log("length after >> "+allTab.length);
		},

    onTabCreate: function(component, event, helper) {
        let tId = event.getParam("tabId");
        let workspaceAPI = component.find("workspace");
        let allTab = component.get("v.allTabInfo");
        workspaceAPI.getAllTabInfo().then((response) => {
                console.log("ALL tab info ... "+JSON.stringify(response));

        });
        workspaceAPI.getTabInfo({
            tabId: tId
        })
        .then((result) => {
            console.log("tab info ... ", JSON.stringify(result));
            allTab.push(result);
            let viewerRecord = component.get("c.createGenericViewer");
            let recId = result.pageReference.attributes.recordId;
            viewerRecord.setParams({
                "recId": recId,
            });
            viewerRecord.setCallback(this, (response) => {
                if (response.getState() == "SUCCESS") {
										console.log("Viewer created "+JSON.stringify(response));
                } else {
										console.log("Viewer NOT created ");
                }
            });
            $A.enqueueAction(viewerRecord);
        });
    },
});