import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { FormClassList, FromSubmitClass, FormClass, LayoutDetails } from 'src/app/shared/classes/registration/form.class';
import { FormGroup, FormBuilder } from '@angular/forms';
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
import { CompactType, DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
@Component({
  selector: 'app-layout-preview',
  templateUrl: './layout-preview.component.html',
  styleUrls: ['./layout-preview.component.scss']
})
export class LayoutPreviewComponent implements OnInit {

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
  additionalDetails ={   
    registrationGuid:""
   };

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

  
    //gridster configration
    gridsterConfigration: GridsterConfig = {         
      minCols: 12,
      maxCols: 12,
      //minRows: 7,
      setGridSize: true,
      mobileBreakpoint: 750,
      gridType: GridType.VerticalFixed,
      fixedRowHeight:80,   
    };

  constructor(
    private messageService: MessageService,
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService
  ) {

    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
   }

  ngOnInit() {

    this.primaryHeader.pageTitle.next("LAYOUT PREVIEW");
    this.route.params.subscribe((params: Params) => {

      this.templateId = params['id'];

      //this.getTemplateDetails(params['id']);
    }, error => {
      console.error('Error: ', error);
    });

  }

 


  //Getting template details by id
  getTemplateDetails(id) {
    var keyData = [
      {
        "name": "layoutId",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registration.viewLayout;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {        
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
    // for (let i = 0; i < formData.layout.pages.length; i++) {
    //   this.templateForm.addControl(formData.layout.pages[i].page_name, new FormGroup({}));
    // }
    formData.layout.pages.forEach(page => {
      this.templateForm.addControl(page.page_guid, new FormGroup({}));
      page.sections.forEach((section: any) => {
        let pageGroup = this.templateForm.get(page.page_guid) as FormGroup;
        pageGroup.addControl(section.section_guid, new FormGroup({}));
        //  if(section.section_visibility !=="true")
        //  {
        //    pageGroup.get(section.section_guid).disable();
        //  }              
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
        this.pageTabs.tabs[pageIndex].disabled = false;
        //enabling and activating next page tab
        this.pageTabs.tabs[pageIndex + 1].disabled = false;
        this.pageTabs.tabs[pageIndex + 1].active = true;        
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
    
       if(value.length>0)
        {
          this.templateForm.get(pageDetails.page_guid)
          .get(sectionDetails.section_guid)
          .get(componentDetails.comp_name).setValue(value[0].result);    
        }
        else
        {
          this.templateForm.get(pageDetails.page_guid)
          .get(sectionDetails.section_guid)
          .get(componentDetails.comp_name).setValue("");    
        }  

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
          section.section_visibility = 1;
        }
        else {
          this.templateForm.get(pageDetails.page_guid).get(section.section_guid).disable();
          section.section_visibility = 0;
        }
      }

    }
    else
    {      
      this.templateForm.get(pageDetails.page_name).get(sectionDetails.section_guid).get(componentDetails.comp_name).setValue(value);          
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

            // if(formGroup.get(componentObject.comp_name).value instanceof Array){              
            //   formValue.data_value=(formGroup.get(componentObject.comp_name).value).toString();
            // }
            // else
            // {
            // formValue.data_value = formGroup.get(componentObject.comp_name).value;
            // }
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
      })


      //if post param array is not empty
      if (formValues.length > 0) {

        this.restService.ApiEndPointUrlOrKey = Registration.addFromValue;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.ShowLoadingSpinner = true;
        let _httpParams = {
          "templateFormValue": formValues,
          "registrationsGuid":this.layoutDetails.layout.layout_registration_guid,
          "candidateGuid":""
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          if(sucessResponse.registration)
          {
            this.registrationId=sucessResponse.registration.reg_id
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
          "registrationsGuid":this.layoutDetails.layout.layout_registration_guid,
          "candidateGuid":""
        }

        this.restService.HttpPostParams = _httpParams;
        this.restService.callApi().subscribe(sucessResponse => {
          this.templateForm.reset();
          this.success_response = sucessResponse;
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              this.router.navigateByUrl("/registration/layout/"+this.templateId+"/sample-data");
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

  public updateTable(data: any) {

    //this.searchFilter.layout_filter.exam_setup = data.exams;
    this.searchFilter.layout_filter.layout = data.layout;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    this.getLayoutsList();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }

  public updateSearch(removedId: string) {
    this.searchFilter.layout_filter.layout[removedId] = "";
    //delete this.searchFilter.layout_filter.range_filter[removedId];
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    this.getLayoutsList();
    this.updateFilter();

  }
  public resetFilter() {
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    this.searchFilter.layout_filter.layout = {}
    this.searchFilter.layout_filter.range_filter = {}
    this.getLayoutsList();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;
    //this.updatedFilter = this.searchFilter.layout_filter.exam_setup;
    this.updatedFilter = this.searchFilter.layout_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
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
          this.getTemplateDetails(this.templateId);

        }, errorResponse => {
          if (errorResponse !== undefined) {
            //this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        });

  }

  public onLayoutChange(templateId:any)
  {
    if(templateId)
    {
      this.getTemplateDetails(templateId);
    }
  }
}
