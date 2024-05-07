import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { count } from 'rxjs/operators';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-registration-exam-cities',
  templateUrl: './registration-exam-cities.component.html',
  styleUrls: ['./registration-exam-cities.component.scss']
})
export class RegistrationExamCitiesComponent implements OnInit {
  @Input() tabset: TabsetComponent;
  public headerName: any = {};
  public registrationGuid: any;
  public orginalItems = [];
  public items = [];
  public lastSeenIdMax = 0;
  public itemCount = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public notFound: boolean = false;
  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
    }, error => {
      console.error('Error: ', error);
    });
    this.getExamCityByGuid();
  }

  public getExamCityByGuid() {
    let keydata = [{
      name: "registrationGuid",
      value: this.registrationGuid
    }]
    this.restService.ApiEndPointUrlOrKey = Registrations.getExamCityListByRegGuid;
    this.restService.callApi(keydata).subscribe(successResponse => {
      let count=1;
      successResponse.city.forEach(element => {
        element['city_number']=count++;
      });
      this.items = Object.assign([], successResponse.city);
      this.orginalItems = Object.assign([], successResponse.city);
    }, errorResponse => {
      console.log(errorResponse);
    });
  }

  onExamCityFormSubmit() {
    if (this.orginalItems.length > 0 || this.items.length > 0) {
      this.addExamCity();

    }
  }
  addExamCity() {
    let params = this.getParams();
    let keydata = [{
      name: "registrationGuid",
      value: this.registrationGuid
    }];
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ApiEndPointUrlOrKey = Registrations.addExamCity;
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
  getParams() {

    let params = {
      "registration_guid": this.registrationGuid,
      "cities": this.items
    };
    return params;
  }
  getUpdatedDetails(updatedDetails: any) {
    if (updatedDetails) {
      let itemIndex = this.items.findIndex(i => i.city_number === updatedDetails.city_number);
      if (itemIndex > -1) {
        this.items[itemIndex] = updatedDetails;
      }
    }
  }


  onAddRow() {
    debugger
    if (this.items.length > 0) {
      let lastItem = this.items[this.items.length - 1];
      let item = {
        "city_number": this.items.length + 1,
        "guid": "",
        "state_guid": ""
      }
      this.items.push(item);
    }
    else {

      let item = {
        "city_number": 1,
        "guid": "",
        "state_guid": ""
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
        this.items[i].city_number === updatedItem.prodInfo.city_number
      ) {
        this.items[i] = updatedItem.prodInfo;
        break;
      }
    }
  }

}


