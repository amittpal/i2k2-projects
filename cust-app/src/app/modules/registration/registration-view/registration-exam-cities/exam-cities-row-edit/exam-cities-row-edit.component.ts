import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-exam-cities-row-edit',
  templateUrl: './exam-cities-row-edit.component.html',
  styleUrls: ['./exam-cities-row-edit.component.scss']
})
export class ExamCitiesRowEditComponent implements OnInit {
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
  public cityList = [];
  public stateList = [];

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
    if (this.rowItemData.state_guid) {
      this.getCityList(this.rowItemData.state_guid);
    }
    this.getStateList();
    this.regTypeFormGroup = new FormGroup({
      state_guid: new FormControl(this.rowItemData.state_guid),
      guid: new FormControl(this.rowItemData.guid),
      city_number: new FormControl(this.rowItemData.city_number)
    });
  }

  getCityList(stateGuid) {
    let keydata = [{
      name: "stateGuid",
      value: stateGuid
    }]
    this.restService.ApiEndPointUrlOrKey = Registrations.getCityList;
    this.restService.callApi(keydata).subscribe(successResponse => {
      this.cityList = successResponse.cities;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  onGetCityList(stateGuid) {
    this.getCityList(stateGuid)
  }
  getStateList() {
    this.restService.ApiEndPointUrlOrKey = Registrations.getStateList;
    this.restService.callApi().subscribe(successResponse => {
      this.stateList = successResponse.states;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  onApplicableFeesFormSubmit() {
    if (this.regTypeFormGroup.valid) {
      let formData = this.regTypeFormGroup.value;
      formData['name'] = this.cityList.filter(item => item.guid == formData.guid)[0].name;
      formData['state_name'] = this.stateList.filter(item => item.guid == formData.state_guid)[0].name;
      this.updatedDetails.emit(formData);
    }
  }


  onCancel() {
    this._item = this._itemOrig;
    const prodInfo = this._itemOrig;
    this.update.emit({ prodInfo, event });
  }
}
