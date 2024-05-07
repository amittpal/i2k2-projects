import { Component, OnInit, Input, OnChanges, TemplateRef } from '@angular/core';
import { GlobalRestService } from "../../../../../services/rest/global-rest.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { PrimaryHeaderService } from "../../../../layout/primary-header/primary-header.service";
import { AppsettingsConfService } from "../../../../../services/conf/appsettings-conf/appsettings-conf.service";

import {
  Exam,
  Centre,
  HandelError,
} from "../../../../../shared/enumrations/app-enum.enumerations";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-snapshot-add',
  templateUrl: './snapshot-add.component.html',
  styleUrls: ['./snapshot-add.component.scss']
})
export class SnapshotAddComponent implements OnInit, OnChanges {

  public notFound: boolean = false;
  @Input() items = [];
  @Input() rowItemDetails: any;
  public displayMessage: any;
  public optionsList:any;
  public allocationId:any;
  public regGuid:any;
  private copySnapshotModalRef: BsModalRef;
  private copySnapshotForm: FormGroup;

  constructor(
    private restService: GlobalRestService,
    private messageService: MessageService,
    private configService: AppsettingsConfService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.setUpCopySnapshotForms();
  }

  ngOnChanges(){
    if (this.rowItemDetails || this.items.length > 0) {
      this.regGuid=this.rowItemDetails.guid;
      this.getExistedSnapshotList(this.rowItemDetails.guid)
    }
  }

  getExistedSnapshotList(guid) {
      let keyData = [
        {
          name: "regGuid",
          value: guid
        },
      ];

      this.restService.ApiEndPointUrlOrKey = Centre.getExistedSnapshotList;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;      
      this.restService.callApi(keyData).subscribe(
        (sucessResponse) => {
          this.items = sucessResponse.snap_shot;
        },
        (errorResponse) => {
          if (errorResponse !== undefined) {
            this.displayMessage =
              errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        }
      );
  }

  
//initializing Copy Sanpshot   
setUpCopySnapshotForms() {
  //setting add page form controls
  this.copySnapshotForm = new FormGroup({
    options: new FormControl('', Validators.required),
    code:new FormControl('',Validators.required),
    name:new FormControl('',Validators.required)
  });
}
  //Opening modal popup for Copy Snapshot
  openCopySnapshotModel(copySnaphotModalTemplate: TemplateRef<any>,id:any) {
    this.allocationId=id;
    this.getOptionsList(id);
    this.copySnapshotModalRef = this.modalService.show(copySnaphotModalTemplate);
  }

  getOptionsList(id:any) {
    let keyData = [
      {
        name: "snapshotId",
        value: id
      },
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getSnapshotOptionList;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;      
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        this.optionsList = sucessResponse.options;
        console.log(this.optionsList);
      },
      (errorResponse) => {
        if (errorResponse !== undefined) {
          this.displayMessage =
            errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      }
    );
}

private getParams() {
  let params = ({
    'id':this.copySnapshotForm.value.options,
    'snapshot_code':this.copySnapshotForm.value.code,
    'snapshot_name':this.copySnapshotForm.value.name
  });
   
  return params;
}

onCopySnapshotSubmit() {

    //setting section modal
    let keyData = [
      {
        name: "snapshotId",
        value: this.allocationId
      }
      
    ];
    let params=this.getParams();
    let form = document.getElementById('copySnapshot');
    if (this.copySnapshotForm.valid === false) {
      form.classList.add('was-validated');
    } else {
    this.restService.ApiEndPointUrlOrKey = Centre.copySnapshot;
    this.restService.HttpPostParams = params;
    this.restService.callApi(keyData).subscribe(successRespnse => {
      this.messageService.okRedirectModal(successRespnse, 'SUCCESS', 'Go to List').subscribe(result =>
        {
          if(result == true) {
            this.messageService.hideModal();
            this.getExistedSnapshotList(this.regGuid);
          } else {
            this.messageService.hideModal();
          }
        })
       
    },
    errorResponse => {
      this.messageService.alert(errorResponse.httpErrorResponse);
    })
    this.copySnapshotForm.reset();
    this.copySnapshotModalRef.hide();
  }
}

}
