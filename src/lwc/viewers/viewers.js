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
import  getSessionTime from '@salesforce/apex/ViewersCtrl_Generic.sessionMills';
import  getList from '@salesforce/apex/ViewersCtrl_Generic.getList';
import  getSessionMills from '@salesforce/apex/ViewersCtrl_Generic.getSessionTime';
import  renewSession from '@salesforce/apex/ViewersCtrl_Generic.renewSession';
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
import { RefreshEvent } from "lightning/refresh";

export default class Viewers extends NavigationMixin(LightningElement, LightningModal ) {

		channelStart = '/event/adelanywisl__StartViewing__e';
		channelEnd = '/event/adelanywisl__EndViewing__e';
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
		@api
		viewersList = [];
		checkedList = [];
		sameList = [];
		notSameList = [];
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
		recordPageUrl;

		@wire(CurrentPageReference) pageRef;
		@wire(getList)
		wiredViewersList(result) {
			  this.wiredViewersListResults = result;
				if (result.data) {
						if(result.data.length > 0){
								let listSame = [];
								let listNotSame = [];
								for(let i = 0 ; i < result.data.length; i++){
										if(result.data[i].adelanywisl__record_id__c == this.recordId){
												console.log('pushing for same record');
												listSame.push(result.data[i]);
										}else{
												console.log('pushing for NOT same record');
												listNotSame.push(result.data[i]);
										}
								};
								this.sameList = listSame;
								this.notSameList = listNotSame;
								console.log('this.sameList =>  '+JSON.stringify(this.sameList));
								console.log('this.notSameList =>  '+JSON.stringify(this.notSameList));
						}else{
								console.log('<<< wired list not filled up >>>');
								this.sameList = [];
								this.notSameList = [];

						}
						this.refreshCard();
//						console.log('<<< checked list >>> '+JSON.stringify(this.checkedList));
//					  let data = JSON.parse(JSON.stringify(result.data));
//			  		console.log(result.data.length);
//			  		console.log('the list contains  ' + JSON.stringify(result.data.length));
//					  console.log('<<< wired list >>>');
//			  		console.log('wired viewers' + JSON.stringify(result.data[0].Name)+' '+JSON.stringify(result.data[0].adelanywisl__fullName__c));
//			  		console.log('user id ' + this.userId + ' ' + this.currentUserName);
//						this.viewersList = JSON.parse(JSON.stringify(result.data));
//						this.viewersList = JSON.parse(JSON.stringify(result.data));
				} else if (result.error) {
						this.error = JSON.stringify(error);
				}
		}

		colorCheck(){
			  console.log('color check');
   }

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
			  this.debounce(this.details1(event), 200);
   	}

		details1(event){
//			  event.stopPropagation();
				this.isModalVisible = true;
			  this.recordIdFromEvent = event.currentTarget.dataset.value;
			  this.objTypeDetails  = event.currentTarget.dataset.object;
			  this.modalHeader  = this.objTypeDetails+" details";
			  getViewerSettings({recId: this.recordIdFromEvent}).then( (response) => {
					  console.log(response)
						this.detailsFields = response;
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

		refreshCard(){
				this.isVisible = false;
				setTimeout(()=>this.isVisible = true, 100);
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
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

		setViewers(dt){
			  console.log('>>> setViewers');
			  this.viewersList = JSON.parse(JSON.stringify(dt));
		}



		beforeUnloadHandler(event) {
				event.preventDefault();
			  console.log("BEFOREUNLOAD: " + document.location.href);
			  let rId = this.recId;
			  console.log(rId);
			  deleteViewer({"cId": rId});
		}

		unloadHandler(event) {
				event.preventDefault();
			  console.log("UNLOAD: " + document.location.href);
			  let rId = this.recId;
			  console.log(rId);
			  deleteViewer({"cId": rId});
		}

		runNewSession(){
			  renewSession();
   	}

		refreshSession(){
			  getSessionMills().then( (t) => {
					  console.log(t);
						window.setInterval( this.runNewSession, t);
				});
    }

		async connectedCallback() {
			  this.refreshSession();
			  this.filterLabel = "Filter by "+this.objectApiName.toUpperCase()+" on/off";
			  this.recId = this.recordId;
			  let viewerData = await createViewer({ recId: this.recordId });
				console.log('viewerData:\n'+JSON.stringify(viewerData));
			  if(viewerData){
					  this.viewersList.push(viewerData);
			  		console.log('this.viewersList:\n '+JSON.stringify(this.viewersList));
     		}

			  getList()
				.then(result => {
						this.viewersList=result;
						console.log('>>> results >>>  '+JSON.stringify(this.viewersList));
				})
				.catch(error => {
						this.error = error;
						console.log('>>> '+JSON.stringify(this.error));
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

			  window.addEventListener("beforeunload", this.beforeUnloadHandler.bind(this));
//			  window.addEventListener("unload", this.unloadHandler.bind(this));
				const messageCallback = (response) => {
			  		refreshApex(this.wiredViewersListResults);
						console.log('New message received: START user name >> ', JSON.stringify(response.data.payload.adelanywisl__fullName__c));
						const event = new ShowToastEvent({
								title: 'User '+response.data.payload.adelanywisl__fullName__c,
								message: 'Start Viewing '+response.data.payload.adelanywisl__type__c,
						});
					if(this.userId != response.data.payload.adelanywisl__userName__c){
							this.dispatchEvent(event);
      		}
				};

				subscribe(this.channelStart, -1, messageCallback).then((response) => {
						console.log(
								'Subscription START response: ',
								JSON.stringify(response)
						);
						this.subscription = response;
				});

				const messageCallback2 = (response) => {
			  		refreshApex(this.wiredViewersListResults);
						console.log('New message received: END user name >> ', JSON.stringify(response.data.payload.adelanywisl__userName__c));
						const event = new ShowToastEvent({
								title: 'User '+response.data.payload.adelanywisl__fullName__c,
								message: 'End Viewing '+ response.data.payload.adelanywisl__type__c,
						});
						if(this.userId != response.data.payload.adelanywisl__userName__c){
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

}