/**
 * Created by adpel on 06/04/2024.
 */

import { LightningElement, api, track, wire } from 'lwc';
import Id from "@salesforce/user/Id";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import  createViewer from '@salesforce/apex/ViewersCtrl_Generic.createGenericViewer';
import  deleteViewer from '@salesforce/apex/ViewersCtrl_Generic.deleteGenericViewer';
import  getViewerSettings from '@salesforce/apex/ViewersCtrl_Generic.getViewerSettings';
import  getList from '@salesforce/apex/ViewersCtrl_Generic.getList';
import viewerUserIdFIELD from '@salesforce/schema/ViewerGeneric__c.Name';
import viewerGenericIdFIELD from '@salesforce/schema/ViewerGeneric__c.Id';
import recordIdFIELD from '@salesforce/schema/ViewerGeneric__c.record_id__c';
import UserNameFIELD from '@salesforce/schema/User.Name';
import userEmailFIELD from '@salesforce/schema/User.Email';
import userIsActiveFIELD from '@salesforce/schema/User.IsActive';
import userAliasFIELD from '@salesforce/schema/User.Alias';
import name from '@salesforce/schema/User.Name';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled, IsConsoleNavigation} from 'lightning/empApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import LightningModal from 'lightning/modal';

export default class Viewers extends NavigationMixin(LightningElement, LightningModal ) {

		@wire(CurrentPageReference)
		pageRef;

		channelStart = '/event/StartViewing__e';
		channelEnd = '/event/EndViewing__e';
//		isSubscribeDisabled = false;
//		isUnsubscribeDisabled = !this.isSubscribeDisabled;
		@track error;
		@track userId = Id;
		@track currentUserName;
		@track currentUserEmail;
		@track currentIsActive;
		@track currentUserAlias;
		@track viewerRecordCurrent;
		@api recordId;
		@api objectApiName;
		isVisible = false;
		recId;
		viewersList;
		wiredViewersListResults;
		origin = window.location.href;
		iconNameOpen = "utility:down";
		iconNameFilter;
		filterLabel;
		recordIdFromEvent;
		@track detailsFields;
		@track objTypeDetails;
		isModalVisible = false;
		modalHeader = "";

//		@wire(IsConsoleNavigation) isConsoleNavigation;

		clicked(){alert("clicked");}

		@wire(getList)
		wiredViewersList(result) {
			  this.wiredViewersListResults = result;
				if (result.data) {
					  let data = JSON.parse(JSON.stringify(result.data));
//					  for(let i = 0; i < data.length; i++){
//								if(this.objects.includes(data[i].objectType__c)){
//										console.log("contained !!! "+data[i].objectType__c);
//								}
//       			}
						this.viewersList = JSON.parse(JSON.stringify(result.data));
						console.log("List of Viewers  >> @wire  "+JSON.stringify(this.viewersList));
				} else if (result.error) {
						this.error = JSON.stringify(error);
				}
		}

		recordPageUrl;

		navigate(event){
			  var id = event.target.dataset.value;
			  this[NavigationMixin.GenerateUrl]({
						type: 'standard__recordPage',
						attributes: {
								recordId: id,
								actionName: 'view',
						},
				}).then((url) => {
						this.recordPageUrl = url;
				});
		}

		updateList(event){
			  refreshApex(this.wiredViewersListResults);
			  console.log("refreshing ...");
   }

		@wire(getRecord, { recordId: Id, fields: [UserNameFIELD, userEmailFIELD, userIsActiveFIELD, userAliasFIELD ]})
		currentUserInfo({error, data}) {
				if (data) {
						this.currentUserName = data.fields.Name.value;
						this.currentUserEmail = data.fields.Email.value;
						this.currentIsActive = data.fields.IsActive.value;
						this.currentUserAlias = data.fields.Alias.value;
				} else if (error) {
						this.error = error ;
				}
		}

		handleClose() {
			  this.isModalVisible = false;
		}

		handleHideModal(event){
			  this.debounce(this.handleHideModal1(event), 500);
   }

		handleHideModal1(event){
			  this.isModalVisible = false;
   }

