import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-reg-types',
  templateUrl: './reg-types.component.html',
  styleUrls: ['./reg-types.component.scss']
})
export class RegTypesComponent implements OnInit {
  @Input() tabset: TabsetComponent;
  public regTypeFormGroup: FormGroup;
  public headerName: any = {};
  public regTypeList = [];
  public registrationGuid: any;
  public orginalItems = [];
  public isDisable: boolean = false;
  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }
  ngOnInit() {
    this.initializeFormFields();
    this.getRegTypeList();
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
    }, error => {
      console.error('Error: ', error);
    });
    this.getRegTypeByGuid();
  }

  initializeFormFields() {
    this.regTypeFormGroup = new FormGroup({
      reg_list_guid: new FormControl('', [Validators.required]),
    });

  }
  public getRegTypeByGuid() {
    let keydata = [{
      name: "registrationGuid",
      value: this.registrationGuid
    }]
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegTypeByGuid;
    this.restService.callApi(keydata).subscribe(successResponse => {
      if (successResponse.plan_status_code == 'InProgress') {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
      if (successResponse.reg_list_guid) {
        this.regTypeFormGroup.controls.reg_list_guid.patchValue(successResponse.reg_list_guid);
        this.regTypeList.filter(item => {
          if (item.guid === successResponse.reg_list_guid) {
            this.headerName = item.name;
          }
        });
      } let count = 0
      if (successResponse.reg_types) {
        this.orginalItems = [];
        this.items = [];
        this.orginalItems = successResponse.reg_types;
        successResponse.reg_types.forEach(element => {
          element['line_num'] = ++count;
          this.items.push(Object.assign({}, element));
        });
      }
    }, errorResponse => {
      console.log(errorResponse);
    });
  }
  public getRegTypeList() {
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegTypeList;
    this.restService.callApi().subscribe(successResponse => {
      this.regTypeList = successResponse.reg_types;
      if (this.regTypeList) {
        this.regTypeFormGroup.controls.reg_list_guid.patchValue(this.regTypeList[0].guid)
        this.headerName = Object.assign([], [this.regTypeList[0]])[0].name;
      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  onChangeTypeList(listTypeguid) {
    this.items = [];
    this.headerName = this.regTypeList.filter(item => item.guid == listTypeguid)[0].name;

    let keydata = [{
      name: "registrationsGuid",
      value: this.registrationGuid
    },
    {
      name: "regListTypeGuid",
      value: listTypeguid
    }]
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegTypeByRegGuid;
    this.restService.callApi(keydata).subscribe(successResponse => {
      let count = 0
      if (successResponse.reg_types) {
        this.orginalItems = [];
        this.items = [];
        this.orginalItems = successResponse.reg_types;
        successResponse.reg_types.forEach(element => {
          element['line_num'] = ++count;
          this.items.push(Object.assign({}, element));
        });
      }
    }, errorResponse => {
      console.log(errorResponse);
    })
  }
  onRegTypeFormSubmit() {
    if (this.regTypeFormGroup.valid === false) {
      let form = document.getElementById("regTypeFormGroup");
      form.classList.add("was-validated");
    } else if (this.regTypeFormGroup.valid) {
      if (this.orginalItems.length > 0) {
        this.updateRgeType();
      } else {
        this.addRgeType();

      }
    }
  }
  addRgeType() {
    let params = this.getParams();
    let keydata = [{
      name: "registrationGuid",
      value: this.registrationGuid
    }];
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ApiEndPointUrlOrKey = Registrations.addRegType;
    this.restService.ShowLoadingSpinner = true;
    this.restService.HttpPostParams = params;
    this.restService.callApi(keydata)
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            this.tabset.tabs[2].active = true;
          }
          else {
            this.messageService.hideModal();
          }
        });
      },
        errorResponse => {
          // this.messageService.alert(errorResponse);
        });

  }
  updateRgeType() {
    let params = this.getParams();
    let keydata = [{
      name: "registrationGuid",
      value: this.registrationGuid
    }];
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ApiEndPointUrlOrKey = Registrations.updateRegType;
    this.restService.ShowLoadingSpinner = true;
    this.restService.HttpPostParams = params;
    this.restService.callApi(keydata)
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            this.getRegTypeByGuid();
            this.tabset.tabs[2].active = true;
          }
          else {
            this.messageService.hideModal();
          }
        });
      },
        errorResponse => {
          // this.messageService.alert(errorResponse);
        });

  }
  getParams() {

    let params = {
      "reg_list_guid": this.regTypeFormGroup.value.reg_list_guid,
      "reg_types": this.items
    };
    return params;
  }
  public items = [];
  public lastSeenIdMax = 0;
  public itemCount = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public notFound: boolean = false;

  getUpdatedDetails(updatedDetails: any) {
    if (updatedDetails) {
      let itemIndex = this.items.findIndex(i => i.line_num === updatedDetails.line_num);
      if (itemIndex > -1) {
        this.items[itemIndex] = updatedDetails;
      }
    }
  }

  onAddRow() {
    if (this.items.length > 0) {
      let lastItem = this.items[this.items.length - 1];
      let item = {
        "line_num": lastItem.line_num + 1,
        "code": "",
        "name": "",
        "registration_guid": this.registrationGuid,
      }
      this.items.push(item);
    }
    else {

      let item = {
        "line_num": 1,
        "code": "",
        "name": "",
        "registration_guid": this.registrationGuid,
      }
      this.items.push(item);
    }
  }
  onClearRow() {
    this.items = [];
    this.items = Object.assign([], this.orginalItems);
  }
  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }
  public updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (
        this.items[i].line_num === updatedItem.prodInfo.line_num
      ) {
        this.items[i] = updatedItem.prodInfo;
        break;
      }
    }
  }

}

