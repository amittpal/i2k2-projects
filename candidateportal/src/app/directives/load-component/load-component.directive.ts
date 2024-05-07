import { Directive , Input, OnChanges, ViewContainerRef, ComponentFactoryResolver, ComponentRef, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxIxcheckFirstnameComponent} from 'ngx-ixcheck-firstname-lib';
import { NgxIxcheckLastnameComponent} from 'ngx-ixcheck-lastname-lib';
import { NgxIxcheckSubmitbuttonComponent} from 'ngx-ixcheck-submitbutton-lib';
import { NgxIxcheckEmailComponent } from 'ngx-ixcheck-email-lib';
import { NgxIxcheckAddressComponent } from 'ngx-ixcheck-address-lib';
import { NgxIxcheckCityComponent } from 'ngx-ixcheck-city-lib';
import { NgxIxcheckMiddlenameComponent } from 'ngx-ixcheck-middlename-lib';
import { NgxIxcheckFathernameComponent } from 'ngx-ixcheck-fathername-lib';
import { NgxIxcheckMothernameComponent } from 'ngx-ixcheck-mothername-lib';
import { NgxIxcheckCategoryComponent } from 'ngx-ixcheck-category-lib';
import { NgxIxcheckConfirmpasswordComponent } from 'ngx-ixcheck-confirmpassword-lib';
import { NgxIxcheckDateofbirthComponent } from 'ngx-ixcheck-dateofbirth-lib';
import { NgxIxcheckGenderComponent } from 'ngx-ixcheck-gender-lib';
import { NgxIxcheckMinorityComponent } from 'ngx-ixcheck-minority-lib';
import { NgxIxcheckMobilenumberComponent } from 'ngx-ixcheck-mobilenumber-lib';
import { NgxIxcheckNationalityComponent } from 'ngx-ixcheck-nationality-lib';
import { NgxIxcheckPasswordComponent } from 'ngx-ixcheck-password-lib';
import { NgxIxcheckStateComponent } from 'ngx-ixcheck-state-lib';
import { NgxIxcheckTermandconditionComponent } from 'ngx-ixcheck-termandcondition-lib';
import { NgxIxcheckNextbuttonComponent } from 'ngx-ixcheck-nextbutton-lib';
import { NgxIxcheckBackbuttonComponent } from 'ngx-ixcheck-backbutton-lib';
import { NgxIxcheckFileuploaderComponent } from 'ngx-ixcheck-fileuploader-lib';
import { NgxIxcheckAddressline1Component} from 'ngx-ixcheck-addressline1-lib';
import { NgxIxcheckAddressline2Component} from 'ngx-ixcheck-addressline2-lib';
import { NgxIxcheckCityPriority1Component} from 'ngx-ixcheck-city-priority1-lib';
import { NgxIxcheckCityPriority2Component} from 'ngx-ixcheck-city-priority2-lib';
import { NgxIxcheckCityPriority3Component} from 'ngx-ixcheck-city-priority3-lib';
import { NgxIxcheckPhysicalDisabilityComponent} from 'ngx-ixcheck-physical-disability-lib';
import { NgxIxcheckQualificationComponent} from 'ngx-ixcheck-qualification-lib';
import { NgxIxcheckPostComponent} from 'ngx-ixcheck-post-lib';
import { NgxIxcheckCourseComponent} from 'ngx-ixcheck-course-lib';
import { NgxIxcheckTitleComponent} from 'ngx-ixcheck-title-lib';
import { NgxIxcheckRelationComponent} from 'ngx-ixcheck-relation-lib';
import { NgxIxcheckReligionComponent} from 'ngx-ixcheck-religion-lib';
import { NgxIxcheckIdproofComponent} from 'ngx-ixcheck-idproof-lib';
import { NgxIxcheckStreamComponent } from 'ngx-ixcheck-stream-lib';
import { NgxIxcheckUniversityComponent } from 'ngx-ixcheck-university-lib';
import { NgxIxcheckBoardComponent } from 'ngx-ixcheck-board-lib';
import { NgxIxcheckPhotouploaderComponent } from 'ngx-ixcheck-photouploader-lib';
import { NgxIxcheckSignatureUploaderComponent } from 'ngx-ixcheck-signature-uploader-lib';
import { NgxIxcheckPincodeComponent } from 'ngx-ixcheck-pincode-lib';
import { NgxIxcheckAddressline3Component } from 'ngx-ixcheck-addressline3-lib';
import { NgxIxcheckMaritialstatusComponent } from 'ngx-ixcheck-maritialstatus-lib';
import { NgxIxcheckExammediumComponent } from 'ngx-ixcheck-exammedium-lib';
import { NgxIxcheckUsernameComponent } from 'ngx-ixcheck-username-lib';
import { NgxIxcheckPhoneComponent } from 'ngx-ixcheck-phone-lib';
import { NgxIxcheckRegTypeListComponent } from 'ngx-ixcheck-regtype-list-lib';
import { NgxIxcheckPhotouploaderAiComponent } from 'ngx-ixcheck-photouploader-ai-lib';
import { NgxIxcheckCaptchaComponent } from 'ngx-ixcheck-captcha-lib';
import { NgxIxcheckCaptchaTextboxComponent } from 'ngx-ixcheck-captcha-textbox-lib';
import { NgxIxcheckEducationalDetailsComponent } from 'ngx-ixcheck-educational-details-lib';
import { NgxIxcheckIpAddressComponent } from 'ngx-ixcheck-ipaddress-lib';
const components = {
  NgxIxcheckFirstname:NgxIxcheckFirstnameComponent,
  NgxIxcheckLastname:NgxIxcheckLastnameComponent,
  NgxIxcheckSubmitbutton:NgxIxcheckSubmitbuttonComponent,
  NgxIxcheckAddress:NgxIxcheckAddressComponent,
  NgxIxcheckEmail:NgxIxcheckEmailComponent,
  NgxIxcheckCity:NgxIxcheckCityComponent,
  NgxIxcheckCityPriority1:NgxIxcheckCityPriority1Component,
  NgxIxcheckCityPriority2:NgxIxcheckCityPriority2Component,
  NgxIxcheckCityPriority3:NgxIxcheckCityPriority3Component, 
  NgxIxcheckPhysicalDisability:NgxIxcheckPhysicalDisabilityComponent,  
  NgxIxcheckMiddlename:NgxIxcheckMiddlenameComponent,
  NgxIxcheckFathername:NgxIxcheckFathernameComponent,
  NgxIxcheckMothername:NgxIxcheckMothernameComponent,
  NgxIxcheckCategory:NgxIxcheckCategoryComponent,
  NgxIxcheckConfirmpassword:NgxIxcheckConfirmpasswordComponent,
  NgxIxcheckDateofbirth:NgxIxcheckDateofbirthComponent,
  NgxIxcheckGender:NgxIxcheckGenderComponent,
  NgxIxcheckMinority:NgxIxcheckMinorityComponent,
  NgxIxcheckMobilenumber:NgxIxcheckMobilenumberComponent,
  NgxIxcheckNationality:NgxIxcheckNationalityComponent,
  NgxIxcheckPassword:NgxIxcheckPasswordComponent,
  NgxIxcheckState:NgxIxcheckStateComponent,
  NgxIxcheckTermandcondition:NgxIxcheckTermandconditionComponent,
  NgxIxcheckNextbutton:NgxIxcheckNextbuttonComponent,
  NgxIxcheckBackbutton:NgxIxcheckBackbuttonComponent,
  NgxIxcheckFileuploader:NgxIxcheckFileuploaderComponent,   
  NgxIxcheckAddressline1:NgxIxcheckAddressline1Component,
  NgxIxcheckAddressline2:NgxIxcheckAddressline2Component,
  NgxIxcheckQualification:NgxIxcheckQualificationComponent,
  NgxIxcheckPost:NgxIxcheckPostComponent,
  NgxIxcheckCourse:NgxIxcheckCourseComponent,   
  NgxIxcheckTitle:NgxIxcheckTitleComponent,
  NgxIxcheckRelation:NgxIxcheckRelationComponent,
  NgxIxcheckReligion:NgxIxcheckReligionComponent,
  NgxIxcheckIdproof:NgxIxcheckIdproofComponent,
  NgxIxcheckStream:NgxIxcheckStreamComponent,
  NgxIxcheckUniversity:NgxIxcheckUniversityComponent,
  NgxIxcheckBoard:NgxIxcheckBoardComponent,
  NgxIxcheckPhotouploader:NgxIxcheckPhotouploaderComponent ,
  NgxIxcheckSignatureUploader:NgxIxcheckSignatureUploaderComponent,
  NgxIxcheckPincode:NgxIxcheckPincodeComponent ,
  NgxIxcheckAddressline3:NgxIxcheckAddressline3Component,
  NgxIxcheckMaritialstatus:NgxIxcheckMaritialstatusComponent,
  NgxIxcheckExammedium:NgxIxcheckExammediumComponent,
  NgxIxcheckUsername:NgxIxcheckUsernameComponent,
  NgxIxcheckPhone:NgxIxcheckPhoneComponent,
  NgxIxcheckRegTypeList:NgxIxcheckRegTypeListComponent,
  NgxIxcheckPhotouploaderAi:NgxIxcheckPhotouploaderAiComponent,
  NgxIxcheckCaptchaTextbox:NgxIxcheckCaptchaTextboxComponent,
  NgxIxcheckCaptcha:NgxIxcheckCaptchaComponent,
  NgxIxcheckEducationalDetails: NgxIxcheckEducationalDetailsComponent,
  NgxIxcheckIpAddress:NgxIxcheckIpAddressComponent
};

