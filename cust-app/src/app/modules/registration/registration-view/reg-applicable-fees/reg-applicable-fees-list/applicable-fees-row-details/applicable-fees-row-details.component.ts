import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { RegistrationsSetup } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-applicable-fees-row-details',
  templateUrl: './applicable-fees-row-details.component.html',
  styleUrls: ['./applicable-fees-row-details.component.scss']
})
export class ApplicableFeesRowDetailsComponent implements OnInit {
  @Input() rowItemData;
  @Output() private updatedDetails = new EventEmitter<any>();
  public feeSetupList: any;
  public registrationGuid:any;
  _item: any;
  _itemOrig: any;
  set item(item: any) {
    this._itemOrig = Object.assign({}, item);
    this._item = item;
  }
  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService
  ) { }
  applicableFeeFormGroup: FormGroup;
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
    }, error => {
      console.error('Error: ', error);
    });
    this.applicableFeeFormGroup = new FormGroup({
      line_num: new FormControl(this.rowItemData.line_num, [Validators.required]),
      level1: new FormControl(this.rowItemData.level1, [Validators.required]),
      level2: new FormControl(this.rowItemData.level2),
      level3: new FormControl(this.rowItemData.level3),
      amount: new FormControl(this.rowItemData.amount, [Validators.required]),
      exam_guid: new FormControl(this.rowItemData.exam_guid),
      reg_type_guid:new FormControl(this.rowItemData.reg_type_guid),
      registration_setup_id: new FormControl(this.registrationGuid.registration_setup_id),
    });
    this.getFeeSetupMasterData();
  }

  onApplicableFeesFormSubmit() {
    if (this.applicableFeeFormGroup.valid) {
      let formData = this.applicableFeeFormGroup.value;

      this.updatedDetails.emit(formData);
    }
  }

  onCancel() {

    this.updatedDetails.emit(this.rowItemData);
  }
  public getFeeSetupMasterData() {
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getFeeSetupMasterList;
    this.restService.callApi().subscribe(successResponse => {
      this.feeSetupList = successResponse.fee_setup_details;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
}