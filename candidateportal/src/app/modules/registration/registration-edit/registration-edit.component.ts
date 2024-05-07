import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GridsterConfig, GridType } from 'angular-gridster2';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { FromSubmitClass, LayoutDetails } from 'src/app/shared/classes/registration/form.class';
import { PageClass } from 'src/app/shared/classes/registration/page.class';
import { Registration } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-registration-edit',
  templateUrl: './registration-edit.component.html',
  styleUrls: ['./registration-edit.component.scss']
})
export class RegistrationEditComponent implements OnInit {
  @ViewChild('pagesTabs') pageTabs: TabsetComponent;
  templateForm: FormGroup = new FormGroup({});
  layoutDetails: LayoutDetails;
  registrationGuid: string = "";
  additionalDetails = {
    examGuid: "",
    registrationGuid: "",
    candidateGuid: ""
  };
  skipComponents = [
    "NgxIxcheckPassword",
    "NgxIxcheckConfirmpassword",
    "NgxIxcheckCaptcha",
    "NgxIxcheckCaptchaTextbox"];

  disableComponents = ["NgxIxcheckEmail", "NgxIxcheckUsername"];
  //gridster configration
  gridsterConfigration: GridsterConfig = {
    mobileBreakpoint: 750,
    // gridType: GridType.ScrollVertical,
    minCols: 12,
    maxCols: 12,
    //minRows: 6,
    gridType: GridType.VerticalFixed,
    fixedRowHeight: 65,
    setGridSize: true,
  };

