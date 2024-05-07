import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-basic-setup-row-details',
  templateUrl: './basic-setup-row-details.component.html',
  styleUrls: ['./basic-setup-row-details.component.scss']
})
export class BasicSetupRowDetailsComponent implements OnInit {
  @Output() update = new EventEmitter();
  @Input() rowItemData;
  @Output() private updatedDetails = new EventEmitter<any>();
  public examList: any;
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
    private restService: GlobalRestService
  ) { }
  applicableFeeFormGroup: FormGroup;
  ngOnInit() {

    this.applicableFeeFormGroup = new FormGroup({
      code: new FormControl(this.rowItemData.code, [Validators.required]),
      name: new FormControl(this.rowItemData.name, [Validators.required]),
      exam_guid: new FormControl(this.rowItemData.exam_guid, [Validators.required]),
      line_num: new FormControl(this.rowItemData.line_num, [Validators.required])
    });
    this.getExamData();
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
      this.applicableFeeFormGroup.controls.name.patchValue(examDetils[0].name);
      this.applicableFeeFormGroup.controls.code.patchValue(examDetils[0].code)
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