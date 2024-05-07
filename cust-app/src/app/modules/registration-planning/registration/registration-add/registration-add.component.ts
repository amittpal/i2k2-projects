import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { FromSubmitClass, LayoutDetails } from 'src/app/shared/classes/registration/form.class';
import { PageClass } from 'src/app/shared/classes/registration/page.class';
import { Registration } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-registration-add',
  templateUrl: './registration-add.component.html',
  styleUrls: ['./registration-add.component.scss']
})
export class RegistrationAddComponent implements OnInit {

  @ViewChild('pagesTabs', { static: false }) pageTabs: TabsetComponent;
  templateForm: FormGroup = new FormGroup({});
  layoutDetails: LayoutDetails;
  examGuid:string="";
  additionalDetails={
   "examGuid":""
  };
  constructor(
    private route:ActivatedRoute,
    private restService:GlobalRestService,
    private messageService:MessageService,
    private router:Router
    
    ) { }

  ngOnInit() {    
    this.route.params.subscribe((params: Params) => {
      this.getLayoutDetails(params['examId']);
     
    }, error => {
      console.error('Error: ', error);
    });
  }

  getLayoutDetails(examGuid:string)
  {
        if(examGuid)
        {
          var keyData = [
            {
              "name": "examGuid",
              "value": examGuid
            }
          ];
          this.restService.ApiEndPointUrlOrKey = Registration.getLayoutDetailByExamGuid;
          this.restService.ApiEndPointMehod = RestMethods.Get;
          this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
          this.restService.ShowLoadingSpinner = true;
          this.restService.callApi(keyData)
            .subscribe(sucessResponse => {                             
              let jsonResponse= JSON.parse(sucessResponse.exams[0].layout_json);
              this.layoutDetails = jsonResponse;
              this.examGuid=sucessResponse.exams[0].exam_guid;
              this.additionalDetails.examGuid=this.examGuid;
              this.addFormGroups(jsonResponse);
            }, errorResponse => {
              //this.messageService.ok('No data available...');
            });
      
        }
  }

  //Adding form group
  addFormGroups(formData:any) {
    //each page in object will be a form group
    for (let i = 0; i < formData.layout.pages.length; i++) {
      this.templateForm.addControl(formData.layout.pages[i].page_name, new FormGroup({}));
    }
    this.addPaymentPageToLayout();
  }

  //adding json for payment page
  addPaymentPageToLayout()
  {
    const paymentPage:PageClass=new PageClass();
    paymentPage.page_name="Payment";
    this.layoutDetails.layout.pages.push(paymentPage);
  }


  onOutputEmitterSubmit(value: any, componentDetails: any, pageId: string, sectionId: string) {
    //handling output for next button submit
    if (componentDetails.comp_name === "NgxIxcheckNextbutton") {
      let pageIndex = this.layoutDetails.layout.pages.findIndex(p => p.page_guid === pageId);
      if (pageIndex >= 0) {       
        let currentPage = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId);
        if (currentPage) {          
          let currentFormGroup: FormGroup = this.templateForm.get(currentPage.page_name) as FormGroup;
          this.submitFormGroupValues(currentFormGroup, currentPage);
                  
        }
      }
    }
    //handling output for back button submit
    else if (componentDetails.comp_name === "NgxIxcheckBackbutton") {
      let pageIndex = this.layoutDetails.layout.pages.findIndex(p => p.page_guid === pageId);
      if (pageIndex > 0) {
         //enabling and activating previous page tab
        //this.pageTabs.tabs[pageIndex - 1].disabled = false;
        this.pageTabs.tabs[pageIndex - 1].active = true;
      }
    }


