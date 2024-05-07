import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { Router } from "@angular/router";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../service/shared.service";
import { Subscription } from "rxjs";
import bubbleConfig from "../../../../../../assets/config/bubbleconfig.json";
import { NgxIxcheckTableParams } from "ngx-ixcheck-table-lib";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";

@Component({
  selector: 'app-centre-list',
  templateUrl: './centre-list.component.html',
  styleUrls: ['./centre-list.component.scss']
})
export class CentreListComponent implements OnInit {

  @Input() regGuid: any;
  @Input() snapShotId: any;  
  public items = [];
  addedFlag : boolean = false;
  public examCode = "";
  public importId:any;
  public shiftNumber = "";

  constructor(
    private configService: AppsettingsConfService,
    private SharedService: SharedService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService
  ) {}

  public importCodeList = [];
  public examList = [];
  public shiftNumberList = [];

  public centreFormGroup: FormGroup;

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.initializeFields();   
    this.getImportCodeList();
    this.getExamList();
    this.getSnapshotCentreImportedDetails();
  }

  public initializeFields() {
    this.centreFormGroup = new FormGroup({
      importCode: new FormControl(""),
      examCode: new FormControl(""),
      shiftNumber: new FormControl(""),
    });
  }

  getImportCodeList() {
    let keyData=[
      {
        "name":"regGuid",
        "value":this.regGuid
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Centre.getCentreImportedCode;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.importCodeList = successResponse.imported_centres;
      })
  }

  getSnapshotCentreImportedDetails(){

    let keyData = [
      {
        "name": "allocationSnapshotId",
        "value": this.snapShotId
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Centre.getSnapshotCentreImportedDetails;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        let importId = successResponse.snap_shot[0].import_id;
        if (importId != "") {
          this.centreFormGroup.controls["importCode"].setValue(importId);
          this.centreFormGroup.controls["importCode"].disable();
          this.addedFlag = true;
          this.examCode = this.centreFormGroup.controls["examCode"].value;
          this.shiftNumber = this.centreFormGroup.controls["shiftNumber"].value;
        } else {
          this.addedFlag = false;
        }
      })
  }

  getExamList() {
    let keyData = [
      {
        "name": "regGuid",
        "value": this.regGuid
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Centre.getCentreExamCode;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.examList = successResponse.code;
      })
  }

  getShiftNumbers() {
    this.shiftNumberList = [];
    this.shiftNumber = "";
    this.items = [];
    this.centreFormGroup.controls["shiftNumber"].patchValue("");
    let examGuid = this.centreFormGroup.controls["examCode"].value;
    let keyData = [
      {
        "name": "examGuid",
        "value": examGuid
      },
      {
        "name": "allocationSnapshotId",
        "value": this.snapShotId
      }      
    ]
    this.restService.ApiEndPointUrlOrKey = Centre.getShiftNumbers;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.shiftNumberList = successResponse.shift;
      })
  }

  setInputFields(){
    this.examCode = this.centreFormGroup.controls["examCode"].value;
    this.shiftNumber = this.centreFormGroup.controls["shiftNumber"].value;
  }


  populateCentreList() {    
    this.centreFormGroup.patchValue({
      examCode : "",
      shiftNumber : ""
    })
    
    this.importId = this.centreFormGroup.controls["importCode"].value;
    this.getCentreList(this.importId);
  }

  resetCentreList($event){
    this.populateCentreList();
  }

  updateCentreList($event) {
    this.getSnapshotCentreImportedDetails();
  }

  getCentreList(importId) {    
    this.items = [];
    this.addedFlag = false;
    let keyData = [
      {
        "name": "importId",
        "value": importId
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Centre.getCentreListByImportCode;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.items = successResponse.imported_centres;        
      })
  }
  
}
