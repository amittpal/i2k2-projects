import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  Exam,
} from "src/app/shared/enumrations/app-enum.enumerations";

@Component({
  selector: 'app-centre-edit-rowdetails-view',
  templateUrl: './centre-edit-rowdetails-view.component.html',
  styleUrls: ['./centre-edit-rowdetails-view.component.scss']
})
export class CentreEditRowdetailsViewComponent implements OnInit {

  @Output() private childComponentData = new EventEmitter<number>();
  @Input("examId") examId: string;
  @Input("rowItemData") rowItemData: any;

  @Output() update = new EventEmitter();
  // Child  
  public childFromGroup: FormGroup;

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
      phseats: this.rowItemData["total_ph_seats"] || "",
      normalseats: this.rowItemData["total_normal_seats"] || "",
      totalseats: this.rowItemData["total_seats"] || "",
      allowed_ph_capacity_per: this.rowItemData["allowed_ph_capacity_per"] || "",
      allowed_normal_capacity_per: this.rowItemData["allowed_normal_capacity_per"] || "",
      allowed_ph_capacity: this.rowItemData["pwd_seats"] || "",
      allowed_normal_capacity: this.rowItemData["normal_seats"] || "",
      total_allowed_capacity: this.rowItemData["total_allowed_capacity"] || "",
    });
  }

  intialChildForm() {
    this.childFromGroup = new FormGroup({
      phseats: new FormControl({ value: '', disabled: true }),
      normalseats: new FormControl({ value: '', disabled: true }),
      totalseats: new FormControl({ value: '', disabled: true }),
      allowed_ph_capacity_per: new FormControl({ value: '', disabled: true }),
      allowed_normal_capacity_per: new FormControl({ value: '', disabled: true }),
      allowed_ph_capacity: new FormControl({ value: '', disabled: true }),
      allowed_normal_capacity: new FormControl({ value: '', disabled: true }),
      total_allowed_capacity: new FormControl({ value: '', disabled: true })
    });
  }

  onCancel() {
    this._item = this._itemOrig;
    const centreInfo = this._itemOrig;
    this.update.emit({ centreInfo, event });
  }

  sendToParent() {
    if (this.childFromGroup.valid === false) {
      let form = document.getElementById("childFrom");
      form.classList.add("was-validated");
    } else if (this.childFromGroup.valid === true) {
      let formdata = this.childFromGroup.getRawValue();

      formdata["id"] = this.rowItemData["id"];
      formdata["state_name"] = this.rowItemData["state_name"];
      formdata["city_name"] = this.rowItemData["city_name"];
      formdata["code"] = this.rowItemData["code"];
      formdata["name"] = this.rowItemData["name"];
      formdata["address"] = this.rowItemData["address"];
      formdata["total_ph_seats"] = this.rowItemData["total_ph_seats"];
      formdata["total_normal_seats"] = this.rowItemData["total_normal_seats"];
      formdata["total_seats"] = this.rowItemData["total_seats"];
      formdata["allowed_ph_capacity_per"] = formdata.allowed_ph_capacity_per;
      formdata["allowed_normal_capacity_per"] = formdata.allowed_normal_capacity_per;

      formdata["pwd_seats"] = Math.floor(Number(this.rowItemData["total_ph_seats"]) * Number(formdata.allowed_ph_capacity_per) * 0.01);
      formdata["normal_seats"] = Math.floor(Number(this.rowItemData["total_normal_seats"]) * Number(formdata.allowed_normal_capacity_per) * 0.01);
      formdata["total_allowed_capacity"] = Number(formdata["pwd_seats"]) + Number(formdata["normal_seats"]);

      this.childComponentData.emit(formdata);
      return true;
    }
  }

}
