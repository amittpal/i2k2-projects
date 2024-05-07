import { Component, OnInit,Input } from '@angular/core';
import { AppsettingsConfService } from '../../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { GlobalRestService } from '../../../../../services/rest/global-rest.service';
import { Params, ActivatedRoute } from '@angular/router';
import { AdmitCard } from '../../../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-additional-setup',
  templateUrl: './additional-setup.component.html',
  styleUrls: ['./additional-setup.component.scss']
})
export class AdditionalSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  @Input() smsEmailActiveFlag : string;

  additionalSetupFormGroup: FormGroup;  
  submitted = false;

  public items = [];
  public attrItems = [];

  public itemCount = 0;  
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public paginationStyle = 'minimal';
  
  registrationGuid="";

  constructor(private route: ActivatedRoute,private configService: AppsettingsConfService,
    private restService: GlobalRestService,private messageService: MessageService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid =params['registrationGuid'];
     if(this.registrationGuid)
     {
      this.additionalSetupFormGroup = new FormGroup({});
       this.getTermsAndConditionsDetails(this.registrationGuid);
     }            
   }, error => {
     console.error('Error: ', error);
   });
  }

  // Get initial value of the form control through api
  getTermsAndConditionsDetails(registrationGuid: any) {        
    //call api code here...
    var keyData = [
      {
      "name": "registrationGuid",
      "value": registrationGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getTermAndConditions;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => { 
        this.items = sucessResponse.admit_card_terms_notes_details;
        this.attrItems = this.getAttrParams(sucessResponse.admit_card_terms_notes[0])

        this.initializeForm();    
      
        this.items.forEach(item =>{
              this.postTermsConditions.admit_card_terms_notes_details.push(
                {
                  "exam_guid":"",
                  "registration_guid": item.registration_guid,
                  "language_guid": item.language_guid,
                  "language_name": item.language_name,
                  "terms_conditions": item.terms_conditions,
                  "notes": item.notes
                }
              );              
        });
               
      },
      errorResponse=>{
        //this.messageService.alert(errorResponse);
      }      
      );  
  }


  initializeForm() {
      let items = this.items;
      let attrItems = this.attrItems;      
      if (items && attrItems) {        
      this.attrItems.forEach(rollNumberAttributes => {
        this.additionalSetupFormGroup.addControl('priority'+ rollNumberAttributes.attribute , new FormControl(rollNumberAttributes.priority, Validators.required))
        this.additionalSetupFormGroup.addControl('length'+ rollNumberAttributes.attribute , new FormControl(rollNumberAttributes.length, Validators.required))
        });

        this.items.forEach(conditionAndNotes => {

        if(conditionAndNotes.language_name == 'English'){
            this.additionalSetupFormGroup.addControl('termsConditions'+ conditionAndNotes.language_name , new FormControl(conditionAndNotes.terms_conditions, Validators.required))
            this.additionalSetupFormGroup.addControl('notes'+ conditionAndNotes.language_name , new FormControl(conditionAndNotes.notes, Validators.required))
        }

        if(conditionAndNotes.language_name != 'English'){
          this.additionalSetupFormGroup.addControl('termsConditions'+ conditionAndNotes.language_name , new FormControl(''))
          this.additionalSetupFormGroup.addControl('notes'+ conditionAndNotes.language_name , new FormControl(''))
          this.additionalSetupFormGroup.addControl('termsConditionsHidden'+ conditionAndNotes.language_name , new FormControl(conditionAndNotes.terms_conditions, Validators.required))
          this.additionalSetupFormGroup.addControl('notesHidden'+ conditionAndNotes.language_name , new FormControl(conditionAndNotes.notes, Validators.required))
        }
        });
    }
  }

  // create custom object for roll number attribute section to be used for easy iteration
  getAttrParams(resp){

    let attrParams= [{
        "attribute" : "City_Id",
        "priority": resp.city_priority,
        "length": resp.city_length
      },
      {
        "attribute" : "Shift_Number",
        "priority": resp.shift_priority,
        "length": resp.shift_length
      },
      {
        "attribute" : "Roll_Number",
        "priority": resp.rollnumber_priority,
        "length": resp.rollnumber_length
      }];
    
    return attrParams;
  }

  // object for posting form data while submission
    public postTermsConditions = {
      "admit_card_terms_notes_details": [],
      "exam_guid": "",
      "registration_guid":this.registrationGuid,
      "city_priority": "",
      "city_length": "",
      "shift_priority": "",
      "shift_length": "",
      "rollnumber_priority": "",
      "rollnumber_length": ""
    };

  //Set hidden control field with base64 converted string of image used for validation 
   changeListener($event,firedFrom,langName) : void {
    
    var file:File =$event.target.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      if(firedFrom == 'TermsNConditions'){

        let indexOfOtherlang =  this.postTermsConditions.admit_card_terms_notes_details.findIndex(x => x.language_name == langName);
        this.postTermsConditions.admit_card_terms_notes_details[indexOfOtherlang].terms_conditions =  myReader.result;
        this.additionalSetupFormGroup.controls["termsConditionsHidden"+langName].setValue(myReader.result); 
        this.additionalSetupFormGroup.controls["termsConditionsHidden"+langName].markAsDirty();

      }

      else if(firedFrom == 'Notes'){

        let indexOfOtherlang =  this.postTermsConditions.admit_card_terms_notes_details.findIndex(x => x.language_name == langName);        
        this.postTermsConditions.admit_card_terms_notes_details[indexOfOtherlang].notes =  myReader.result;
        this.additionalSetupFormGroup.controls["notesHidden"+langName].setValue(myReader.result); 
        this.additionalSetupFormGroup.controls["notesHidden"+langName].markAsDirty();


      }      
    }
    myReader.readAsDataURL(file);
  }

  // populate data to custom object to be sent to api
  populatePostRequestData(){
    this.postTermsConditions.registration_guid = this.registrationGuid;    
    this.postTermsConditions.city_priority = this.additionalSetupFormGroup.get("priorityCity_Id").value.toString();
    this.postTermsConditions.city_length = this.additionalSetupFormGroup.get("lengthCity_Id").value.toString();
    this.postTermsConditions.shift_priority = this.additionalSetupFormGroup.get("priorityShift_Number").value.toString();
    this.postTermsConditions.shift_length = this.additionalSetupFormGroup.get("lengthShift_Number").value.toString();
    this.postTermsConditions.rollnumber_priority = this.additionalSetupFormGroup.get("priorityRoll_Number").value.toString();
    this.postTermsConditions.rollnumber_length = this.additionalSetupFormGroup.get("lengthRoll_Number").value.toString();
    let indexOfEnglish =  this.postTermsConditions.admit_card_terms_notes_details.findIndex(x => x.language_name == "English");

    if(indexOfEnglish != -1){
      this.postTermsConditions.admit_card_terms_notes_details[indexOfEnglish].terms_conditions = this.additionalSetupFormGroup.get("termsConditionsEnglish").value.toString();
      this.postTermsConditions.admit_card_terms_notes_details[indexOfEnglish].notes = this.additionalSetupFormGroup.get("notesEnglish").value.toString();
    }
   }          

  // form submission
  formSubmit(){
    this.submitted = true;
    if(this.additionalSetupFormGroup.valid)
    {   
    this.populatePostRequestData();

    let city_priority = this.postTermsConditions.city_priority;
    let shift_priority = this.postTermsConditions.shift_priority;
    let rollnumber_priority = this.postTermsConditions.rollnumber_priority;
    let fixedLengthCoutn = (Number) (this.postTermsConditions.city_length) + (Number) (this.postTermsConditions.shift_length)  + (Number) (this.postTermsConditions.rollnumber_length);
    if(fixedLengthCoutn > 15)
    {
      alert("Total fixed length of roll number attributes can not be greater than 15")
    }
    else if( (city_priority == shift_priority) || (city_priority == rollnumber_priority) || (shift_priority == rollnumber_priority) )
    {
      //console.log("city_priority " + city_priority + " shift_priority " + shift_priority + " rollnumber_priority " + rollnumber_priority)
      alert("Priorities of roll number attributes can not be duplicate.")
    }
    else{

    
    //console.log(this.postTermsConditions)
      let params=this.postTermsConditions;
        this.restService.ApiEndPointUrlOrKey = AdmitCard.addTermAndConditions;        
        this.restService.ShowLoadingSpinner=true;
        this.restService.HttpPostParams=params;      
        this.restService.callApi()
          .subscribe(sucessResponse => { 
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                let nextTabIndex = (this.smsEmailActiveFlag == "1" || this.smsEmailActiveFlag == "3" ) ? 2 : 3;
                this.tabset.tabs[nextTabIndex].active=true;               
              }
              else {
                this.messageService.hideModal();
              }
            });                 
          },
          errorResponse=>{
            this.messageService.alert(errorResponse);
          });
       
        }   
      } 
    }
    
    reset(){    
      
      let items = this.items;
      let attrItems = this.attrItems;      
      if (items && attrItems) {        
      this.attrItems.forEach(rollNumberAttributes => {
        this.additionalSetupFormGroup.controls['priority'+ rollNumberAttributes.attribute].patchValue(rollNumberAttributes.priority);
        this.additionalSetupFormGroup.controls['length'+ rollNumberAttributes.attribute].patchValue(rollNumberAttributes.length);
        });

        this.items.forEach(conditionAndNotes => {
        if(conditionAndNotes.language_name == 'English'){
          this.additionalSetupFormGroup.controls['termsConditions'+ conditionAndNotes.language_name].patchValue(conditionAndNotes.terms_conditions);
          this.additionalSetupFormGroup.controls['notes'+ conditionAndNotes.language_name].patchValue(conditionAndNotes.notes);
        }

        if(conditionAndNotes.language_name != 'English'){
          this.additionalSetupFormGroup.controls['termsConditions'+ conditionAndNotes.language_name].patchValue('');
          this.additionalSetupFormGroup.controls['notes'+ conditionAndNotes.language_name].patchValue('');
          this.additionalSetupFormGroup.controls['termsConditionsHidden'+ conditionAndNotes.language_name].patchValue(conditionAndNotes.terms_conditions);
          this.additionalSetupFormGroup.controls['notesHidden'+ conditionAndNotes.language_name].patchValue(conditionAndNotes.notes);
        }
        });
    }
      
    }
}
