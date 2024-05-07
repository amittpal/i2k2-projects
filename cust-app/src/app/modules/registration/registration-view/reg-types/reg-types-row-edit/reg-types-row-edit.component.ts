import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-reg-types-row-edit',
  templateUrl: './reg-types-row-edit.component.html',
  styleUrls: ['./reg-types-row-edit.component.scss']
})
export class RegTypesRowEditComponent implements OnInit {

  public registrationGuid: any;
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
    private restService: GlobalRestService, private route: ActivatedRoute
  ) { }
  regTypeFormGroup: FormGroup;
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
    }, error => {
      console.error('Error: ', error);
    });
    this.regTypeFormGroup = new FormGroup({
      code: new FormControl(this.rowItemData.code, [Validators.required]),
      name: new FormControl(this.rowItemData.name, [Validators.required]),
      registration_guid: new FormControl(this.registrationGuid),
      line_num: new FormControl(this.rowItemData.line_num)
    });
  }

  onApplicableFeesFormSubmit() {
    if (this.regTypeFormGroup.valid) {
      let formData = this.regTypeFormGroup.value;
      this.updatedDetails.emit(formData);
    }
  }


  onCancel() {
    this._item = this._itemOrig;
    const prodInfo = this._itemOrig;
    this.update.emit({ prodInfo, event });
  }
}