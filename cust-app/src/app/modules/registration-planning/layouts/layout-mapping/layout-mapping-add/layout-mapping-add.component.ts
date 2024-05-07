import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { FormClassList, FromSubmitClass, FormClass, LayoutDetails } from 'src/app/shared/classes/registration/form.class';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';
import { PageClass } from 'src/app/shared/classes/registration/page.class';
import { Registration } from 'src/app/shared/enumrations/app-enum.enumerations';
import bubbleConfig from "../../../../../../assets/config/bubbleconfig.json";
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service.js';
import { forkJoin } from 'rxjs';
import { GridsterConfig, GridType } from 'angular-gridster2';

@Component({
  selector: 'app-layout-mapping-add',
  templateUrl: './layout-mapping-add.component.html',
  styleUrls: ['./layout-mapping-add.component.scss']
})
export class LayoutMappingAddComponent implements OnInit {

 @ViewChild('filterOpen',{ static: false }) filterOpen: ElementRef<HTMLElement>;
 //Tabs
 @ViewChild('pagesTabs', { static: false }) pageTabs: TabsetComponent;
 
 layouts=[];
 initialLayoutList=[];
 mainLayoutList=[];
 layoutDetails:any={
   "layout":{     
     "name":"",
     "pages":[]
   }
 };
 registrationDetails:any;
 templateForm: FormGroup = new FormGroup({});
 layoutForm: FormGroup;
 success_response: any;
 

