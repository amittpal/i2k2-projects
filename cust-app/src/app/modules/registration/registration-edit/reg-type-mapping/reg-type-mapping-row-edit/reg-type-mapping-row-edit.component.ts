import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-reg-type-mapping-row-edit',
  templateUrl: './reg-type-mapping-row-edit.component.html',
  styleUrls: ['./reg-type-mapping-row-edit.component.scss']
})
export class RegTypeMappingRowEditComponent implements OnInit {

  public registrationGuid: any;
  @Input() rowItemData;
  @Output() private updatedDetails = new EventEmitter<any>();
  public examList: any;
  public regTypeList = [];
  @Output() update = new EventEmitter();

  _item: any;
  _itemOrig: any;
  @Input() get item() {
    return this._item;
  }
  set item(item: any) {
    this._itemOrig = Object.assign({}, item);
    this._item = item;
  }
  constructor(
    private route: ActivatedRoute,
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
      exam_code: new FormControl(this.rowItemData.exam_code, [Validators.required]),
      reg_types: new FormControl(this.rowItemData.reg_types, [Validators.required]),
      exam_guid: new FormControl(this.rowItemData.exam_guid, [Validators.required]),
      line_num: new FormControl(this.rowItemData.line_num, [Validators.required])
    });
    this.getExamData();
    this.getRegTypeByGuid();
  }
  multiRegTypeComp(c1: any, c2: any): any {
    return c1 && c2 ? c1.guid === c2.guid : c1 === c2;
  }
  public getRegTypeByGuid() {
    let keydata = [{
      name: "registrationGuid",
      value: this.registrationGuid
    }]
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegTypeByGuid;
    this.restService.callApi(keydata).subscribe(successResponse => {
      if (successResponse.reg_types) {
        this.regTypeList = successResponse.reg_types;
      }
    }, errorResponse => {
      console.log(errorResponse);
    });
  }
  onApplicableFeesFormSubmit() {
    if (this.applicableFeeFormGroup.valid) {
      let formData = this.applicableFeeFormGroup.value;

      this.updatedDetails.emit(formData);
    }
  }

  onSelectExams(guid) {
    let examDetils = this.examList.filter(item => item.exam_guid == guid);
    if (examDetils) {
      // this.applicableFeeFormGroup.controls.name.patchValue(examDetils[0].name);
      this.applicableFeeFormGroup.controls.exam_code.patchValue(examDetils[0].code)
    }
  }

  onCancel() {
    this._item = this._itemOrig;
    const prodInfo = this._itemOrig;
    this.update.emit({ prodInfo, event });
  }
  public getExamData() {
    this.restService.ApiEndPointUrlOrKey = Registrations.getExamList;
    this.restService.callApi().subscribe(successResponse => {
      this.examList = successResponse.exams;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
}