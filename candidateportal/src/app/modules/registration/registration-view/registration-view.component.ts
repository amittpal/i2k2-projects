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
  selector: 'app-registration-view',
  templateUrl: './registration-view.component.html',
  styleUrls: ['./registration-view.component.scss']
})
export class RegistrationViewComponent implements OnInit {
  @ViewChild('pagesTabs') pageTabs: TabsetComponent;
  templateForm: FormGroup = new FormGroup({});
  layoutDetails: LayoutDetails;
  examGuid:string="";
  additionalDetails={
   "examGuid":""
  };
  skipComponents=["NgxIxcheckPassword","NgxIxcheckConfirmpassword"];
  disableComponents=["NgxIxcheckEmail","NgxIxcheckUsername"];

    //gridster configration
    gridsterConfigration: GridsterConfig = {         
      mobileBreakpoint: 750, 
      gridType: GridType.VerticalFixed,
      fixedRowHeight: 70,
      minCols: 12,
      maxCols: 12          
      // gridType: GridType.ScrollVertical,
      // minCols: 12,
      // maxCols: 12,
      // minRows: 6                                                  
    };
  constructor(
    private route:ActivatedRoute,
    private restService:GlobalRestService) { }

    ngOnInit() {                
      this.route.params.subscribe((params: Params) => {
        if(params['examId'])
        {
          this.examGuid=params['examId'];
          this.additionalDetails.examGuid=this.examGuid;
          this.getLayoutDetails(this.examGuid);
        }                       
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
                //this.examGuid=sucessResponse.exams[0].exam_guid;
                //this.additionalDetails.examGuid=this.examGuid;
                this.addFormGroups(sucessResponse);                
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
      
      //setting page disable status
      this.layoutDetails.layout.pages.forEach((page,index)=>{

      })
      
    }

    //showing component in read only mode for edit screen
    disableFormComponents()
    {
      this.layoutDetails.layout.pages[0].sections[0].comps.forEach((componentObject,index)=>{
        if(this.disableComponents.includes(componentObject.comp_name))
        {
          componentObject.settings.setting_isdisabled=true
        }
      })      
    }      
}