    else if(componentDetails.comp_name === "NgxIxcheckFileuploader")
    {
      
      let pageDetails = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId);
      // console.log(pageDetails);
      this.templateForm.get(pageDetails.page_name).get("NgxIxcheckFileuploader").setValue(value[0].result);
    // console.log(this.templateForm);
    }

    else if(componentDetails.comp_name === "NgxIxcheckPhotouploader")
    {
      let pageDetails = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId);
      // console.log(pageDetails);
      this.templateForm.get(pageDetails.page_name).get("NgxIxcheckPhotouploader").setValue(value[0].result);
    // console.log(this.templateForm);
    }

    else if(componentDetails.comp_name === "NgxIxcheckSignatureUploader")
    {

      let pageDetails = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId);
      // console.log(pageDetails);
      this.templateForm.get(pageDetails.page_name).get("NgxIxcheckSignatureUploader").setValue(value[0].result);
    // console.log(this.templateForm);
    }

    else if(componentDetails.conditional) {
      //handling conditional logic
      let conditionalDetails=componentDetails.conditional;
      if(conditionalDetails.changeType==="bindDropdown")
      {
        var components = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
        .sections.find(s => s.section_guid === sectionId).comps;
      if (components) {
        let currentComponent = components.find(c => c.comp_name === conditionalDetails.componentToChange);
        let index = components.indexOf(currentComponent);
        currentComponent.settings.setting_dataParameter = value;

        this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
          .sections.find(s => s.section_guid === sectionId)
          .comps[index] = { ...currentComponent };
      }
      }

    }
  }

  //submitting form by specific group(page)
  submitFormGroupValues(formGroup: FormGroup, currentPage: PageClass) :boolean {
    //to show validation on submit click
    formGroup.markAllAsTouched();
    if (formGroup.valid) {
      //creating post param array
      let formValues: FromSubmitClass[] = [];
      currentPage.sections.forEach((sectionObject, sectionIndex) => {
        sectionObject.comps.forEach((componentObject, componentIndex) => {
          //skipping values of buttons
          if (componentObject.settings.setting_type !== "button" && componentObject.settings.setting_type !== "submit") {
            let formValue = new FromSubmitClass;
            formValue.layout_guid = this.layoutDetails.layout.layout_guid;
            formValue.layout_id = this.layoutDetails.layout.layout_id;

            formValue.page_guid = currentPage.page_guid;
            formValue.page_id = currentPage.page_id;

            formValue.section_guid = sectionObject.section_guid;
            formValue.section_id = sectionObject.section_id;

            formValue.comp_guid = componentObject.comp_guid;
            formValue.comp_id = componentObject.comp_id;
            formValue.comp_name=componentObject.comp_name;

            if(formGroup.get(componentObject.comp_name).value instanceof Array){
              formValue.data_value=(formGroup.get(componentObject.comp_name).value).toString();
            }
            else
            {
            formValue.data_value = formGroup.get(componentObject.comp_name).value;
            }
            formValues.push(formValue);
          }
        })
      });
      
      //if post param array is not empty
      if (formValues.length > 0) {

        this.restService.ApiEndPointUrlOrKey = Registration.addFormValueByExamGuid;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.ShowLoadingSpinner = true;
        let _httpParams = {
          "templateFormValue": formValues,
          "examGuid":this.examGuid
          //"registrationId":this.registrationId
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {          
          if(sucessResponse)
          { 
             console.log(sucessResponse);           
             //if current form group value saved successfully, moving to next tab.   
             let pageIndex = this.layoutDetails.layout.pages.findIndex(p => p.page_guid === currentPage.page_guid);       
             //current tab is no longer disabled
             this.pageTabs.tabs[pageIndex].disabled = false;
             //enabling and activating next page tab
             this.pageTabs.tabs[pageIndex + 1].disabled = false;
             this.pageTabs.tabs[pageIndex + 1].active = true;
          
                   
          }          
         // console.log(sucessResponse);
        }, errorResponse => {          
          console.log(errorResponse);
          return false;
          //Error Message
          //this.messageService.alert(errorResponse.httpErrorResponse);
        }, () => {
          return true;
          //Success Message
          //this.messageService.notify(this.success_response);
        });
      }
    }
    else {
      // this.messageService.alert("Form is not valid");
      return false;
    }

  }


  //final submit
  onFormSubmit() {    
    //to show validation on submit click
    this.templateForm.markAllAsTouched();

    if (this.templateForm.valid) {
      //creating post param array
      let templateFormValue: FromSubmitClass[] = [];
      //looping through template form object
      this.layoutDetails.layout.pages.forEach((pageObject, pageIndex) => {
        pageObject.sections.forEach((sectionObject, sectionIndex) => {
          sectionObject.comps.forEach((componentObject, componentIndex) => {
            //skipping values of buttons
            if (componentObject.settings.setting_type !== "button" && componentObject.settings.setting_type !== "submit") {
              let formValue = new FromSubmitClass;
              formValue.layout_guid = this.layoutDetails.layout.layout_guid;
              formValue.layout_id = this.layoutDetails.layout.layout_id;

              formValue.page_guid = pageObject.page_guid;
              formValue.page_id = pageObject.page_id;

              formValue.section_guid = sectionObject.section_guid;
              formValue.section_id = sectionObject.section_id;

              formValue.comp_guid = componentObject.comp_guid;
              formValue.comp_id = componentObject.comp_id;
              formValue.comp_name=componentObject.comp_name;

              if(this.templateForm.get(pageObject.page_name).get(componentObject.comp_name).value instanceof Array){
                formValue.data_value=(this.templateForm.get(pageObject.page_name).get(componentObject.comp_name).value).toString();
              }
              else
              {
              formValue.data_value = this.templateForm.get(pageObject.page_name).get(componentObject.comp_name).value;
              }


              //formValue.data_value = this.templateForm.get(pageObject.page_name).get(componentObject.comp_name).value;
             // console.log(this.templateForm.get(pageObject.page_name).get(componentObject.comp_name).value);
              templateFormValue.push(formValue);
            }
          })
        })
      })

      //if post param array is not empty
      if (templateFormValue.length > 0) {
        this.restService.ApiEndPointUrlOrKey = Registration.addFormValueByExamGuid;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.ShowLoadingSpinner = true;
        let _httpParams = {
          "templateFormValue": templateFormValue,
          "examGuid":this.examGuid
          //"registrationId":this.registrationId
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          this.templateForm.reset();
          //this.success_response = sucessResponse;
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'OK').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              this.router.navigateByUrl("/registration/payments/paytm");
            }
            else {
              this.messageService.hideModal();
            }
          });
        }, errorResponse => {
          //Error Message
          this.messageService.alert(errorResponse.httpErrorResponse);
        }, () => {
          //Success Message
          //this.messageService.notify(this.success_response);
          //this.router.navigateByUrl("/registration/layout/"+this.templateId+"/sample-data");
        });
      }
    }
    else {
      // this.messageService.alert("Form is not valid");
    }

  }

}
