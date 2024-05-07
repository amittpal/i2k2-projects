import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';

import { HandelError } from 'src/app/shared/models/app.models';

import { Centre } from 'src/app/shared/enumrations/app-enum.enumerations.js';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-import-view',
  templateUrl: './import-view.component.html',
  styleUrls: ['./import-view.component.scss']
})
export class ImportViewComponent implements OnInit {

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

  ph_female: any = [];
  ph_other: any = [];
  other_female: any = [];
  other: any = [];
  total: any = [];



  constructor(
    private restService: GlobalRestService,
    private messageService: MessageService,  
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
      this.getIntialData()
    }, error => {
      console.error('Error: ', error);
    });
  }
  ngOnDestroy() {;
   // this.config.data = [];
    //this.config.data.push({});
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


      //Add total in Priority1
      if(this.itemPriority1.length>0)
      {
      this.ph_other = 0;
      this.ph_female= 0;
      this.other_female= 0;
      this.other= 0;
      this.total = 0;
      this.itemPriority1.filter(element => {
        this.ph_other+= parseInt(element["ph_other"]);
        this.ph_female += parseInt(element["ph_female"]);
        this.other_female += parseInt(element["other_female"]);
        this.other += parseInt(element["other_other"]);
        this.total += parseInt(element["total"]);
      });

      this.itemPriority1.push({
        
        city_name: "",
        state_name: "Total",
        ph_female: this.ph_female,
        other_female: this.other_female,
        ph_other: this.ph_other,
        other_other: this.other,
        total: this.total
      })
    }
      
        //Add total in Priority2

        if(this.itemPriority2.length>0)
        {
        this.ph_other = 0;
        this.ph_female= 0;
        this.other_female= 0;
        this.other= 0;
        this.total = 0;
        this.itemPriority2.filter(element => {
          this.ph_other+= parseInt(element["ph_other"]);
          this.ph_female += parseInt(element["ph_female"]);
          this.other_female += parseInt(element["other_female"]);
          this.other += parseInt(element["other_other"]);
          this.total += parseInt(element["total"]);
        });
  
        this.itemPriority2.push({
          
          city_name: "",
          state_name: "Total",
          ph_female: this.ph_female,
          other_female: this.other_female,
          ph_other: this.ph_other,
          other_other: this.other,
          total: this.total
        })
      }


       //Add total in Priority3

       if(this.itemPriority3.length>0)
       {
       this.ph_other = 0;
       this.ph_female= 0;
       this.other_female= 0;
       this.other= 0;
       this.total = 0;
       this.itemPriority3.filter(element => {
         this.ph_other+= parseInt(element["ph_other"]);
         this.ph_female += parseInt(element["ph_female"]);
         this.other_female += parseInt(element["other_female"]);
         this.other += parseInt(element["other_other"]);
         this.total += parseInt(element["total"]);
       });
 
       this.itemPriority3.push({
         
         city_name: "",
         state_name: "Total",
         ph_female: this.ph_female,
         other_female: this.other_female,
         ph_other: this.ph_other,
         other_other: this.other,
         total: this.total
       })
      }
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