 registrationGuid="";
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
       "layout_status": ""          
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
      // mobileBreakpoint: 750,              
      // gridType: GridType.VerticalFixed,
      // fixedRowHeight: 70,
      // minCols: 12,
      // maxCols: 12       
    mobileBreakpoint: 750,            
    gridType: GridType.VerticalFixed,
    fixedRowHeight: 75,
    minCols: 12,    
    //minRows: 6, 
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
 ) {

   this.configService.getAppRoutes.subscribe(configData => {
     this.appRoutes = configData;
   }, error => {
     console.error('Error for configService.getAppRoutes: ', error);
   });
  }

 ngOnInit() {

   this.primaryHeader.pageTitle.next("MAP LAYOUT");
   this.createFroms()
   this.route.params.subscribe((params: Params) => {
     this.registrationGuid = params['registrationGuid'];      
     this.getRegistrationDetails(this.registrationGuid);          
   }, error => {
     console.error('Error: ', error);
   });   
 }


 createFroms()
 {      
  
   this.layoutForm= new FormGroup({
       initialLayoutGroup:new FormGroup({
       initialLayoutId:new FormControl('',[Validators.required]),
       initialLayoutName:new FormControl({value:'',disabled:true})
     }),
     mainLayoutGroup:new FormGroup({
      mainLayoutId:new FormControl('',[Validators.required]),
      mainLayoutName:new FormControl({value:'',disabled:true})
    })
   })
 }

 initializeFromValues()
 {      
   let selectedMainLayout=this.mainLayoutList.find(l=>l.id == this.registrationDetails.registrations[0].layout_id);
   let selectedInitialLayout=this.initialLayoutList.find(l=>l.id == this.registrationDetails.registrations[0].initial_layout_id);

   this.layoutForm= new FormGroup({
       initialLayoutGroup:new FormGroup({
       initialLayoutId:new FormControl(selectedInitialLayout ? selectedInitialLayout.id:'',[Validators.required]),
       initialLayoutName:new FormControl({value:selectedInitialLayout ? selectedInitialLayout.name:'',disabled:true})
     }),
     mainLayoutGroup:new FormGroup({
      mainLayoutId:new FormControl(selectedMainLayout ? selectedMainLayout.id:'',[Validators.required]),
      mainLayoutName:new FormControl({value:selectedMainLayout ? selectedMainLayout.name:'',disabled:true})
    })
   })
 }

 public filterClick() {
  let el: HTMLElement = this.filterOpen.nativeElement;
  el.click();
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
       this.addFormGroups(this.layoutDetails);        
     }, errorResponse => {
       //this.messageService.ok('No data available...');
     });

 }

  //Getting template details by id
  getRegistrationDetails(registrationGuid:string) {
    var keyData = [
      {
        "name": "registrationGuid",
        "value": registrationGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registration.getRegistrationDetailsByGuid;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    //this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {                        
        this.registrationDetails = sucessResponse;           
        this.getLayoutTypesList();     
        //this.addFormGroups(this.layoutDetails);        
      }, errorResponse => {
        //this.messageService.ok('No data available...');
      });
 
  }

  //get initial and main layout types list for fropdown
  getLayoutTypesList()
  {
    let keyData=[
      {
        "name":"registrationGuid",
        "value":this.registrationGuid
      },
      {
        "name":"layoutCode",
        "value":"initiallayout"
      }
    ]
    //initial layout types list  
    this.restService.ApiEndPointUrlOrKey = Registration.getLayoutTypeListByRegistrationId;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    const initialLayoutList=this.restService.callApi(keyData)  ;

    let keyDataMain=[
      {
        "name":"registrationGuid",
        "value":this.registrationGuid
      },
      {
        "name":"layoutCode",
        "value":"registrationlayout"
      }
    ]
    //initial layout types list  
    this.restService.ApiEndPointUrlOrKey = Registration.getLayoutTypeListByRegistrationId;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    const mainLayoutList=this.restService.callApi(keyDataMain);
    forkJoin([initialLayoutList,mainLayoutList]).subscribe((successResponse)=>{
     console.log(successResponse);
      this.initialLayoutList=successResponse[0].layout;
      this.mainLayoutList=successResponse[1].layout;
      this.initializeFromValues();
    })
      
  }

  

 //Adding form group
 addFormGroups(formData:any) {
   //each page in object will be a form group
   for (let i = 0; i < formData.layout.pages.length; i++) {
     this.templateForm.addControl(formData.layout.pages[i].page_name, new FormGroup({}));
   }
 }

 onLayoutMapAdd()
 {   
   if(this.layoutForm.valid)
   {
    let initialLayoutId=this.layoutForm.get('initialLayoutGroup').get('initialLayoutId').value;
    let mainLayoutId=this.layoutForm.get('mainLayoutGroup').get('mainLayoutId').value;

    this.restService.ApiEndPointUrlOrKey = Registration.mapRegistrationLayout;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    let _httpParams = {

      "layout_id": mainLayoutId,
      "registration_guid":this.registrationGuid,
      "initial_layout_id":initialLayoutId

    }
    
    this.restService.HttpPostParams = _httpParams;
    this.restService.callApi().subscribe(sucessResponse => {
      this.templateForm.reset();
      this.success_response = sucessResponse;
      console.log(this.success_response);
      //this.router.navigateByUrl("/registration/layouts");
      this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
        if (result == true) { // OK = true for redirection
          this.messageService.hideModal();
          this.router.navigate(['registrations']);
        }
        else { // NO/CANCEL = false
          this.messageService.hideModal();
        }
      });
    }, errorResponse => {
      //Error Message
      this.messageService.alert(errorResponse.httpErrorResponse);
    }, () => {
      //Success Message
      //this.messageService.notify(this.success_response);
    });
   }  
   else
   {
    this.messageService.ok("Please provide required values.");      
    document.getElementById('layoutForm').classList.add("was-validated");            
   }
 }

 public updateTable(data: any) {
  
  //  //this.searchFilter.layout_filter.exam_setup = data.exams;
  //  this.searchFilter.layout_filter.layout = data.layout;
  //  this.config.data[0] = data.bubbleConfig;
  //  this.searchFilter.layout_filter.paging = this.defaultPagingParams;
  //  this.getLayoutsList();
  //  this.resetFilterFlag = false;
  //  this.updatedFilter = {};
  //  //this.config.data[0] = this.setConfig();   // change dropdown name with value
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

     //this.restService.ApiEndPointUrlOrKey = Registration.getLayoutList;
     this.restService.ApiEndPointUrlOrKey = Registration.getLayoutDropdownList;
     this.restService.HttpPostParams = this.searchFilter;
     this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
     this.showProgress=true;
     this.restService.callApi()
       .subscribe(sucessResponse => {            
         this.layouts=sucessResponse.layout;              
       }, errorResponse => {
         if (errorResponse !== undefined) {            
           //this.notFound = true;
           this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
         }
       });
   
 }

 public onInitialLayoutChange(layoutId:string)
 {     

   if(layoutId)
   {     
     let initialLayoutName=this.initialLayoutList.find(l=>l.id == layoutId).name;
     this.layoutForm.get('initialLayoutGroup').get('initialLayoutName').setValue(initialLayoutName);                        
     this.getTemplateDetails(layoutId);
   }
 }

 public onMainLayoutChange(layoutId:string)
 {
  if(layoutId)
  {
    let mainLayoutName=this.mainLayoutList.find(l=>l.id == layoutId).name;
    this.layoutForm.get('mainLayoutGroup').get('mainLayoutName').setValue(mainLayoutName);        
    this.getTemplateDetails(layoutId);
  }
 }

 onInitialLayoutPreviewClick()
 {   
   if(this.layoutForm.get('initialLayoutGroup').valid)
   {
    let layoutId=this.layoutForm.get('initialLayoutGroup').get('initialLayoutId').value;
    if(layoutId)
    {
      this.getTemplateDetails(layoutId);
    } 
   }
   else
   {
    document.getElementById('initialLayoutForm').classList.add("was-validated");            
   }
                            
  
 }

 onMainLayoutPreviewClick()
 {
   if(this.layoutForm.get('mainLayoutGroup').valid)
   {
    let layoutId=this.layoutForm.get('mainLayoutGroup').get('mainLayoutId').value;
    if(layoutId)
    {
      this.getTemplateDetails(layoutId);
    } 
   }
   else
   {
    document.getElementById('mainLayoutForm').classList.add("was-validated");            
   }
  
 }
 
 ngAfterViewInit()
 {
  this.filterClick();
 }
 
}