  constructor(
    private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['examId']) {
        this.registrationGuid = params['examId'];
        this.additionalDetails.examGuid = this.registrationGuid;
        this.getLayoutDetails(this.registrationGuid);
      }
    }, error => {
      console.error('Error: ', error);
    });
  }




  getLayoutDetails(examGuid: string) {
    if (examGuid) {
      var keyData = [
        {
          "name": "guid",
          "value": localStorage.getItem('uniqueUserId')
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Registration.getCandidateDetailsByGuid;
      this.restService.ApiEndPointMehod = RestMethods.Get;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
          //let jsonResponse= JSON.parse(sucessResponse.exams[0].layout_json);                
          this.layoutDetails = sucessResponse;
          this.disableFormComponents();
          this.additionalDetails.registrationGuid = this.layoutDetails.layout.layout_registration_guid;
          this.additionalDetails.candidateGuid = this.layoutDetails.layout.candidate_guid;
          //this.examGuid=sucessResponse.exams[0].exam_guid;
          //this.additionalDetails.examGuid=this.examGuid;
          this.addCustomSettingsInLayout();
          this.addFormGroups(sucessResponse);
        }, errorResponse => {
          //this.messageService.ok('No data available...');
        });

    }
  }

  //Adding form group
  addFormGroups(formData: any) {
    //each page in object will be a form group
    formData.layout.pages.forEach(page => {
      this.templateForm.addControl(page.page_guid, new FormGroup({}));
      page.sections.forEach((section: any) => {
        let pageGroup = this.templateForm.get(page.page_guid) as FormGroup;
        pageGroup.addControl(section.section_guid, new FormGroup({}));

      });
    })

    //setting page disable status
    this.layoutDetails.layout.pages.forEach((page, index) => {
      //first page should be readonly
      if (index === 0) {
        page.disabled = false;
        page.active = true;
      }
      if (index === 1) {
        page.active = true;
        page.disabled = false;
      }
    });

  }
  //adding custom css in pages & sections
  addCustomSettingsInLayout() {       
    if(this.layoutDetails.layout.pages.length > 2)
    {
      this.layoutDetails.layout.pages[2].sections[0].section_css_class = "section-education-grid";
      this.layoutDetails.layout.pages[2].sections[1].section_css_class = "section-no-header";
    } 
    
  }


  //showing component in read only mode for edit screen
  disableFormComponents() {
    let componentsArray = this.layoutDetails.layout.pages[0].sections[0].comps;
    componentsArray.forEach((componentObject, index) => {
      if (this.disableComponents.includes(componentObject.comp_name)) {
        componentObject.settings.setting_isdisabled = true
      }
      if (this.skipComponents.includes(componentObject.comp_name)) {
        //deleting component
        componentsArray.splice(index, 1);
      }
    })
  }





  onOutputEmitterSubmit(value: any, componentDetails: any, pageId: string, sectionId: string) {
    let pageDetails = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId);
    let sectionDetails = pageDetails.sections.find(s => s.section_guid === sectionId);
    //handling output for next button submit
    if (componentDetails.comp_name === "NgxIxcheckNextbutton") {
      let currentFormGroup: FormGroup = this.templateForm.get(pageDetails.page_guid) as FormGroup;
      this.submitFormGroupValues(currentFormGroup, pageDetails);
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

    else if (componentDetails.comp_name === "NgxIxcheckFileuploader"
      || componentDetails.comp_name === "NgxIxcheckPhotouploader"
      || componentDetails.comp_name === "NgxIxcheckSignatureUploader"
      || componentDetails.comp_name === "NgxIxcheckPhotouploaderAi") {
      if (value.length > 0) {
        this.templateForm.get(pageDetails.page_guid)
          .get(sectionDetails.section_guid)
          .get(componentDetails.comp_name).setValue(value[0].result);
      }
      else {
        this.templateForm.get(pageDetails.page_guid)
          .get(sectionDetails.section_guid)
          .get(componentDetails.comp_name).setValue("");
      }

    }
    else if (componentDetails.conditional) {
      //handling conditional logic
      let conditionalDetails = componentDetails.conditional;
      if (conditionalDetails.changeType === "bindDropdown") {
        var components = sectionDetails.comps;
        if (components) {
          let currentComponent = components.find(c => c.comp_name === conditionalDetails.componentToChange);
          let index = components.indexOf(currentComponent);
          currentComponent.settings.setting_dataParameter = value;

          this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
            .sections.find(s => s.section_guid === sectionId)
            .comps[index] = { ...currentComponent };
        }
      }
      else if (conditionalDetails.changeType === "setSectionVisibility") {

        let section = this.layoutDetails.layout.pages
          .find(p => p.page_guid === pageId)
          .sections.find(s => s.section_guid === conditionalDetails.sectionToShowHide);

        if (value && value != "No") {
          this.templateForm.get(pageDetails.page_guid).get(section.section_guid).enable();
          section.section_visibility = "1";
          section.section_css_class = "section-no-header";
        }
        else {
          let fromGroup = this.templateForm.get(pageDetails.page_guid).get(section.section_guid);
          fromGroup.reset();
          fromGroup.disable();
          section.section_visibility = "0";
        }

      }

    }
    else {
      this.templateForm.get(pageDetails.page_name).get(sectionDetails.section_guid).get(componentDetails.comp_name).setValue(value);
    }
  }


  //submitting form by specific group(page)
  submitFormGroupValues(formGroup: FormGroup, currentPage: PageClass): boolean {
    //to show validation on submit click
    //formGroup.markAllAsTouched();
    if (formGroup.valid) {
      //creating post param array
      let formValues: FromSubmitClass[] = [];
      currentPage.sections.forEach((sectionObject, sectionIndex) => {
        sectionObject.comps.forEach((componentObject, componentIndex) => {
          //skipping values of buttons
          if (componentObject.settings.setting_type !== "button"
            && componentObject.settings.setting_type !== "submit"
            && !(this.skipComponents.includes(componentObject.comp_name))
            && componentObject.settings.setting_isdisabled === false) {
            let formValue = new FromSubmitClass;
            formValue.layout_guid = this.layoutDetails.layout.layout_guid;
            formValue.layout_id = this.layoutDetails.layout.layout_id;

            formValue.page_guid = currentPage.page_guid;
            formValue.page_id = currentPage.page_id;

            formValue.section_guid = sectionObject.section_guid;
            formValue.section_id = sectionObject.section_id;

            formValue.comp_guid = componentObject.comp_guid;
            formValue.comp_id = componentObject.comp_id;
            formValue.comp_name = componentObject.comp_name;

            let componentControl = formGroup.get(sectionObject.section_guid).get(componentObject.comp_name);
            if (componentControl) {
              if (componentControl.value instanceof Array) {
                formValue.data_value = (componentControl.value).toString();
              }
              else {
                formValue.data_value = componentControl.value;
              }
            }
            formValues.push(formValue);

          }
        })
      });

      //if post param array is not empty
      if (formValues.length > 0) {

        this.restService.ApiEndPointUrlOrKey = Registration.addFormValueByRegistrationGuid;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.ShowLoadingSpinner = true;
        let _httpParams = {
          "template_form_value": formValues,
          "registration_guid": this.registrationGuid,
          "candidate_guid": this.layoutDetails.layout.candidate_guid

        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          if (sucessResponse) {
            //if current form group value saved successfully, moving to next tab.   
            let pageIndex = this.layoutDetails.layout.pages.findIndex(p => p.page_guid === currentPage.page_guid);
            //current tab is no longer disabled
            this.pageTabs.tabs[pageIndex].disabled = false;
            //enabling and activating next page tab
            this.pageTabs.tabs[pageIndex + 1].disabled = false;
            this.pageTabs.tabs[pageIndex + 1].active = true;
          }
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
      currentPage.sections.forEach((sectionObject, sectionIndex) => {
        let group = this.templateForm.get(currentPage.page_guid).get(sectionObject.section_guid) as FormGroup;
        if (group.invalid) {
          Object.keys(group.controls).forEach(key => {
            group.get(key).markAsDirty();
          })
        }
      })

      this.messageService.ok("Please provide required values.");
      return false;
    }

  }

  //final submit
  onFormSubmit() {
    //to show validation on submit click
    //this.templateForm.markAllAsTouched();
    this.layoutDetails.layout.pages.forEach((page: any) => {
      page.sections.forEach((section: any) => {
        let group = this.templateForm.get(page.page_guid).get(section.section_guid) as FormGroup;
        if (group.invalid) {
          Object.keys(group.controls).forEach(key => {
            group.get(key).markAsDirty();
          })
        }
      });
    });

    if (this.templateForm.valid) {
      //creating post param array
      let templateFormValue: FromSubmitClass[] = [];
      //looping through template form object
      this.layoutDetails.layout.pages.forEach((pageObject, pageIndex) => {
        pageObject.sections.forEach((sectionObject, sectionIndex) => {
          sectionObject.comps.forEach((componentObject, componentIndex) => {
            //skipping values of buttons
            if (componentObject.settings.setting_type !== "button"
              && componentObject.settings.setting_type !== "submit"
              && !(this.skipComponents.includes(componentObject.comp_name))
              && componentObject.settings.setting_isdisabled === false) {
              let formValue = new FromSubmitClass;
              formValue.layout_guid = this.layoutDetails.layout.layout_guid;
              formValue.layout_id = this.layoutDetails.layout.layout_id;

              formValue.page_guid = pageObject.page_guid;
              formValue.page_id = pageObject.page_id;

              formValue.section_guid = sectionObject.section_guid;
              formValue.section_id = sectionObject.section_id;

              formValue.comp_guid = componentObject.comp_guid;
              formValue.comp_id = componentObject.comp_id;
              formValue.comp_name = componentObject.comp_name;

              let componentControl = this.templateForm.get(pageObject.page_guid).get(sectionObject.section_guid).get(componentObject.comp_name);
              if (componentControl) {
                if (componentControl.value instanceof Array) {
                  formValue.data_value = (componentControl.value).toString();
                }
                else {
                  formValue.data_value = componentControl.value;
                }
              }
              templateFormValue.push(formValue);
            }
          })
        })
      })

      //if post param array is not empty
      if (templateFormValue.length > 0) {
        this.restService.ApiEndPointUrlOrKey = Registration.addFormValueByRegistrationGuid;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.ShowLoadingSpinner = true;
        let _httpParams = {
          "template_form_value": templateFormValue,
          "registration_guid": this.registrationGuid,
          "candidate_guid": this.layoutDetails.layout.candidate_guid
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'OK').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              this.onSubmitCandidateRegistration();
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
      this.messageService.ok("Please provide required values.");
    }

  }


  onSubmitCandidateRegistration() {
    let postParams = {
      registration_guid: this.registrationGuid,
      candidate_guid: this.layoutDetails.layout.candidate_guid
    }
    this.restService.ApiEndPointUrlOrKey = Registration.submitCandidateRegistration;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.HttpPostParams = postParams;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.templateForm.reset();
        this.router.navigateByUrl("/dashboard");
      });
  }
}
