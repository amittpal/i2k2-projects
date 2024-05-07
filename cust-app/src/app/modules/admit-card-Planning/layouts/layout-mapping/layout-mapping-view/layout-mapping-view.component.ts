import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';

@Component({
  selector: 'app-layout-mapping-view',
  templateUrl: './layout-mapping-view.component.html',
  styleUrls: ['./layout-mapping-view.component.scss']
})
export class LayoutMappingViewComponent implements OnInit {
  
  examDetails:any;  
  success_response: any;    
  registrationGuid: number;  
  public appRoutes: any = {};   
  //form groups
  public layoutMappingViewFormGroup: FormGroup;
  public templateUrl =  "";
  public dataSet: any = [];
 
  constructor(    
    private restService: GlobalRestService,
    private route: ActivatedRoute,    
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
    this.primaryHeader.pageTitle.next("MAPPED LAYOUT VIEW");    
    this.initializeLayoutFormValues();
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];       
      this.getExamDetails(this.registrationGuid);
    }, error => {
      console.error('Error: ', error);
    });    
  }

    //initializing layout form values
    initializeLayoutFormValues()
    {
        //setting initial form controls
        this.layoutMappingViewFormGroup = new FormGroup({
          examName: new FormControl({value: '', disabled: true}),
          examCode: new FormControl({value: '', disabled: true}),
          examType: new FormControl({value: '', disabled: true}),
          layoutCode: new FormControl({value: '', disabled: true}),
          layoutName: new FormControl({value: '', disabled: true})
      })
    }
    //setting layout form values
    settingLayoutFormValues()
    {
       //setting initial form controls
       this.layoutMappingViewFormGroup.setValue({
        examName: this.examDetails.layout[0].registration_name,
        examCode: this.examDetails.layout[0].registration_code,
        examType: this.examDetails.layout[0].layout_type,
        layoutCode: this.examDetails.layout[0].code,
        layoutName: this.examDetails.layout[0].name
       });
    } 
 
   //Getting template details by id
   getExamDetails(id) {
    var keyData = [
      {
        "name": "registrationGuid",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getMappedLayoutView;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;    
     this.restService.callApi(keyData)
       .subscribe(sucessResponse => {
         this.examDetails = sucessResponse;       
         this.settingLayoutFormValues();

         let layout_code = this.examDetails.layout[0].code;
         this.templateUrl = "/reports/admitcard/" + layout_code + ".mrt";
       }, errorResponse => {
         //this.messageService.ok('No data available...');
       });
  
   }
}
