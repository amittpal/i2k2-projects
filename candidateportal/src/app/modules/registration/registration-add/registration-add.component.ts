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
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import appSettings from "../../../../assets/config/settings.json"
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
@Component({
  selector: 'app-registration-add',
  templateUrl: './registration-add.component.html',
  styleUrls: ['./registration-add.component.scss']
})
export class RegistrationAddComponent implements OnInit {
  @ViewChild('pagesTabs') pageTabs: TabsetComponent;
  templateForm: FormGroup = new FormGroup({});
  layoutDetails: LayoutDetails;
  registrationGuid: string = "";
  additionalDetails = { 
    registrationGuid:""
  };
  private appSettingsJson: any = {};

  //gridster configration
  gridsterConfigration: GridsterConfig = {
    // mobileBreakpoint: 750,         
    // gridType: GridType.VerticalFixed,
    // setGridSize:true,
    // fixedRowHeight: 70,
    // minCols: 12,
    // maxCols: 12 

    minCols: 12,
    maxCols: 12,
    //minRows: 7,
    mobileBreakpoint: 750,
    setGridSize: true,
    gridType: GridType.VerticalFixed,
    fixedRowHeight: 65
  };

  constructor(
    private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService,
    private router: Router,
    private headerService: PrimaryHeaderService) { }


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['examId']) {
        this.registrationGuid = params['examId'];
        this.additionalDetails.registrationGuid = this.registrationGuid;
        this.getLayoutDetails(this.registrationGuid);
      }
    }, error => {
      console.error('Error: ', error);
    });
  }

  getLayoutDetails(examGuid: string) {
    if (examGuid) {
      var keyData = [
        // {
        //   "name": "examGuid",
        //   "value": examGuid
        // },
        {
          "name": "layoutType",
          "value": "initiallayout"
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Registration.getLayoutDetailByExamGuid;
      this.restService.ApiEndPointMehod = RestMethods.Get;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
          console.log(sucessResponse);                          
          let jsonResponse = JSON.parse(sucessResponse.layout[0].layout_json);
          this.layoutDetails = jsonResponse;
          this.layoutDetails.layout.layout_type_code = sucessResponse.layout[0].layout_type_code;
          this.additionalDetails.registrationGuid=this.layoutDetails.layout.layout_registration_guid;
          //this.examGuid=sucessResponse.exams[0].exam_guid;
          //this.additionalDetails.examGuid=this.examGuid;
          this.addFormGroups(jsonResponse);

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


  }

  
  onOutputEmitterSubmit(value: any, componentDetails: any, pageId: string, sectionId: string) {            
    let pageDetails = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId);
    let sectionDetails=pageDetails.sections.find(s=>s.section_guid === sectionId);   
    //handling output for next button submit
    if (componentDetails.comp_name === "NgxIxcheckNextbutton") {      
      let pageIndex = this.layoutDetails.layout.pages.findIndex(p => p.page_guid === pageId);
      if (pageIndex >= 0) {

        //current tab is no longer disabled
        //this.pageTabs.tabs[pageIndex].disabled = false;
        //enabling and activating next page tab
        //this.pageTabs.tabs[pageIndex + 1].disabled = false;
        //this.pageTabs.tabs[pageIndex + 1].active = true;        
        let currentFormGroup: FormGroup = this.templateForm.get(pageDetails.page_guid) as FormGroup;
        this.submitFormGroupValues(currentFormGroup, pageDetails);
        
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


    else if(componentDetails.comp_name === "NgxIxcheckFileuploader"
    || componentDetails.comp_name === "NgxIxcheckPhotouploader"
    || componentDetails.comp_name === "NgxIxcheckSignatureUploader"
    || componentDetails.comp_name === "NgxIxcheckPhotouploaderAi")
    {            
    
      this.templateForm.get(pageDetails.page_guid)
      .get(sectionDetails.section_guid)
      .get(componentDetails.comp_name).setValue(value[0].result);    
    }

    
              

    else if(componentDetails.conditional) {
      //handling conditional logic
      let conditionalDetails=componentDetails.conditional;
      if(conditionalDetails.changeType==="bindDropdown")
      {
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
          section.section_visibility =  "1";
          section.section_css_class="section-no-header";
        }
        else {
          this.templateForm.get(pageDetails.page_guid).get(section.section_guid).disable();
          section.section_visibility = "0";
        }
      }

    }
    else
    {      
      this.templateForm.get(pageDetails.page_name).get(sectionDetails.section_guid).get(componentDetails.comp_name).setValue(value);          
    }        
  }

  //submitting form by specific group(page)
  submitFormGroupValues(formGroup: FormGroup, currentPage: PageClass): boolean {                
    if (formGroup.valid) {
      //creating post param array
      let formValues: FromSubmitClass[] = [];
      currentPage.sections.forEach((sectionObject, sectionIndex) => {
        sectionObject.comps.forEach((componentObject, componentIndex) => {
          //skipping values of buttons
          if (componentObject.settings.setting_type !== "button" && componentObject.settings.setting_type !== "submit") {
            let formValue = new FromSubmitClass;

            formValue.layout_type_code = this.layoutDetails.layout.layout_type_code;
            formValue.layout_guid = this.layoutDetails.layout.layout_guid;
            formValue.layout_id = this.layoutDetails.layout.layout_id;

            formValue.page_guid = currentPage.page_guid;
            formValue.page_id = currentPage.page_id;

            formValue.section_guid = sectionObject.section_guid;
            formValue.section_id = sectionObject.section_id;

            formValue.comp_guid = componentObject.comp_guid;
            formValue.comp_id = componentObject.comp_id;
            formValue.comp_name = componentObject.comp_name;

            let componentControl=formGroup.get(sectionObject.section_guid).get(componentObject.comp_name);
            if(componentControl)
            {
              if(componentControl.value instanceof Array){
                formValue.data_value=(componentControl.value).toString();
              }
              else
              {
              formValue.data_value =componentControl.value;
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
          "registration_guid": this.registrationGuid
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          if (sucessResponse) {
            const userName = formValues.find(f => f.comp_name === 'NgxIxcheckUsername').data_value;
            const password = formValues.find(f => f.comp_name === 'NgxIxcheckPassword').data_value;

            this.templateForm.reset();
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'OK').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                //this.router.navigateByUrl("/login");
                this.loginUser(userName, password);
              }
              else {
                this.messageService.hideModal();
                this.loginUser(userName, password);
              }
            });
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
        currentPage.sections.forEach((section:any) => {
          let group = this.templateForm.get(currentPage.page_guid).get(section.section_guid) as FormGroup;
          Object.keys(group.controls).forEach(key => {
            const control=group.get(key);
            control.markAsDirty();
            
            // if(control.invalid)
            // {
              
            //   return;
            // }            
          })  
        });      
      
      // this.messageService.alert("Form is not valid");
      this.messageService.ok("Please provide required values.");
      return false;
    }

  }

  //final submit
  onFormSubmit() {    
    //to show all validation if any on submit click
    //this.templateForm.markAllAsTouched();
    this.layoutDetails.layout.pages.forEach((page: any) => {
      page.sections.forEach((section:any) => {
        let group = this.templateForm.get(page.page_guid).get(section.section_guid) as FormGroup;
        Object.keys(group.controls).forEach(key => {
          group.get(key).markAsDirty();
        })  
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
            if (componentObject.settings.setting_type !== "button" && componentObject.settings.setting_type !== "submit") {
              let formValue = new FromSubmitClass;
              formValue.layout_type_code = this.layoutDetails.layout.layout_type_code;
              formValue.layout_guid = this.layoutDetails.layout.layout_guid;
              formValue.layout_id = this.layoutDetails.layout.layout_id;

              formValue.page_guid = pageObject.page_guid;
              formValue.page_id = pageObject.page_id;

              formValue.section_guid = sectionObject.section_guid;
              formValue.section_id = sectionObject.section_id;

              formValue.comp_guid = componentObject.comp_guid;
              formValue.comp_id = componentObject.comp_id;
              formValue.comp_name = componentObject.comp_name;
              // formValue.data_value = this.templateForm.get(pageObject.page_name).get(componentObject.comp_name).value;
              // templateFormValue.push(formValue);

              let componentControl=this.templateForm.get(pageObject.page_guid).get(sectionObject.section_guid).get(componentObject.comp_name);
              if(componentControl)
              {
                if(componentControl.value instanceof Array){
                  formValue.data_value=(componentControl.value).toString();
                }
                else
                {
                formValue.data_value =componentControl.value;
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
          "registration_guid": this.registrationGuid
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          this.templateForm.reset();
          console.log(sucessResponse);
          const userName = templateFormValue.find(f => f.comp_name === 'NgxIxcheckUsername').data_value;
          const password = templateFormValue.find(f => f.comp_name === 'NgxIxcheckPassword').data_value;

          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'OK').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              //this.router.navigateByUrl("/login");
              this.loginUser(userName, password);
            }
            else {
              //this.messageService.hideModal();
              this.loginUser(userName, password);
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



  loginUser(username, password) {
    this.appSettingsJson = appSettings;
    let httpPostParams = {
      Username: username,
      Password: password,
      AppGuid : appSettings.application_guid,
      ExamGuid: this.registrationGuid
    }

    //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.token.url;
    this.restService.ApiEndPointMehod = this.appSettingsJson.token.method;
    this.restService.HttpPostParams = httpPostParams;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        if (sucessResponse.token.access_token != "") {
          let candidateGuid = sucessResponse.core_user_info.UserUniqueId;
          if (candidateGuid) {
            localStorage.setItem('uniqueUserId', candidateGuid);
            localStorage.setItem('accessToken', sucessResponse.token.access_token);
            this.headerService.userLoginStatus.next(true);
            this.router.navigate(['/dashboard']);
          }
          else {
            localStorage.removeItem('uniqueUserId');
            localStorage.setItem('accessToken', sucessResponse.token.access_token);
            this.router.navigate(['/dashboard']);
          }
        }
        else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem('uniqueUserId');
          localStorage.removeItem("currentUser");
        }
      }, errorResponse => {
        //view returned error object
        localStorage.removeItem("accessToken");
        localStorage.removeItem('uniqueUserId');
        localStorage.removeItem("currentUser");
      }
      );
  }

 



}