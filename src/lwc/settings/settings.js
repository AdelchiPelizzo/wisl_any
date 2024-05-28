/**
 * Created by adpel on 08/05/2024.
 */

import { LightningElement } from 'lwc';
import getFieldsName from '@salesforce/apex/ViewersCtrl_Generic.getFieldsName';

export default class Settings extends LightningElement {

	  connectedCallback(){
			  getFieldsName({}).then();
   	}

}