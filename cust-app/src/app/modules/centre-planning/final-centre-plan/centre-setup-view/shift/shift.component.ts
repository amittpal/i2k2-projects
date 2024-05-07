import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";

import { PrimaryHeaderService } from "../../../../layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { Centre } from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../service/shared.service";

@Component({
  selector: "app-shift",
  templateUrl: "./shift.component.html",
  styleUrls: ["./shift.component.scss"],
})
export class ShiftComponent implements OnInit {
  @Input() regGuid: any;
  @Input() snapShotId: any; // get Snapshot id from parent component
  @Output() private nextTab = new EventEmitter<number>();

  examShiftDetails: any = {};
  numberOfShifts: any = [];
  items = [];
  itemCount = 0;
  searchAddedUserModal: any;
  optionList: any;  
  showdistribution: boolean = true;  
  optionId: any;
  shiftDetailsParam = {    
    "shiftsMain": []
  };

  constructor(
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService,
    private SharedService: SharedService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.getIntialData();    
  }

  // prevent memory leak when component destroyed

  getIntialData() {
    var keyData = [
      {
        name: "regGuid",
        value: this.regGuid,
      },
      {
        name: "allocationSnapshotId",
        value: this.snapShotId,
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Centre.getShiftsDetailsList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      (successResponse) => {        
        this.items = successResponse.exams;
        this.createInitialShiftParam();
        this.getTotalQuestion();
      },
      (errorResponse) => {
        this.messageService.alert(errorResponse);
      }
    );
  }

  createInitialShiftParam(){
    this.items.forEach((element, index) => {      
      element["shifts"].forEach(innerElement => {

        let param = {
          "id": "",
          "exam_guid": element["exam_guid"],
          "exam_date": innerElement["exam_date"],
          "exam_reporting_time": innerElement["exam_reporting_time"],
          "exam_start_time": innerElement["exam_start_time"],
          "exam_end_time": innerElement["exam_end_time"],
          "shift_number": innerElement["shifts"],
          "distribution": innerElement["reg_distributions"],
          "allocation_snapshot_id": this.snapShotId,
          "status": ""
        }

        this.shiftDetailsParam["shiftsMain"].push(param);
        
      });
    });
  }

  updateProductDetails(updatedItem: any) {
    this.items.forEach((element, i) => {
      this.items[i] = Object.create(this.items[i]);
    });

    // let i = 0;
    // for (i; i < this.itemCount; i++) {
    //   if (this.items[i].shift_number === updatedItem.prodInfo.shift_number) {
    //     this.items[i] = updatedItem.prodInfo;
    //     // this.calTotalAmount();
    //     break;
    //   }
    // }
  }

  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  getChildComponentData(childData: any) {
    let exam_guid = childData["exam_guid"];
    let shift_number = childData["shift_number"];
    this.items.forEach((element, i) => {      
      if (element["exam_guid"] == exam_guid) {
        element["shifts"].forEach((innerElement,shiftIndex) => {
          if (innerElement["shifts"] == shift_number){
            this.items[i]["shifts"][shiftIndex]["exam_date"] = childData["exam_date"];
            this.items[i]["shifts"][shiftIndex]["exam_end_time"] = childData["exam_end_time"];
            this.items[i]["shifts"][shiftIndex]["exam_reporting_time"] = childData["exam_reporting_time"];
            this.items[i]["shifts"][shiftIndex]["exam_start_time"] = childData["exam_start_time"];
            this.items[i]["shifts"][shiftIndex]["reg_distributions"] = childData["distribution"];
            this.items[i]["shifts"][shiftIndex]["shifts"] = childData["shift_number"];

            this.items[i] = Object.create(this.items[i]);
          }
        });
      }
    });
    this.getTotalQuestion();    
  }

  getTotalQuestion() {       
    this.items.forEach((element,index) => {
      let totalQuestion = 0;
      element["shifts"].forEach(innerElement => {
        if (innerElement.reg_distributions > 0) {
            totalQuestion += parseInt(innerElement.reg_distributions);
            this.items[index]["totalQuestion"] = totalQuestion;            
          let matchedShiftIndex = this.shiftDetailsParam["shiftsMain"].findIndex(j => 
          { return j.exam_guid == element.exam_guid && j.shift_number == innerElement.shifts});
          
          if (matchedShiftIndex != -1){              
              this.shiftDetailsParam["shiftsMain"][matchedShiftIndex]["exam_date"] = innerElement["exam_date"],
              this.shiftDetailsParam["shiftsMain"][matchedShiftIndex]["exam_reporting_time"] = innerElement["exam_reporting_time"],
              this.shiftDetailsParam["shiftsMain"][matchedShiftIndex]["exam_start_time"] = innerElement["exam_start_time"],
              this.shiftDetailsParam["shiftsMain"][matchedShiftIndex]["exam_end_time"] = innerElement["exam_end_time"],
              this.shiftDetailsParam["shiftsMain"][matchedShiftIndex]["shift_number"] = innerElement["shifts"],
              this.shiftDetailsParam["shiftsMain"][matchedShiftIndex]["distribution"] = innerElement["reg_distributions"]                          
          }
        }        
      });
    });

    this.items.forEach((element, index) => {
      if (element.totalQuestion > 100) {
          this.messageService.ok(
            "Reg Data Distribution can't be greater than 100% "
          );
      }
    });

  }

  private getParams() {
      // this.items.forEach((a, i) => {
      //   this.items[i]["shifts"]["distribution"] = "0";
      // });    

    let params = {      
      shiftsMain: this.shiftDetailsParam["shiftsMain"]
    };
    return params;
  }

  onShiftNumberChange(shiftNumber: any) {
    // console.log(shiftNumber);
  }

}
