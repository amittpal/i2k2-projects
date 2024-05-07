import { Component, OnInit, Input } from '@angular/core';
import { RegistrationsSetup, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-applicable-fees',
  templateUrl: './applicable-fees.component.html',
  styleUrls: ['./applicable-fees.component.scss']
})
export class ApplicableFeesComponent implements OnInit {
  @Input() tabset: TabsetComponent;
  public items = [];
  public lastSeenIdMax = 0;
  public itemCount = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public notFound: boolean = false;
  public feeSetupList: any;

  examGuid = "";

  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) {
    //this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
  }

  ngOnInit() {
    this.getFeeSetupMasterData();
    this.route.params.subscribe((params: Params) => {
      this.examGuid = params['id'];
      if (this.examGuid) {
        this.getData();
      }
    }, error => {
      console.error('Error: ', error);
    });
    // this.getFeeSetupData();
  }

  getData() {
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getApplicableFeesSetupList;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        
        if (sucessResponse.sections) {
          //this.items = sucessResponse.sections;

          if (sucessResponse.sections.length > 0) {

            sucessResponse.sections.map((element1, index1) => {
              element1.line_num = index1 + 1;
              for (let index = 0; index < this.feeSetupList.length; index++) {

                if (this.feeSetupList[index].guid === element1.level1) {
                  element1.level01 = this.feeSetupList[index].name
                }
                if (this.feeSetupList[index].guid === element1.level2) {
                  element1.level02 = this.feeSetupList[index].name
                }
                if (this.feeSetupList[index].guid === element1.level3) {
                  element1.level03 = this.feeSetupList[index].name
                }
              }

            });
            //this.items = this.items.map((e, index) => ({ "line_num": index + 1, ...e }))
            this.items = sucessResponse.sections;
          }
        }
      },
        errorResponse => {
          this.messageService.alert(errorResponse);
        });
  }

  getUpdatedDetails(updatedDetails: any) {
    if (updatedDetails) {
      this.feeSetupList.forEach(element => {
        if (element.guid === updatedDetails.level1) {
          updatedDetails.level01 = element.name
        }
        if (element.guid === updatedDetails.level2) {
          updatedDetails.level02 = element.name
        }
        if (element.guid === updatedDetails.level3) {
          updatedDetails.level03 = element.name
        }
      });
      let itemIndex = this.items.findIndex(i => i.line_num === updatedDetails.line_num);
      if (itemIndex > -1) {
        this.items[itemIndex] = updatedDetails;
      }
    }
  }

  applicableFeesFormSubmit() {
    let updatedArray = { feeSetupDetails: this.items.map(item => ({ "exam_guid": this.examGuid, ...item })) };
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      }
    ];
    //let checkIdExists=this.items.some(i=>i.id>0);

    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.updateFeesSetupList;
    this.restService.HttpPostParams = updatedArray;
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
          this.messageService.alert(errorResponse.httpErrorResponse);
          //this.messageService.alert(errorResponse);
        });
  }

  onDragged(dragEvent: any) {
    const [e, el] = dragEvent.args;
    // do something
  }
  onAddRow() {

    if (this.items.length > 0) {
      let lastItem = this.items[this.items.length - 1];
      let item = {
        //"id":0,
        "line_num": lastItem.line_num + 1,
        "level1": "",
        "level2": "",
        "level3": "",
        "amount": ""
      }
      this.items.push(item);
    }
    else {

      let item = {
        //"id":0,
        "line_num": 0,
        "level1": "",
        "level2": "",
        "level3": "",
        "amount": ""
      }
      this.items.push(item);
    }
  }
  onClearRow() {
    //console.log('working');
  }
  public deleteRow(value) {

    if (value.rowitem.id && value.rowitem.exam_guid) {
      this.messageService.confirm(["Are you sure you want to delete this applicable fee setup ?"],
        "Delete", "Yes", "NO", "error").subscribe(result => {
          if (result == true) {
            var keyData = [
              {
                "name": "examGuid",
                "value": value.rowitem.exam_guid
              }, {
                "name": "id",
                "value": value.rowitem.id
              }
            ];
            this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.deleteApplicableFeeSetup;
            this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
            this.restService.callApi(keyData)
              .subscribe(sucessResponse => {
                this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Ok').subscribe(result => {
                  if (result == true) { // OK = true for redirection
                    this.messageService.hideModal();
                    this.getData();
                  }
                  else { // NO/CANCEL = false
                    this.messageService.hideModal();
                    this.getData();
                  }
                });
              }, errorResponse => {
                if (errorResponse !== undefined) {
                  this.getData();
                  this.messageService.alert(errorResponse.httpErrorResponse);
                }
              });
          }
          else {
            this.getData();
            this.messageService.hideModal();
          }
        });
    }
    else {
      const rows = this.items.length;
      let i = 0;
      for (i; i < rows; i++) {
        if (this.items[i].line_num === value.rowitem.line_num) {
          this.items.splice(i, 1);
          break;
        } else {

        }
      }
    }
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