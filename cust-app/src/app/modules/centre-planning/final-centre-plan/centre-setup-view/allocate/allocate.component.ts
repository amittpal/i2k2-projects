import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
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
  @Input() registrationGuid: any; // get Registration Guid id from parent component

  public allocationAlgoFormGroup: FormGroup;
  public allocationPreferenceList = [];  
  public algoList = [];
  itemCount = 0;
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

}
