import { NgModule } from '@angular/core';
import{CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import{ModalModule} from 'ngx-bootstrap/modal';

import{ NgxIxcheckFirstnameLibModule, NgxIxcheckFirstnameComponent} from 'ngx-ixcheck-firstname-lib';
import{NgxIxcheckLastnameLibModule,NgxIxcheckLastnameComponent} from 'ngx-ixcheck-lastname-lib';
import{NgxIxcheckSubmitbuttonComponent,NgxIxcheckSubmitbuttonLibModule} from 'ngx-ixcheck-submitbutton-lib';
import {NgxIxcheckTextboxsettingComponent,NgxIxcheckTextboxsettingLibModule} from 'ngx-ixcheck-textboxsetting-lib';
import {NgxIxcheckAddressComponent,NgxIxcheckAddressLibModule} from 'ngx-ixcheck-address-lib';
import {NgxIxcheckEmailComponent,NgxIxcheckEmailLibModule} from 'ngx-ixcheck-email-lib';
import {NgxIxcheckCityComponent,NgxIxcheckCityLibModule} from 'ngx-ixcheck-city-lib';
import {NgxIxcheckShowerrormessageComponent,NgxIxcheckShowerrormessageLibModule} from 'ngx-ixcheck-showerrormessage-lib';
import { NgxIxcheckCategoryComponent,NgxIxcheckCategoryLibModule } from 'ngx-ixcheck-category-lib';
import { NgxIxcheckConfirmpasswordComponent,NgxIxcheckConfirmpasswordLibModule } from 'ngx-ixcheck-confirmpassword-lib';
import { NgxIxcheckDateofbirthComponent,NgxIxcheckDateofbirthLibModule } from 'ngx-ixcheck-dateofbirth-lib';
import { NgxIxcheckFathernameComponent,NgxIxcheckFathernameLibModule } from 'ngx-ixcheck-fathername-lib';
import { NgxIxcheckGenderComponent,NgxIxcheckGenderLibModule } from 'ngx-ixcheck-gender-lib';
import { NgxIxcheckMiddlenameComponent,NgxIxcheckMiddlenameLibModule } from 'ngx-ixcheck-middlename-lib';
import { NgxIxcheckMinorityComponent,NgxIxcheckMinorityLibModule } from 'ngx-ixcheck-minority-lib';
import { NgxIxcheckMobilenumberComponent,NgxIxcheckMobilenumberLibModule } from 'ngx-ixcheck-mobilenumber-lib';
import { NgxIxcheckMothernameComponent,NgxIxcheckMothernameLibModule } from 'ngx-ixcheck-mothername-lib';
import { NgxIxcheckNationalityComponent,NgxIxcheckNationalityLibModule } from 'ngx-ixcheck-nationality-lib';
import { NgxIxcheckPasswordComponent,NgxIxcheckPasswordLibModule } from 'ngx-ixcheck-password-lib';
import { NgxIxcheckStateComponent,NgxIxcheckStateLibModule } from 'ngx-ixcheck-state-lib';
import { NgxIxcheckTermandconditionComponent,NgxIxcheckTermandconditionLibModule } from 'ngx-ixcheck-termandcondition-lib';
import { NgxIxcheckNextbuttonComponent,NgxIxcheckNextbuttonLibModule } from 'ngx-ixcheck-nextbutton-lib';
import { NgxIxcheckBackbuttonComponent,NgxIxcheckBackbuttonLibModule } from 'ngx-ixcheck-backbutton-lib';
import {NgxIxcheckFileuploaderComponent,NgxIxcheckFileuploaderLibModule } from 'ngx-ixcheck-fileuploader-lib';
import{NgxIxcheckAddressline1Component,NgxIxcheckAddressline1LibModule} from 'ngx-ixcheck-addressline1-lib';
import{NgxIxcheckAddressline2Component,NgxIxcheckAddressline2LibModule} from 'ngx-ixcheck-addressline2-lib';

import{NgxIxcheckCityPriority1Component,NgxIxcheckCityPriority1LibModule} from 'ngx-ixcheck-city-priority1-lib';
import{NgxIxcheckCityPriority2Component,NgxIxcheckCityPriority2LibModule} from 'ngx-ixcheck-city-priority2-lib';
import{NgxIxcheckCityPriority3Component,NgxIxcheckCityPriority3LibModule} from 'ngx-ixcheck-city-priority3-lib';
import{NgxIxcheckPhysicalDisabilityComponent,NgxIxcheckPhysicalDisabilityLibModule} from 'ngx-ixcheck-physical-disability-lib';
import {NgxIxcheckQualificationLibModule, NgxIxcheckQualificationComponent } from 'ngx-ixcheck-qualification-lib';
import {NgxIxcheckPostLibModule, NgxIxcheckPostComponent } from 'ngx-ixcheck-post-lib';

import{NgxIxcheckTitleComponent,NgxIxcheckTitleLibModule} from 'ngx-ixcheck-title-lib';
import{NgxIxcheckRelationComponent,NgxIxcheckRelationLibModule} from 'ngx-ixcheck-relation-lib';
import{NgxIxcheckIdproofComponent,NgxIxcheckIdproofLibModule} from 'ngx-ixcheck-idproof-lib';
import{NgxIxcheckReligionComponent,NgxIxcheckReligionLibModule} from 'ngx-ixcheck-religion-lib';
import {NgxIxcheckCourseComponent, NgxIxcheckCourseLibModule } from 'ngx-ixcheck-course-lib';
import{NgxIxcheckStreamComponent,NgxIxcheckStreamLibModule} from 'ngx-ixcheck-stream-lib';
import {NgxIxcheckUniversityComponent, NgxIxcheckUniversityLibModule } from 'ngx-ixcheck-university-lib';
import {NgxIxcheckBoardComponent, NgxIxcheckBoardLibModule } from 'ngx-ixcheck-board-lib';
import {NgxIxcheckPhotouploaderComponent, NgxIxcheckPhotouploaderLibModule } from 'ngx-ixcheck-photouploader-lib';
import {NgxIxcheckSignatureUploaderComponent, NgxIxcheckSignatureUploaderLibModule } from 'ngx-ixcheck-signature-uploader-lib';
import {NgxIxcheckPincodeComponent, NgxIxcheckPincodeLibModule } from 'ngx-ixcheck-pincode-lib';
import {NgxIxcheckAddressline3Component, NgxIxcheckAddressline3LibModule } from 'ngx-ixcheck-addressline3-lib';
import {NgxIxcheckMaritialstatusComponent, NgxIxcheckMaritialstatusLibModule } from 'ngx-ixcheck-maritialstatus-lib';
import {NgxIxcheckExammediumComponent, NgxIxcheckExammediumLibModule } from 'ngx-ixcheck-exammedium-lib';
import { NgxIxcheckUsernameComponent, NgxIxcheckUsernameLibModule } from 'ngx-ixcheck-username-lib';
import { NgxIxcheckPhoneComponent, NgxIxcheckPhoneLibModule } from 'ngx-ixcheck-phone-lib';
import { NgxIxcheckEducationalDetailsComponent,NgxIxcheckEducationalDetailsLibModule } from 'ngx-ixcheck-educational-details-lib';
import { NgxIxcheckCaptchaComponent, NgxIxcheckCaptchaLibModule } from 'ngx-ixcheck-captcha-lib';

@NgModule({
  declarations: [        
   
    
  ], 
  imports:[
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      TabsModule.forRoot(),
      ModalModule.forRoot()  ,
      NgxIxcheckFirstnameLibModule,
      NgxIxcheckLastnameLibModule, 
      NgxIxcheckSubmitbuttonLibModule, 
      NgxIxcheckTextboxsettingLibModule,
      NgxIxcheckAddressLibModule ,
      NgxIxcheckEmailLibModule,
      NgxIxcheckCityLibModule,
      NgxIxcheckCityPriority1LibModule,
      NgxIxcheckCityPriority2LibModule,
      NgxIxcheckCityPriority3LibModule,
      NgxIxcheckPhysicalDisabilityLibModule,
      NgxIxcheckShowerrormessageLibModule,
      NgxIxcheckCategoryLibModule,
      NgxIxcheckConfirmpasswordLibModule,
      NgxIxcheckDateofbirthLibModule,
      NgxIxcheckFathernameLibModule,
      NgxIxcheckGenderLibModule,
      NgxIxcheckMiddlenameLibModule,
      NgxIxcheckMinorityLibModule,
      NgxIxcheckMobilenumberLibModule,
      NgxIxcheckMothernameLibModule,
      NgxIxcheckNationalityLibModule,
      NgxIxcheckPasswordLibModule,
      NgxIxcheckStateLibModule,
      NgxIxcheckTermandconditionLibModule,
      NgxIxcheckNextbuttonLibModule,
      NgxIxcheckBackbuttonLibModule ,
      NgxIxcheckAddressline1LibModule,
      NgxIxcheckAddressline2LibModule,
      NgxIxcheckQualificationLibModule,
      NgxIxcheckPostLibModule,
      NgxIxcheckFileuploaderLibModule,
      NgxIxcheckTitleLibModule,
      NgxIxcheckRelationLibModule,
      NgxIxcheckIdproofLibModule,
      NgxIxcheckReligionLibModule,
      NgxIxcheckCourseLibModule,
      NgxIxcheckStreamLibModule,
      NgxIxcheckUniversityLibModule,
      NgxIxcheckBoardLibModule,
      NgxIxcheckPhotouploaderLibModule,
      NgxIxcheckSignatureUploaderLibModule,
      NgxIxcheckPincodeLibModule,
      NgxIxcheckAddressline3LibModule,
      NgxIxcheckMaritialstatusLibModule,
      NgxIxcheckExammediumLibModule,
      NgxIxcheckUsernameLibModule,
      NgxIxcheckPhoneLibModule,
      NgxIxcheckEducationalDetailsLibModule,
      NgxIxcheckCaptchaLibModule
    ],     
  exports:[
    
    NgxIxcheckLastnameComponent,
    NgxIxcheckSubmitbuttonComponent,
    NgxIxcheckTextboxsettingComponent,
    NgxIxcheckAddressComponent,
    NgxIxcheckEmailComponent,
    NgxIxcheckCityComponent,
    NgxIxcheckCityPriority1Component,
    NgxIxcheckCityPriority2Component,
    NgxIxcheckCityPriority3Component,
    NgxIxcheckPhysicalDisabilityComponent,
    NgxIxcheckShowerrormessageComponent,
    NgxIxcheckCategoryComponent,
    NgxIxcheckConfirmpasswordComponent,
    NgxIxcheckDateofbirthComponent,
    NgxIxcheckFathernameComponent,
    NgxIxcheckGenderComponent,
    NgxIxcheckMiddlenameComponent,
    NgxIxcheckMinorityComponent,
    NgxIxcheckMobilenumberComponent,
    NgxIxcheckMothernameComponent,
    NgxIxcheckNationalityComponent,
    NgxIxcheckPasswordComponent,
    NgxIxcheckStateComponent,
    NgxIxcheckTermandconditionComponent,
    NgxIxcheckNextbuttonComponent,
    NgxIxcheckBackbuttonComponent,
    NgxIxcheckFileuploaderComponent,
    NgxIxcheckAddressline1Component,
    NgxIxcheckAddressline2Component,
    NgxIxcheckQualificationComponent,
    NgxIxcheckPostComponent,
    NgxIxcheckTitleComponent,
    NgxIxcheckRelationComponent,
    NgxIxcheckIdproofComponent,
    NgxIxcheckReligionComponent,
    NgxIxcheckCourseComponent,
    NgxIxcheckStreamComponent,
    NgxIxcheckUniversityComponent,
    NgxIxcheckBoardComponent,
    NgxIxcheckPhotouploaderComponent,
    NgxIxcheckSignatureUploaderComponent,
    NgxIxcheckPincodeComponent,
    NgxIxcheckAddressline3Component,
    NgxIxcheckMaritialstatusComponent,
    NgxIxcheckExammediumComponent,
    NgxIxcheckUsernameComponent,
    NgxIxcheckPhoneComponent,
    NgxIxcheckEducationalDetailsComponent,
    NgxIxcheckCaptchaComponent

  ],
  entryComponents:[
    NgxIxcheckFirstnameComponent,
    NgxIxcheckLastnameComponent,
    NgxIxcheckSubmitbuttonComponent,
    NgxIxcheckAddressComponent,
    NgxIxcheckEmailComponent,
    NgxIxcheckCityComponent,
    NgxIxcheckCityPriority1Component,
    NgxIxcheckCityPriority2Component,
    NgxIxcheckCityPriority3Component,
    NgxIxcheckPhysicalDisabilityComponent,
    NgxIxcheckCategoryComponent,
    NgxIxcheckConfirmpasswordComponent,
    NgxIxcheckDateofbirthComponent,
    NgxIxcheckFathernameComponent,
    NgxIxcheckGenderComponent,
    NgxIxcheckMiddlenameComponent,
    NgxIxcheckMinorityComponent,
    NgxIxcheckMobilenumberComponent,
    NgxIxcheckMothernameComponent,
    NgxIxcheckNationalityComponent,
    NgxIxcheckPasswordComponent,
    NgxIxcheckStateComponent,
    NgxIxcheckTermandconditionComponent,
    NgxIxcheckNextbuttonComponent,
    NgxIxcheckBackbuttonComponent,
    NgxIxcheckFileuploaderComponent,
    NgxIxcheckAddressline1Component,
    NgxIxcheckAddressline2Component,
    NgxIxcheckQualificationComponent,
    NgxIxcheckPostComponent,
    NgxIxcheckTitleComponent,
    NgxIxcheckRelationComponent,
    NgxIxcheckIdproofComponent,
    NgxIxcheckReligionComponent,
    NgxIxcheckCourseComponent,
    NgxIxcheckStreamComponent,
    NgxIxcheckUniversityComponent,
    NgxIxcheckBoardComponent,
    NgxIxcheckPhotouploaderComponent,
    NgxIxcheckSignatureUploaderComponent,
    NgxIxcheckPincodeComponent,
    NgxIxcheckAddressline3Component,
    NgxIxcheckMaritialstatusComponent,
    NgxIxcheckExammediumComponent,
    NgxIxcheckUsernameComponent,
    NgxIxcheckPhoneComponent,
    NgxIxcheckEducationalDetailsComponent,
    NgxIxcheckCaptchaComponent
  ]  
})
export class IxcheckLibComponentsModule { }
