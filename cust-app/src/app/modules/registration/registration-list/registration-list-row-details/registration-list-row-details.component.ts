import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-registration-list-row-details',
  templateUrl: './registration-list-row-details.component.html',
  styleUrls: ['./registration-list-row-details.component.scss']
})
export class RegistrationListRowDetailsComponent implements OnInit {
  @Input("rowItemData") rowItemData: any;
  @Output() private childComponentData = new EventEmitter<number>();
  public items = [];
  public paymentGatewayItems = [];
  public itemCount = 0;

  private appRoutes: any = {};

  constructor(
    private restService: GlobalRestService,
    private configService: AppsettingsConfService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(
      configData => {
        this.appRoutes = configData;
      },
      error => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
  }
  ngOnInit() {

    this.getExamListByRegistrationId();
    this.getPaymentGatewayListByRegistrationId();
  }

  getExamListByRegistrationId() {
    let keyData = [
      {
        "name": "registrationGuid",
        "value": this.rowItemData.guid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registrations.getExamListByRegistrationGuid;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(successResponse => {
      let count = 0
      if (successResponse.exams)
        successResponse.exams.forEach(element => {
          element['exam_number'] = ++count;
        });
        this.items = successResponse.exams;

    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  getPaymentGatewayListByRegistrationId() {
    let keyData = [
      {
        "name": "registrationGuid",
        "value": this.rowItemData.guid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registrations.getPaymentGatewayList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndKill;
    this.restService.callApi(keyData).subscribe(successResponse => {
      
      this.paymentGatewayItems = successResponse.payment_gateways;
      this.paymentGatewayItems.forEach((item,index) => {
        this.paymentGatewayItems[index]["production_gateway_text"] = this.paymentGatewayItems[index]["production_gateway"] == "0" ? "NO" : this.paymentGatewayItems[index]["production_gateway"] == "1" ? "YES" : "";
      })

    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }


  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  changeStatus(status,id){
    let keyData = [
      {
        "name": "registrationGuid",
        "value": this.rowItemData.guid
      },
      {
        "name": "statusCode",
        "value": status
      },
      {
        "name": "id",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registrations.changeRegistrationPaymentGatewayStatus;
    this.restService.ApiEndPointMehod = RestMethods.Put;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.messageService.okRedirectModal(successResponse, 'SUCCESS', 'OK').subscribe(result => {
          if (result == true) { // OK = true for redirection
            this.messageService.hideModal();
            this.getPaymentGatewayListByRegistrationId();
            if (status == "FINALIZED"){
              this.childComponentData.emit();
            }
          }
          else { // NO/CANCEL = false
            this.messageService.hideModal();
          }
        });
    },
      (errorResponse) => {
        if (errorResponse !== undefined) {
          this.messageService.alert(errorResponse.httpErrorResponse);
        }
      }
    );
  }

}

