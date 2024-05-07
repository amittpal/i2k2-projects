import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";

import { PrimaryHeaderService } from "../../../../layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { Centre } from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../service/shared.service";

@Component({
  selector: "app-shift-view",
  templateUrl: "./shift-view.component.html",
  styleUrls: ["./shift-view.component.scss"],
})
export class ShiftViewComponent implements OnInit {
  @Input() examGuid: any;

  public examShiftFormGroup: FormGroup;
  examShiftDetails: any = {};
  numberOfShifts: any = [];
  items = [];
  itemCount = 0;
  searchAddedUserModal: any;
  totalQuestion: number;
  optionList: any;
  algoList: any;
  showdistribution: boolean = false;
  regDataStatus: any;
  optionId: any;

  constructor(
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService,
    private SharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.createExamShiftForm();
    this.getIntialData();
  }

  setDefaultOption() {
    this.examShiftFormGroup.patchValue({
      shift_no: 1,
    });
    this.examShiftFormGroup.get("shift_no").disable();
  }

  setDefaultOptionForOneShift() {
    this.examShiftFormGroup.patchValue({
      shift_no: 4,
    });
    this.examShiftFormGroup.get("shift_no").disable();
  }
  // prevent memory leak when component destroyed

  getIntialData() {
    var keyData = [
      {
        name: "examGuid",
        value: this.examGuid,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Centre.getShiftsDetailsList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      (successResponse) => {
        this.optionId = successResponse["days_number"][0]["copy_options_id"];        
        this.checkDistributionVisibility(this.optionId);
        this.items = successResponse.days_number;
        this.examShiftFormGroup.patchValue({
          shift_no: this.optionId,
        });
        this.examShiftFormGroup.disable();
        let algoId = successResponse["days_number"][0]["distribution_guid"];
        this.showHideAlgoControl(this.optionId, algoId);        
        this.regDataStatus = successResponse["days_number"][0]["regdata"];
        if (this.regDataStatus == "0" || this.optionId.length === 0) {
          let shiftCount = successResponse["days_number"].length;
          if (shiftCount == 1) {
            this.setDefaultOptionForOneShift();
            this.showHideAlgoControl("4", algoId);
          }
          else {
            this.setDefaultOption();
          }
        }
        this.getTotalQuestion();
      },
      (errorResponse) => {
        this.messageService.alert(errorResponse);
      }
    );

    // Get Option list
    this.restService.ApiEndPointUrlOrKey = Centre.getOptionList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.optionList = successResponse.days_number;
        // this.items = successResponse.days_number;
        // this.getTotalQuestion();
      },
      (errorResponse) => {
        this.messageService.alert(errorResponse);
      }
    );

    // Get Algo list
    this.restService.ApiEndPointUrlOrKey = Centre.getAlgoList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.algoList = successResponse.distributions_algo;
      },
      (errorResponse) => {
        this.messageService.alert(errorResponse);
      }
    );    

  }

 
  public createExamShiftForm() {
    this.examShiftFormGroup = this.fb.group({
      shift_no: new FormControl("", Validators.required),
      algorithmArray: this.fb.array([])
    });
  }

  getAlgorithmFormArray(): FormArray {
    return this.examShiftFormGroup.controls.algorithmArray as FormArray;
  }

  setAlgorithmControl(): FormGroup {
    return this.fb.group({
      algorithm: new FormControl('', Validators.required)
    })
  }

  addAlgorithmControl() {
    this.getAlgorithmFormArray().push(this.setAlgorithmControl());
  }

  removeAlgorithmControl() {
    this.getAlgorithmFormArray().clear();
  }


  updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (this.items[i].shift_number === updatedItem.prodInfo.shift_number) {
        this.items[i] = updatedItem.prodInfo;
        // this.calTotalAmount();
        break;
      }
    }
  }

  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  getChildComponentData(childData: any) {
    let shift_number = childData["shift_number"];
    this.items.forEach((element, i) => {
      if (element["shift_number"] == shift_number) {
        this.items[i] = childData;
      }
    });
    this.getTotalQuestion();
  }

  getTotalQuestion() {
    this.totalQuestion = 0;
    this.items.forEach((element) => {
      if (element.distribution.length > 0) {
        this.totalQuestion += parseInt(element.distribution);
      }
    });
    if (this.totalQuestion > 100) {
      this.messageService.ok(
        "Reg Data Distribution can't be greater than 100% "
      );
    }
  }

  valueChange(event: any) {
    const selectedId = event.target.value;
    this.checkDistributionVisibility(selectedId);
    this.showHideAlgoControl(selectedId, "");
    // if (this.regDataStatus == "0") {
    //   this.messageService
    //     .confirm(
    //       [
    //         "Please confirm as allocation will be changed as per selected formula",
    //       ],
    //       "Delete",
    //       "Yes",
    //       "NO",
    //       "error"
    //     )
    //     .subscribe((result) => {
    //       if (result == true) {
    //         this.messageService.hideModal();
    //         this.checkDistributionVisibility(selectedId);
    //         this.showHideAlgoControl(selectedId, "");
    //       } else {
    //         this.messageService.hideModal();
    //         this.examShiftFormGroup.patchValue({
    //           shift_no: this.optionId,
    //         });
    //         this.showHideAlgoControl(this.optionId, "");
    //       }
    //     });
    // } else {
    //   this.checkDistributionVisibility(selectedId);
    //   this.showHideAlgoControl(selectedId, "");
    // }
  }

  checkDistributionVisibility(number: any) {
    if (number == "4") {
      this.showdistribution = true;
    } else {
      this.showdistribution = false;
    }
  }

  onShiftNumberChange(shiftNumber: any) {
    // console.log(shiftNumber);
  }

  showHideAlgoControl(selectedId, selectedAlgoId) {
    if (selectedId == "1" || selectedId == "") {
      this.removeAlgorithmControl();
    }
    else {
      this.removeAlgorithmControl();
      this.addAlgorithmControl();
      this.getAlgorithmFormArray().controls[0].reset({
        algorithm: selectedAlgoId
      });
    }
  }

}