@Directive({
  selector: '[LoadComponent]'
})
export class LoadComponentDirective implements OnChanges {  
  @Input() group:FormGroup;
  @Input() componentDetails:any;     
  @Input() additionalDetails?:any;     
  @Output() outputEmitter=new EventEmitter(); 
  component: ComponentRef<any>;
  componentsWithOutput=[
  "NgxIxcheckNextbutton",
  "NgxIxcheckBackbutton",
  "NgxIxcheckFileuploader",
  "NgxIxcheckPhotouploader",
  "NgxIxcheckPhotouploaderAi",
  "NgxIxcheckSignatureUploader",
  "NgxIxcheckRegTypeList"];
  constructor(
    private container: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnChanges(): void {    
   const component = components[this.componentDetails.comp_name];
   if (component) {
    
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.group=this.group;    
    this.component.instance.componentDetails=this.componentDetails; 
    //if additional details object has any value
    if(this.additionalDetails)
    {
      this.component.instance.additionalDetails=this.additionalDetails;
    }
    //binding output only when component have value in condition object.
    if(this.componentDetails.conditional && this.componentDetails.conditional.changeType)
    {      
      this.component.instance.outputEmitter.subscribe((data:any)=>this.outputEmitter.emit(data));       
    } 
    //handling output for components that accept output parameters
    if(this.componentsWithOutput.indexOf(this.componentDetails.comp_name)>-1)
    {
     this.component.instance.outputEmitter.subscribe((data:any)=>this.outputEmitter.emit(data));
    }
   }

  }

}
