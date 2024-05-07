import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { FormClassList, FromSubmitClass, FormClass, LayoutDetails } from 'src/app/shared/classes/registration/form.class';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';
import { PageClass } from 'src/app/shared/classes/registration/page.class';
import { Registration } from 'src/app/shared/enumrations/app-enum.enumerations';
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service.js';
import { GridsterConfig, GridType } from 'angular-gridster2';

@Component({
  selector: 'app-layout-sample-data-view',
  templateUrl: './layout-sample-data-view.component.html',
  styleUrls: ['./layout-sample-data-view.component.scss']
})
export class LayoutSampleDataViewComponent implements OnInit {
  //Tabs
  @ViewChild('pagesTabs', { static: false }) pageTabs: TabsetComponent;
  layouts=[];
  layoutDetails: LayoutDetails;
  templateForm: FormGroup = new FormGroup({});
  success_response: any;
  private registrationId:number;
  templateId: number;
  public config = bubbleConfig
  public offset = 0;  
  public bubbleLabels: any = {}
  public resultModal: string;
  public resetFilterFlag: boolean = false;
  public updatedFilter: any;
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  public showProgress: boolean = false;
  public isLoading: boolean = false;
  public reloadBubble = true
  public paginationStyle = 'minimal';
  public appRoutes: any = {};
  private searchFilter: any = {
    "layout_filter": {
      "layout": {
        "layout_code": "",
        "name": "",
        "layout_status": "",
        "layout_exam_type": ""      
      },
      "paging": {
        "last_seen_id_max": 0,
        "last_seen_id_min": 0,
        "last_offset": 0,
        "page_size": 0,
        "sort_by": "string",
        "order_dir": "string",
        "direction": 0,
        "page_num": 0,
        "sort_exp": "string",
        "sort_dir": "string",
        "total_rows": 0
      },
      "cols": []
    }
  };
  public defaultPagingParams: any = {
    "total_rows": 0,
    "returned_rows": 0,
    "direction": 0,
    "order_dir": "",
    "page_size": 10,
    "sort_by": "",
    "offset": 0,
    "last_offset": 0,
    "last_seen_id_max": 0,
    "last_seen_id_min": 0
  }
  additionalDetails ={   
    registrationGuid:""
   };
    //gridster configration
    gridsterConfigration: GridsterConfig = {         
      mobileBreakpoint: 750,            
      gridType: GridType.VerticalFixed,
      fixedRowHeight: 75,
      minCols: 12,    
      minRows: 7, 
      setGridSize:true,          
      maxCols: 12 
      
      };
  constructor(
    private messageService: MessageService,
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService
  )
  {

    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
   }

   ngOnInit() {  
    this.primaryHeader.pageTitle.next("Sample Data view");
    this.route.params.subscribe((params: Params) => {
      // this.templateId = params['id'];
      this.registrationId=params['id']
     
      this.getTemplateDetails(params['id']);    
      this.getLayoutsList(); 
    }, error => {
      console.error('Error: ', error);
    });

  }


  
  //Getting template details by id
  getTemplateDetails(id) {   
    var keyData = [
      {
        "name": "regId",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registration.sampleDataView;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        //console.log(sucessResponse)
        this.layoutDetails = sucessResponse;    
        this.additionalDetails.registrationGuid=this.layoutDetails.layout.layout_registration_guid;    
        this.addFormGroups(this.layoutDetails);        
      }, errorResponse => {
        //this.messageService.ok('No data available...');
      });

  }

  //Adding form group
  addFormGroups(formData:any) {

    //each page in object will be a form group
    for (let i = 0; i < formData.layout.pages.length; i++) {
      this.templateForm.addControl(formData.layout.pages[i].page_name, new FormGroup({}));
    }
  }

  onOutputEmitterSubmit(value: any, componentDetails: any, pageId: string, sectionId: string) {

   
    //handling output for next button submit
    if (componentDetails.comp_name === "NgxIxcheckNextbutton") {
      let pageIndex = this.layoutDetails.layout.pages.findIndex(p => p.page_guid === pageId);
      if (pageIndex >= 0) {

        //current tab is no longer disabled
        this.pageTabs.tabs[pageIndex].disabled = false; 
        
        //enabling and activating next page tab   
        this.pageTabs.tabs[pageIndex + 1].disabled = false;
        this.pageTabs.tabs[pageIndex + 1].active = true;

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
  submitFormGroupValues(formGroup: FormGroup, currentPage: PageClass) { 
  
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
      })


      //if post param array is not empty
      if (formValues.length > 0) {
        
        this.restService.ApiEndPointUrlOrKey = Registration.addFromValue;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.ShowLoadingSpinner = true;
        let _httpParams = {
          "templateFormValue": formValues,
          "registrationsGuid":  this.layoutDetails.layout.layout_registration_guid
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          if(sucessResponse.registration)
          {
            this.registrationId=sucessResponse.registration.id
          }          
         // console.log(sucessResponse);          
        }, errorResponse => {
          console.log(errorResponse)
          //Error Message
          //this.messageService.alert(errorResponse.httpErrorResponse);
        }, () => {
          //Success Message
          //this.messageService.notify(this.success_response);
        });
      }
    }
    else {
      // this.messageService.alert("Form is not valid");
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
        this.restService.ApiEndPointUrlOrKey = Registration.addFromValue;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.ShowLoadingSpinner = true;
        let _httpParams = {
          "templateFormValue": templateFormValue,
          "registrationsGuid":this.layoutDetails.layout.layout_registration_guid
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          this.templateForm.reset();
          this.success_response = sucessResponse;                    
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              // this.router.navigateByUrl("/registration/layout/"+this.templateId+"/sample-data");
              this.router.navigateByUrl("/registration/layouts");
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
  public getLayoutsList(params?: NgxIxcheckTableParams) {
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.layout_filter.paging.direction = params.direction;
      this.searchFilter.layout_filter.paging.offset = params.offset;
      this.searchFilter.layout_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.layout_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.layout_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

      this.restService.ApiEndPointUrlOrKey = Registration.getLayoutList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress=true;
      this.restService.callApi()
        .subscribe(sucessResponse => {   
                
          this.layouts=sucessResponse.layout;               
          //this.getTemplateDetails(this.templateId);

        }, errorResponse => {
          if (errorResponse !== undefined) {            
            //this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        });
    
  }

 
  
}
