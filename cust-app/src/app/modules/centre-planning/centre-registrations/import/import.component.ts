import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { HandelError } from 'src/app/shared/models/app.models';
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";
import { Centre } from 'src/app/shared/enumrations/app-enum.enumerations.js';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { RestMethods } from 'src/app/shared/models/app.models';
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})


export class ImportComponent implements OnInit {

  public items = [];
  examGuid:any;
  public examShiftFormGroup: FormGroup;
  examShiftDetails: any = {};
  // numberOfShifts: any = [];
  total_assigned_students = 0;
  total_remaining_students = 0;
  lastSeenIdMin: any;
  lastSeenIdMax: any;
  lastOffset: any;
  itemCount: any;
  notFound: any;
  searchUserModal: any;
  orgItems: any;
  itemPriority1: any = [];
  itemPriority2: any = [];
  itemPriority3: any = [];
  priority: any;
  importId: any;



  constructor(
    private restService: GlobalRestService,
    private messageService: MessageService,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService,
    private route: ActivatedRoute
  ) {
   
  }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("LAYOUTS");
    this.route.params.subscribe((params: Params) => {
      this.examGuid=params['examGuid'];
      this.importId=params['importId'];
     
      //this.getTemplateDetails(params['id']);
      this.getData()
    }, error => {
      console.error('Error: ', error);
    });
  }
  ngOnDestroy() {;
   // this.config.data = [];
    //this.config.data.push({});
  }
 
  
  public getData() {    
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      }
    ];

      this.restService.ApiEndPointUrlOrKey = Centre.importRegistration;  
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    
    
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {    
           
         //console.log(sucessResponse) ;        
         this.getIntialData();
         
        }, errorResponse => {
         
          if (errorResponse !== undefined) {
            this.items = null;
           
          }
        });
    
  }

  getIntialData() {

    //this.importId=58;
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      },
      {
        "name": "importId",
        "value": this.importId
      },
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getRegistrationSummary;  
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
  
  
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {    
         
       // console.log(successResponse);
       sucessResponse.days_number.forEach(element => {
        this.priority = element.priority;
        if (element.priority == 1) {
          this.itemPriority1.push(element);
        }
        if (element.priority == 2) {
          this.itemPriority2.push(element);
        }
        if (element.priority == 3) {
          this.itemPriority3.push(element);
        }
      });
      // console.log(JSON.stringify(successResponse.city_student_detail));
      // this.orgItems = successResponse.city_student_detail;
      // this.items = successResponse.city_student_detail;
      // this.calculateTotalAssignedStudents();
      },
      errorResponse => {
        this.messageService.alert(errorResponse);
      });
      
     


    // this.restService.ApiEndPointUrlOrKey = Centre.getRegistrationSummary;
    // this.restService.ApiEndPointMehod = RestMethods.Get;
    // this.restService.callApi(keyData).subscribe(successResponse => {

     
    //   successResponse.days_number.forEach(element => {
    //     this.priority = element.priority;
    //     if (element.priority == 1) {
    //       this.itemPriority1.push(element);
    //     }
    //     if (element.priority == 2) {
    //       this.itemPriority2.push(element);
    //     }
    //     if (element.priority == 3) {
    //       this.itemPriority3.push(element);
    //     }
    //   });
     
    // },
    //   errorResponse => {
    //     this.messageService.alert(errorResponse);
    //   });
    

  }
 

 

}
