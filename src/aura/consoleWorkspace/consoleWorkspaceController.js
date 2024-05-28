/**
 * Created by adpel on 03/04/2024.
 */

/**
 * Created by Adelchi on 01/04/2022.
 */

({
    onInit: function(component, event, helper) {

        let language = $A.get("$Locale.language");
        if (language == "it") {
            let header = [];
            header.push("Per soluzioni su misura vai a ");
            header.push(" oppure ");
            header.push(" .");
            component.set("v.header1", header);
            let header_ = [];
            header_.push("Nome Utente");
            header_.push("Numero Caso");
            header_.push("Inizio");
            component.set("v.header2", header_);
            component.set("v.optionsActive", [{
                    'label': 'Suono',
                    'value': 'ActiveSoundOn'
                },
                {
                    'label': 'Messaggio',
                    'value': 'ActivePopUpOn'
                }
            ]);
            component.set("v.optionsInactive", [{
                    'label': 'Suono',
                    'value': 'InactiveSoundOn'
                },
                {
                    'label': 'Messaggio',
                    'value': 'InactivePopUpOn'
                }
            ]);
            component.set("v.viewerInOut", ['Inizio visione', 'Fine visione']);
            component.set("v.notifications", "Notificazioni");
            component.set("v.volumeHeader", "Volume suono");
        } else if (language == "fr") {
            let header = [];
            header.push("Pour autre solutions contactez ");
            header.push(" ou par ");
            header.push(" .");
            component.set("v.header1", header);
            let header_ = [];
            header_.push("Nom Utilisateur");
            header_.push("Numero requête");
            header_.push("Heure");
            component.set("v.header2", header_);
            component.set("v.optionsActive", [{
                    'label': 'Son',
                    'value': 'ActiveSoundOn'
                },
                {
                    'label': 'Message',
                    'value': 'ActivePopUpOn'
                }
            ]);
            component.set("v.optionsInactive", [{
                    'label': 'Son',
                    'value': 'InactiveSoundOn'
                },
                {
                    'label': 'Message',
                    'value': 'InactivePopUpOn'
                }
            ]);
            component.set("v.viewerInOut", ['Vision Commencé', 'Vision Terminé']);
            component.set("v.notifications", "Notifications");
            component.set("v.volumeHeader", "Volume sonore");
        } else if (language == "es") {
            let header = [];
            header.push("Para tus personalizaciones ");
            header.push(" o envia un ");
            header.push(" .");
            component.set("v.header1", header);
            let header_ = [];
            header_.push("Nombre usuario");
            header_.push("Número caso");
            header_.push("Hora");
            component.set("v.header2", header_);
            component.set("v.optionsActive", [{
                    'label': 'Sonido',
                    'value': 'ActiveSoundOn'
                },
                {
                    'label': 'Mensaje',
                    'value': 'ActivePopUpOn'
                }
            ]);
            component.set("v.optionsInactive", [{
                    'label': 'Sonido',
                    'value': 'InactiveSoundOn'
                },
                {
                    'label': 'Mensaje',
                    'value': 'InactivePopUpOn'
                }
            ]);
            component.set("v.viewerInOut", ['Visión iniciada', 'Visión terminada']);
            component.set("v.notifications", "Notificaciones");
            component.set("v.volumeHeader", "Volumen sonido");
        } else {
            let header = [];
            header.push("For custom solutions contact ");
            header.push(" or ");
            header.push(" us.");
            component.set("v.header1", header);
        }
        let userId = $A.get("$SObjectType.CurrentUser.Id");

        var allViewers = component.get("c.getList");
        allViewers.setCallback(this, function(response) {
            component.set("v.evtInfo", JSON.parse(JSON.stringify(response)));
        })

        //    let workspaceAPI = component.find("workspace");
        //    workspaceAPI.getAllTabInfo().then((result) => {
        //      console.log(JSON.stringify(result));
        //      for (let i = 0; i < result.length; i++) {
        //        let focusedTabId = result[i].tabId;
        //        workspaceAPI.closeTab({
        //          tabId: focusedTabId
        //        });
        //      }
        //    }).catch(function(error) {
        //      console.log(error);
        //    });

        let volume_settings = localStorage.getItem("volume");
        console.log(volume_settings);
        if (volume_settings) {
            component.set("v.volume", volume_settings);
        }

        let WISL_settings = localStorage.getItem(userId);
        console.log(WISL_settings);
        if (WISL_settings) {
            let dataArray = WISL_settings.split(',');
            console.log(dataArray);
            let activeSetting = "";
            let inactiveSetting = "";
            for (let i = 0; i < dataArray.length; i++) {
                switch (dataArray[i]) {
                    case "ActiveSoundOn":
                        activeSetting += "ActiveSoundOn";
                        break
                    case "ActivePopUpOn":
                        activeSetting += ",ActivePopUpOn";
                        break
                    case "InactiveSoundOn":
                        inactiveSetting += "InactiveSoundOn";
                        break
                    case "InactivePopUpOn":
                        inactiveSetting += ",InactivePopUpOn";
                }
            }
            console.log(activeSetting);
            console.log(inactiveSetting);
            component.set("v.valueActive", activeSetting);
            component.set("v.valueInactive", inactiveSetting);
        }

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
                let isTabOpen = false;
                console.log("ALL TABS OPEN  " + JSON.stringify(result));
                for (let i = 0; i < result.length; i++) {
                    let caseNr = result[i].title;
                    if (caseNr == eventReceived.data.payload.caseNumber__c) {
                        isTabOpen = true;

                    }
                }
                let existingEvents = component.get("v.evtInfo");
                console.log('Received event unsubscription ' + JSON.stringify(eventReceived));
                if (existingEvents.length > 0) {
                    for (let i = 0; i < existingEvents.length; i++) {
                        let toastEventOut = $A.get("e.force:showToast");
                        toastEventOut.setParams({
                            title: 'Case #' + existingEvents[i].data.payload.caseNumber__c,
                            message: 'Is no longer viewed  by ' + existingEvents[i].data.payload.viewerName__c,
                            mode: "sticky",
                            type: "success",
                        });
                        console.log("round " + i);
                        if (existingEvents[i].data.payload.caseNumber__c === eventReceived.data.payload.caseNumber__c &&
                            existingEvents[i].data.payload.viewerName__c === eventReceived.data.payload.viewerName__c) {

                            //  TROUBLESHOOT FROM HERE

//                            console.log(existingEvents[i].data.payload.viewerId__c);
//                            console.log(userId);
//                            console.log(existingEvents[i].data.payload.caseNumber__c);
//                            console.log(eventReceived.data.payload.caseNumber__c);
//                            console.log(isTabOpen);

                            if (
                                existingEvents[i].data.payload.viewerId__c !== userId &&
                                existingEvents[i].data.payload.caseNumber__c === eventReceived.data.payload.caseNumber__c &&
                                !isTabOpen
                            ) {
                                console.log(">>> Inactive Notification >>");
                                let noteInactive = component.get("v.valueInactive");
                                console.log(">>>" + noteInactive);
                                //                let onOff = component.get("v.switch");
                                let inactiveSoundOn = noteInactive.includes("InactiveSoundOn");
                                console.log(inactiveSoundOn);
                                let inactivePopUpOn = noteInactive.includes("InactivePopUpOn");
                                console.log(inactivePopUpOn);

                                if (inactivePopUpOn) {
                                    toastEventOut.fire();
                                }
                                if (inactiveSoundOn) {
                                    let getSound = $A.get('$Resource.alarmEditingOff');
                                    let playSound = new Audio(getSound);
                                    console.log(component.get("v.volume"));
                                    playSound.volume = component.get("v.volume") / 100;
                                    playSound.play();
                                }
                            }

                            //  TROUBLESHOOT TO HERE

                            existingEvents.splice(i, 1);
                            component.set("v.evtInfo", existingEvents);
                        }
                    }
                }
            }).catch(function(error) {
                console.log(error);
            });
        })).then(subscription => {
            component.set('v.subscriptionU', subscription);
        });
    },

    onTabClose: function(component, event, helper) {
        let tId = event.getParam("tabId");
        let allTab = component.get("v.allTabInfo");
        for(let i = 0; i < allTab.length; i++){
            console.log(allTab[i].tabId);
            console.log("length before >> "+allTab.length);
            if(allTab[i].tabId == tId){
                let caseId = allTab[i].pageReference.attributes.recordId;
                console.log("case Id >> "+caseId);
                let deleteViewer = component.get("c.deleteViewer");
                deleteViewer.setParams({
                    "cId" : caseId,
                });
                deleteViewer.setCallback(this, (response) => {
                    if(response.state == "SUCCESS"){
                        console.log("viewer deleted");
                        allTab.splice( i, 1);
                    }else{
                        console.log(response.error[0].message);
                    }
                });
                $A.enqueueAction(deleteViewer);
            }
            console.log("length after >> "+allTab.length);
        }
//        console.log(JSON.stringify(component.get("v.allTabInfo")));
//        let workspaceAPI = component.find("workspace");
//        workspaceAPI.getAllTabInfo().then((response) => {
//                component.set("v.allTabInfo", response)
//                console.log(JSON.stringify(response));
//                let allTabInfo = component.get("v.allTabInfo");
//                console.log(JSON.stringify(allTabInfo));
//        });

        //    workspaceAPI.getAllTabInfo().then((result) => {
        //        console.log(JSON.stringify(result));
        //        for (let i = 0; i < result.length; i++) {
        //          let focusedTabId = result[i].tabId;
        //          workspaceAPI.closeTab({
        //            tabId: focusedTabId
        //          });
        //        }
        //    }).catch(function(error) {
        //        console.log(error);
        //    });

//        console.log(allTabInfo);
        //      console.log("allTabInfo ::: "+allTabInfo);

        //      let data = result[0].title.split("|").map((data) => data.trim());
        //      console.log(">>> case nr "+data[0]);
        //      console.log(">>> record Id "+result[0].recordId);
        //      console.log(">>> user Full Name  " + component.get("v.currentUser").FirstName +" "+component.get("v.currentUser").LastName);
        //      component.set("v.allTabInfo", result);
        //      let allTabInfo = component.get("v.allTabInfo");
        //      console.log("allTabInfo .>> "+JSON.stringify(result));

        //    allTabInfo.getAllTabInfo().then((result) => {
        //      result.forEach(( info ) => {
        //          console.log("info >>> "+JSON.stringify(info));
        //      });
        //    });

        //    workspaceAPI.getAllTabInfo().then((result) => {
        //      component.set("v.allTabInfo", result);
        //      result.forEach(( info ) => {
        //          console.log("info >>> "+JSON.stringify(info));
        //     });
        //
        //
        //
        //    }).catch(function(error) {
        //      console.log(error);
        //    });
    },

    onTabCreate: function(component, event, helper) {
        let tId = event.getParam("tabId");
        let workspaceAPI = component.find("workspace");
        let allTab = component.get("v.allTabInfo");
        workspaceAPI.getAllTabInfo().then((response) => {
                console.log(JSON.stringify(response));

        });
        workspaceAPI.getTabInfo({
            tabId: tId
        })
        .then((result) => {
            console.log("tabInfo result ", JSON.stringify(result));
            allTab.push(result);
            let viewerRecord = component.get("c.createViewer");
            let recId = result.pageReference.attributes.recordId;
            viewerRecord.setParams({
                "cId": recId,
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

    cleanUp: function(component, event, helper) {
        component.set("v.showConfirmDialog", true);
    },

    handleConfirmDialogYes: function(component, event, helper) {
        component.set("v.evtInfo", []);
        component.set('v.showConfirmDialog', false);
    },

    handleConfirmDialogNo: function(component, event, helper) {
        component.set('v.showConfirmDialog', false);
    },

    notificationSwitch: function(component, event) {
        let elm = component.find("onOff");
        $A.util.toggleClass(elm, "on");
        let onOff = component.get("v.switch");
        if (onOff == "off") {
            component.set("v.switch", "on");
            let onOff = component.get("v.switch");
            console.log(onOff);
        }
        if (onOff == "on") {
            component.set("v.switch", "off");
            let onOff = component.get("v.switch");
            console.log(onOff);
        }
    },

    handleChange: function(component, event) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let noteInactive = component.get("v.valueInactive");
        let noteActive = component.get("v.valueActive");
        localStorage.setItem(userId, noteActive + "," + noteInactive);
        let settings = localStorage.getItem(userId);
        console.log(settings);

    },

    handleVolume: function(component, event) {
        localStorage.setItem("volume", component.get("v.volume"));
        console.log("volume " + localStorage.getItem("volume"));
    },

    notificationSwitchSound: function(component, event) {
        let elm = component.find("onOffSound");
        $A.util.toggleClass(elm, "on");
        let onOff = component.get("v.switchSound");
        if (onOff == "off") {
            component.set("v.switchSound", "on");
            let onOff = component.get("v.switchSound");
            console.log(onOff);
        }
        if (onOff == "on") {
            component.set("v.switchSound", "off");
            let onOff = component.get("v.switchSound");
            console.log(onOff);
        }
    },

    showSettings: function(component, event) {
        let elm = component.find("showSet");
        let elmBtnIcn = component.set("v.iconName", "utility:contract_alt");
        $A.util.toggleClass(elm, "hide");
        let onOff = component.get("v.showSet");
        if (onOff == false) {
            component.set("v.showSet", true);
            let onOff = component.get("v.switch");
            console.log(onOff);
        }
        if (onOff == true) {
            let elmBtnIcn = component.set("v.iconName", "utility:expand_alt");
            component.set("v.showSet", false);
            let onOff = component.get("v.showSet");
            console.log(onOff);
        }
    }

});