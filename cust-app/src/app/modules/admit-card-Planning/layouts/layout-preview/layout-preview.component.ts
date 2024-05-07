import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-layout-preview',
  templateUrl: './layout-preview.component.html',
  styleUrls: ['./layout-preview.component.scss']
})
export class LayoutPreviewComponent implements OnInit {
 
 layoutDetails: any = {};
 examTypeList: any=[];
 success_response: any; 
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
 
 //form groups
 public initialLayoutFormGroup: FormGroup;

 public _config: any;
 public orderId: any;
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
   this.initializeLayoutFormValues();
   this.primaryHeader.pageTitle.next("ADMIT CARD LAYOUT PREVIEW");
   this.route.params.subscribe((params: Params) => {
     this.templateId = params['id'];
     this.getTemplateDetails(params['id']);     
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
    this.restService.ApiEndPointUrlOrKey = AdmitCard.viewLayoutPreview;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {       
        this.layoutDetails = sucessResponse;
        this.settingLayoutFormValues();   
      }, errorResponse => {
        //this.messageService.ok('No data available...');
      });
  }

  //initializing layout form values
  initializeLayoutFormValues()
  {
      //setting initial form controls
      this.initialLayoutFormGroup = new FormGroup({
      layoutCode: new FormControl({value: '', disabled: true}),
      layoutName: new FormControl({value: '', disabled: true}),
      layoutExamType: new FormControl({value: '', disabled: true})
    })
  }

  //setting layout form values
  settingLayoutFormValues()
  {
     //setting initial form controls
     this.initialLayoutFormGroup.setValue({
      layoutCode: this.layoutDetails.layout[0].code,
      layoutName: this.layoutDetails.layout[0].name,
      layoutExamType: this.layoutDetails.layout[0].layout_type
     });
     let layout_code = this.layoutDetails.layout[0].code;
     this.templateUrl = "/reports/admitcard/" + layout_code + ".mrt";
  } 
}
