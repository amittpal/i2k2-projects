import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { RegistrationsSetup } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-reg-applicable-fees-list',
  templateUrl: './reg-applicable-fees-list.component.html',
  styleUrls: ['./reg-applicable-fees-list.component.scss']
})
export class RegApplicableFeesListComponent implements OnInit {
  public registrationGuid: any;
  @Input() dataItems;
  public orginalItems = [];
  public feeSetupList = [];
  public items: Array<any> = new Array<any>();
  public lastSeenIdMax = 0;
  public itemCount = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public notFound: boolean = false;
  @Output() private updatedParantDetails = new EventEmitter<any>();

  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
    }, error => {
      console.error('Error: ', error);
    });
    this.getFeeSetupMasterData();
    this.items = [];
    this.items = Object.assign([], this.dataItems.fee_setup_details);
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
  public getFeeSetupMasterData() {
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getFeeSetupMasterList;
    this.restService.callApi().subscribe(successResponse => {
      this.feeSetupList = successResponse.fee_setup_details;
      if (this.dataItems.fee_setup_details) {
        if (this.dataItems.fee_setup_details.length > 0) {
          let count = 0
          this.dataItems.fee_setup_details.forEach(element1 => {
            this.feeSetupList.forEach(element => {
              if (element.guid === element1.level1) {
                element1.level01 = element.name
              }
              if (element.guid === element1.level2) {
                element1.level02 = element.name
              }
              if (element.guid === element1.level3) {
                element1.level03 = element.name
              }
            });
            element1['line_num'] = ++count;
            let itemIndex = this.items.findIndex(i => i.line_num === element1.line_num);
            if (itemIndex > -1) {
              this.orginalItems[itemIndex] = element1;
              this.items[itemIndex] = element1;
            }
          });
        }
      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
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
    let param = {
      "exam_guid": this.dataItems.exam_guid ? this.dataItems.exam_guid : '',
      "exam_name": this.dataItems.exam_name ? this.dataItems.exam_name : '',
      "code": this.dataItems.code,
      "name": this.dataItems.name,
      "guid": this.dataItems.guid,
      "reg_type": this.dataItems.reg_type,
      "reg_type_guid": this.dataItems.reg_type_guid ? this.dataItems.reg_type_guid : '',
      "reg_type_name": this.dataItems.reg_type_name ? this.dataItems.reg_type_name : '',
      "fee_setup_details": this.items
    }
    this.updatedParantDetails.emit(param);

  }

  onDragged(dragEvent: any) {
    const [e, el] = dragEvent.args;
    // do something
  }
  onAddRow() {

    if (this.items.length > 0) {
      let lastItem = this.items[this.items.length - 1];
      let item = {
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
        "line_num": 1,
        "level1": "",
        "level2": "",
        "level3": "",
        "amount": ""
      }
      this.items.push(item);
    }
  }

  public deleteRow(value) {

    this.messageService.confirm(["Are you sure you want to delete this applicable fee setup ?"],
      "Delete", "Yes", "NO", "error").subscribe(result => {
        if (result == true) {
          this.messageService.hideModal();
          const rows = this.items.length;
          let i = 0;
          for (i; i < rows; i++) {
            if (!this.items[i].exam_guid) {
              this.items.splice(i, 1);
              let param = {
                "exam_guid": this.dataItems.exam_guid ? this.dataItems.exam_guid : '',
                "exam_name": this.dataItems.exam_name ? this.dataItems.exam_name : '',
                "code": this.dataItems.code,
                "name": this.dataItems.name,
                "guid": this.dataItems.guid,
                "reg_type": this.dataItems.reg_type, "fee_setup_details": this.items
              }
              this.updatedParantDetails.emit(param);
              break;
            }
          }
        }
        else {
          this.items = this.orginalItems;
          let param = {
            "code": this.dataItems.code,
            "name": this.dataItems.name,
            "guid": this.dataItems.guid,
            "reg_type": this.dataItems.reg_type,
            "reg_type_guid": this.dataItems.reg_type_guid ? this.dataItems.reg_type_guid : '',
            "reg_type_name": this.dataItems.reg_type_name ? this.dataItems.reg_type_name : '',
            "fee_setup_details": this.items
          }
          this.updatedParantDetails.emit(param);
          this.messageService.hideModal();
        }
      });

  }
}


