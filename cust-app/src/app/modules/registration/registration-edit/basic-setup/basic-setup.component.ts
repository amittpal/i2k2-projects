import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-basic-setup',
  templateUrl: './basic-setup.component.html',
  styleUrls: ['./basic-setup.component.scss']
})
export class BasicSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  public basicSetupFormGroup: FormGroup;
  public orginalItems = [];
  public regBasicsetupDetails: any;
  public isDisable: boolean = false;
  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.initializeFormFields();
    this.route.params.subscribe((params: Params) => {
      this.getData(params['registrationGuid']);
    }, error => {
      console.error('Error: ', error);
    });
  }
  getData(registrationGuid) {
    let keyData = [{
      name: 'registrationGuid',
      value: registrationGuid
    }]
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegBasicSetupDetailsByRegGuid;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.regBasicsetupDetails = successResponse;
      this.orginalItems = successResponse.exams;
      let count = 0
      if (successResponse.exams)
        successResponse.exams.forEach(element => {
          element['line_num'] = ++count;
          this.items.push(element);
        });
        if (successResponse.plan_status_code == 'InProgress') {
          this.isDisable = false;
        } else {
          this.isDisable = true;
        }
      this.setupInitializeFormFields(successResponse);
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  setupInitializeFormFields(regBasicsetupDetails) {
    if (regBasicsetupDetails.plan_status_code == 'InProgress') {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
    this.basicSetupFormGroup = new FormGroup({
      guid: new FormControl(regBasicsetupDetails.guid, [Validators.required]),
      status: new FormControl(regBasicsetupDetails.status, [Validators.required]),
      code: new FormControl(regBasicsetupDetails.code, [Validators.required]),
      name: new FormControl(regBasicsetupDetails.name, [Validators.required]),
      registration_start_date: new FormControl(regBasicsetupDetails.registrations_setup_details.registration_start_date, Validators.required),
      registration_end_date: new FormControl(regBasicsetupDetails.registrations_setup_details.registration_end_date, Validators.required),
      fee_end_date: new FormControl(regBasicsetupDetails.registrations_setup_details.fee_end_date, Validators.required),
      required_payment: new FormControl(regBasicsetupDetails.registrations_setup_details.required_payment, Validators.required),
      url: new FormControl(regBasicsetupDetails.registrations_setup_details.url, [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')])
    });

  }
  initializeFormFields() {
    this.basicSetupFormGroup = new FormGroup({
      guid: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      registration_start_date: new FormControl('', Validators.required),
      registration_end_date: new FormControl('', Validators.required),
      fee_end_date: new FormControl('', Validators.required),
      required_payment: new FormControl('', Validators.required),
      url: new FormControl('', [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')])
    });

  }


  onBasicSetupFormSubmit() {
    if (this.basicSetupFormGroup.valid === false) {
      let form = document.getElementById("basicSetupFormGroup");
      form.classList.add("was-validated");
    } else if (this.items.length == 0) {
      this.messageService.ok("Please add atleast on exam.");
      return false;

    } else if (this.basicSetupFormGroup.valid) {
      let params = this.getParams();
      let keyData = [{
        name: 'registrationGuid',
        value: this.basicSetupFormGroup.value.guid
      }]
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.ApiEndPointUrlOrKey = Registrations.updateRegBasicSetupDetails;
      this.restService.ShowLoadingSpinner = true;
      this.restService.HttpPostParams = params;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              this.tabset.tabs[1].active = true;
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
  }
  getParams() {
    let params = {
      "guid": this.basicSetupFormGroup.get("guid").value,
      "code": this.basicSetupFormGroup.get("code").value,
      "name": this.basicSetupFormGroup.get("name").value,
      "status": this.basicSetupFormGroup.get("status").value,
      registrations_setup_details:
      {
        "required_payment": this.basicSetupFormGroup.get("required_payment").value,
        "registration_start_date": this.basicSetupFormGroup.get("registration_start_date").value,
        "registration_end_date": this.basicSetupFormGroup.get("registration_end_date").value,
        "fee_end_date": this.basicSetupFormGroup.get("fee_end_date").value,
        "url": this.basicSetupFormGroup.get("url").value
      },
      exams: this.items

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
        "exam_guid": "",
      }
      this.items.push(item);
    }
    else {
      let item = {
        "line_num": 1,
        "code": "",
        "name": "",
        "exam_guid": "",
      }
      this.items.push(item);
    }
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
  onClearRow() {
    this.items = [];
    this.items = Object.assign([], this.orginalItems);
  }


}

