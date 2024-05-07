import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";

@Component({
  selector: 'app-centre-edit-rowdetails',
  templateUrl: './centre-edit-rowdetails.component.html',
  styleUrls: ['./centre-edit-rowdetails.component.scss']
})
export class CentreEditRowdetailsComponent implements OnInit {
  @Output() private childComponentData = new EventEmitter<number>();
  @Input("examId") examId: string;
  @Input("rowItemData") rowItemData: any;
  @Input("disabledNormalSeat") disabledNormalSeat: any;
  @Input("disabledPwdSeat") disabledQuestionType: any;
  @Output() update = new EventEmitter();

  
  public childFromGroup: FormGroup;
 // Child
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
    private messageService: MessageService,
    private restService: GlobalRestService
  ) {
    // this._checkSubTree = true;
  }


  ngOnInit() {
    this.setIntialdata();
  }

  setIntialdata() {    
    this.intialChildForm();
    this.childFromGroup.patchValue({ 
      normal_seats: this.rowItemData["normal_seats"] || "",
      pwd_seats: this.rowItemData["pwd_seats"],
    });
  }

  intialChildForm() {

      this.childFromGroup = new FormGroup({
        normal_seats: new FormControl("", [Validators.required, Validators.max(999)]),
        pwd_seats: new FormControl("", [Validators.required,Validators.max(999),
        ]),
      });
    
  }

  onCancel() {
    this._item = this._itemOrig;
    const prodInfo = this._itemOrig;
    this.update.emit({ prodInfo, event });
  }

  sendToParent() {
     if (this.childFromGroup.valid === false) {
      let form = document.getElementById("childFrom");
      form.classList.add("was-validated");
    } else if (this.childFromGroup.valid === true) {
      let formdata = this.childFromGroup.getRawValue();
      formdata["id"]=this.rowItemData["id"];
      formdata["code"]=this.rowItemData["code"];
      formdata["name"]=this.rowItemData["name"];
      formdata["city_name"]=this.rowItemData["city_name"];
      formdata["state_name"]=this.rowItemData["state_name"];
      formdata["address"]=this.rowItemData["address"];
      formdata["total_seats"]=this.rowItemData["total_seats"];
      this.childComponentData.emit(formdata);
      return true;
    }
  }
}

