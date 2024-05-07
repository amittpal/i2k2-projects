import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre,
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";
import { SharedService } from "../service/shared.service";

@Component({
  selector: 'app-allocate',
  templateUrl: './allocate.component.html',
  styleUrls: ['./allocate.component.scss']
})
export class AllocateComponent implements OnInit {

  @Input() snapShotId: any; // get Snapshot id from parent component
  @Input() registrationGuid: any; // get Registration Guid id from parent 
  @Output() private enableTab = new EventEmitter<number>();

  public allocationAlgoFormGroup: FormGroup;
  public allocationPreferenceList = [];  
  public algoList = [];
  itemCount = 0;
  disableTab: number[] = [];
  constructor(
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService,
    private SharedService: SharedService
  ) { }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("PLAN CENTRES");        
    this.createForm();
    this.getAllocationAlgo();
    this.getAlgoList()
  }

  public createForm() {
    this.allocationAlgoFormGroup = new FormGroup({
      algo: new FormControl("", Validators.required)
    });
  }

  public getAllocationAlgo(){
    this.restService.ApiEndPointUrlOrKey = Centre.getAllocationAlgo;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.allocationPreferenceList = successResponse.allocation_preferences;
        this.allocationPreferenceList.forEach((item,index)=>{
          this.allocationPreferenceList[index]["line_num"] = index + 1;
        });
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

  public getAlgoList() {
    this.restService.ApiEndPointUrlOrKey = Centre.getAlgoList;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.algoList = successResponse.distributions_algo;
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

  ngDoCheck() {
    if (this.allocationPreferenceList) {
      this.itemCount = this.allocationPreferenceList.length;
    }
  }

  onDrop(dragEvent: any) { }

  public formSubmit() {   

    if (this.allocationAlgoFormGroup.valid === false) {
      let form = document.getElementById("allocationAlgoForm");
      form.classList.add("was-validated");
      return false;
    }

    let algoGuid = this.allocationAlgoFormGroup.controls["algo"].value;
    let allocation_preference_order = [];
    this.allocationPreferenceList.forEach((item,index) => {
      allocation_preference_order.push({ "id": item.id, "sequence" : index + 1 })
    });
    let postParams = {
      "allocation_snapshot_id": this.snapShotId,
      "registration_guid": this.registrationGuid,
      "distribution_algo_guid": algoGuid,
      "allocation_preference_order": allocation_preference_order
    };
    
    this.restService.ApiEndPointUrlOrKey = Centre.allocateAlgoPreference;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = postParams;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.getSnapshotInfo();
        this.messageService.alert(successResponse);
      },
      (errorResponse) => {
        this.messageService.ok(
          errorResponse["httpErrorResponse"]["data"][0]["attributes"][
          "message"
          ][0]
        );
      }
    );
  }

  getSnapshotInfo(){

    let keyData = [
      {
        name: "regGuid",
        value: this.registrationGuid
      },
      {
        name: "id",
        value: this.snapShotId
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getSnapshotInfo;
    this.restService.callApi(keyData).subscribe(
      (successResponse) => {

        let cityPriority = successResponse["snapshot_info"]["exams"][0]["number_of_city_priority"];
        this.SharedService.cityPriorityNumber.next(
          successResponse["snapshot_info"]["exams"][0]["number_of_city_priority"]
        );
        this.SharedService.registrationStatus.next(
          successResponse["snapshot_info"]["snap_shot"][0]["planning_status"]
        );

        this.enableTab.emit(cityPriority);

      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

}
