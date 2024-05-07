import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-reg-type-mapping',
  templateUrl: './reg-type-mapping.component.html',
  styleUrls: ['./reg-type-mapping.component.scss']
})
export class RegTypeMappingComponent implements OnInit {
  @Input() tabset: TabsetComponent;
  public registrationSetupDetails: any = {};
  public regTypeList = [];
  public registrationGuid: any;
  public exam_to_reg_types: any;
  public items = [];
  public itemCount = 0;
  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
    }, error => {
      console.error('Error: ', error);
    });
    this.getExamListByRegistrationId();
    this.getRegTypeMappingListByGuid();
  }

  getUpdatedDetails(updatedDetails: any) {
    
    if (updatedDetails) {
      let itemIndex = this.items.findIndex(i => i.line_num === updatedDetails.line_num);
      if (itemIndex > -1) {
        updatedDetails.reg_type = updatedDetails.reg_types.map(ragTypeName => ragTypeName.name).toString();
        this.items[itemIndex] = updatedDetails;
      }
    }
  }
  getRegTypeMappingListByGuid() {
    let keyData = [
      {
        "name": "registrationGuid",
        "value": this.registrationGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegTypeMappingListByGuid;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(successResponse => {
      let count = 0
      if (successResponse.exam_to_reg_types) {
        successResponse.exam_to_reg_types.forEach(element => {
          element['line_num'] = ++count;
          element.reg_type = element.reg_types.map(ragTypeName => ragTypeName.name).toString();
        });
        this.exam_to_reg_types = successResponse.exam_to_reg_types
        this.items = successResponse.exam_to_reg_types;
      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  getExamListByRegistrationId() {
    let keyData = [
      {
        "name": "registrationGuid",
        "value": this.registrationGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registrations.getExamListByRegistrationGuid;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(successResponse => {
      let count = 0
      if (successResponse.exams)
        successResponse.exams.forEach(element => {
          element['line_num'] = ++count;
        });
      this.items = successResponse.exams;

    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  public getRegTypeList() {
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegTypeList;
    this.restService.callApi().subscribe(successResponse => {
      this.regTypeList = successResponse.reg_types;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  onRegeTypeSetupFormSubmit() {
    let isRegType: boolean;
    this.items.forEach(element => {
      if (element.reg_types) {
        isRegType = true;
        return;
      } else {
        isRegType = false;
        return;
      }
    });

    if (this.items.length && isRegType == true) {
      let params = this.getParams();
      let keyData = [
        {
          "name": "registrationGuid",
          "value": this.registrationGuid
        }
      ];
      if (this.exam_to_reg_types) {
        this.restService.ApiEndPointUrlOrKey = Registrations.updateRegTypeMapping;
        this.restService.ShowLoadingSpinner = true;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.HttpPostParams = params;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.tabset.tabs[3].active = true;
              }
              else {
                this.messageService.hideModal();
              }
            });
          },
            errorResponse => {
              this.messageService.alert(errorResponse);
            });

      } else {
        this.restService.ApiEndPointUrlOrKey = Registrations.addRegTypeMapping;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.ShowLoadingSpinner = true;
        this.restService.HttpPostParams = params;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.tabset.tabs[3].active = true;
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


    } else {
      this.messageService.ok("Please select reg type.");
    }
  }
  getParams() {

    let params = {
      "registration_guid": this.registrationGuid,
      "exam_to_reg_types": this.items
    };
    return params;
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