 		debounce(func, delay) {
			  console.log("hovering ...0");
        let timer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

		details(event){
			  console.log("hovering ...1");
			  this.debounce(this.details1(event), 200);
   	}


		details1(event){
			  console.log("hovering ...2");
			  event.stopPropagation();
				this.isModalVisible = true;
			  this.recordIdFromEvent = event.currentTarget.dataset.value;
			  this.objTypeDetails  = event.currentTarget.dataset.object;
			  this.modalHeader  = this.objTypeDetails+" details";
//			  console.log(JSON.stringify(event.currentTarget.dataset.object));
//			  console.log(JSON.stringify(event.currentTarget.dataset.value));
//			  console.log(event.toElement.dataset.object);
//				console.log(this.objTypeDetails);
			  getViewerSettings({recId: this.recordIdFromEvent}).then( (response) => {
					  console.log(response)
						this.detailsFields = response;
//						response.forEach( (r) => {
//							  const str = "name";
//                const modStr = str[0].toUpperCase() + str.slice(1);
//                console.log(str); // name
//                console.log(modStr); // Name
//						  	console.log('response '+r[0].toUpperCase() + r.slice(1));
//						  	this.detailsFields.push(r[0].toUpperCase() + r.slice(1));
//						})
//					  console.log(this.detailsFields);
     		});
		}

		showEvent(event){
			  if(this.iconNameOpen == "utility:down"){
						this.iconNameOpen = "utility:up";
				}else{
					  this.iconNameOpen = "utility:down";
				}
    }

		showCard(event){
			  if(this.isVisible == false){
					this.isVisible = true;
				}else{
						 this.isVisible = false;
				}
    }

		filterRows(){
			  let name = this.objectApiName;
			  let elem = this.template.querySelectorAll("tr.tr");
						elem.forEach((el) => {
								if(el.getAttribute(["data-name"]) != name){
										console.log("NOT equal name");
										if(el.style.display = "" || !el.style.display){
												console.log("display none");
												el.style.display = "none";
										}else{
												el.style.display = "";
										}
								}else{
										console.log(" equal name");
								}
						}
				);
//				if(this.filterLabel == "Show All"){
//					  this.filterLabel = "Show only "+this.objectApiName;
//     		}else{
//					  this.filterLabel = "Show All";
//      	}
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

		setViewers(dt){
			  this.viewersList = JSON.parse(JSON.stringify(dt));
		}


//		onTabCreate(event){
//				if (!this.isConsoleNavigation) {
//						return;
//				}
//
//				console.log(event.detail);
//				const { highlighted } = event.detail;
//				let tId = event.getParam("tabId");
//				let workspaceAPI = component.find("workspace");
//				let allTab = component.get("v.allTabInfo");
//				workspaceAPI.getAllTabInfo().then((response) => {
//								console.log(JSON.stringify(response));
//
//				});
//				workspaceAPI.getTabInfo({
//						tabId: tId
//				})
//				.then((result) => {
//						console.log("tabInfo result ", JSON.stringify(result));
//						allTab.push(result);
//						let viewerRecord = component.get("c.createViewer");
//						let recId = result.pageReference.attributes.recordId;
//						viewerRecord.setParams({
//								"cId": recId,
//						});
//						viewerRecord.setCallback(this, (response) => {
//								if (response.getState() == "SUCCESS") {
//										console.log("Viewer created "+JSON.stringify(response));
//								} else {
//										console.log("Viewer NOT created ");
//								}
//						});
//						$A.enqueueAction(viewerRecord);
//				});

//   }

//		onToggleHighlightTab(event) {
//				if (!this.isConsoleNavigation) {
//						return;
//				}
//				const { highlighted } = event.detail;
//				getFocusedTabInfo().then((tabInfo) => {
//						const { tabId } = tabInfo;
//						setTabHighlighted(tabId, highlighted, {
//								pulse: true,
//								state: 'success',
//						});
//				})
//		}

		beforeUnloadHandler(event) {
				event.preventDefault();
			  console.log("UNLOAD:1" + document.location.href);
			  let rId = this.recId;
			  console.log(rId);
			  deleteViewer({"cId": rId});
				event.returnValue = "Any text";
//				return "Any text";
		}

		// Initializes the component
		async connectedCallback() {
			  this.filterLabel = "Filter by "+this.objectApiName.toUpperCase()+" on/off";
			  this.recId = this.recordId;
			  let viewerData = await createViewer({ recId: this.recordId });
			  this.viewersList.push(viewerData);

			  getList()
				.then(result => {
						this.viewersList=result;
				})
				.catch(error => {
						this.error = error;
				});

				setInterval( () => {
					  let origin = window.location.href;
					  if(origin != this.origin){
							  origin = window.location.href;
							  deleteViewer({"cId": this.recordId});
       			}else{
							   console.log("same location");
        		}
				}, 5000);

//				console.log(window.document.getElementsByClassName('slds-no-print oneAppNavContainer').length);
//				let elm = window.document.getElementsByClassName('slds-no-print oneAppNavContainer');
//				for(let i = 0; i < elm.length; i++){
////					  console.log(" >> "+i+ " "+elm[i]);
//            elm[i].addEventListener('click', this.handleTabChange());
//        }
//				.addEventListener('click', this.handleTabChange());
//				elm.addEventListener('click', this.handleTabChange());

			  window.addEventListener("beforeunload", this.beforeUnloadHandler.bind(this));
				const messageCallback = (response) => {
			  		refreshApex(this.wiredViewersListResults);
						console.log('New message received: START user name >> ', JSON.stringify(response.data.payload.fullName__c));
						const event = new ShowToastEvent({
								title: 'User '+response.data.payload.fullName__c,
								message: 'Start Viewing '+response.data.payload.type__c,
						});
					if(this.userId != response.data.payload.userName__c){
							this.dispatchEvent(event);
      		}
				};

				subscribe(this.channelStart, -1, messageCallback).then((response) => {
						// Response contains the subscription information on subscribe call
						console.log(
								'Subscription START response: ',
								JSON.stringify(response)
						);
						this.subscription = response;
				});

				const messageCallback2 = (response) => {
			  		refreshApex(this.wiredViewersListResults);
						console.log('New message received: END user name >> ', JSON.stringify(response.data.payload.userName__c));
						const event = new ShowToastEvent({
								title: 'User '+response.data.payload.fullName__c,
								message: 'End Viewing '+ response.data.payload.type__c,
						});
						if(this.userId != response.data.payload.userName__c){
								this.dispatchEvent(event);
						}
						// Response contains the payload of the new message received
				};

				subscribe(this.channelEnd, -1, messageCallback2).then((response) => {
						// Response contains the subscription information on subscribe call
						console.log(
								'Subscription END response: ',
								JSON.stringify(response)
						);
						this.subscription = response;
				});
				// Register error listener
				this.registerErrorListener();
		}

//		disconnectedCallback() {
//				alert('child disconnected callback');
//			  deleteViewer({ recId: this.recordId });
//		}

}