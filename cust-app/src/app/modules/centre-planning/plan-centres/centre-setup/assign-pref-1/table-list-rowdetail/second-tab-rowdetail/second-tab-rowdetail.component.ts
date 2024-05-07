import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre,
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

@Component({
  selector: "app-second-tab-rowdetail",
  templateUrl: "./second-tab-rowdetail.component.html",
  styleUrls: ["./second-tab-rowdetail.component.scss"],
})
export class SecondTabRowdetailComponent implements OnInit {
  @Output() update = new EventEmitter();
  @Output() private childComponentData = new EventEmitter<number>();
  @Input("rowItemData") rowItemData: any;
  @Input() optionId: any;

  // Child
  difficultyLevels: any;
  public childFromGroup: FormGroup;
  uomsList: any;
  selectedSubject: any;
  questionTypeList: any;
  sectionList: any;
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
  ) { }

  ngOnInit() {
    this.intialChildForm();
    this.setIntialdata();
    this.disableNonEditableControls();
  }

  setIntialdata() {

    this.childFromGroup.setValue({
      name: this.rowItemData["name"] || "",
      ph_female: this.rowItemData["ph_female"] || "",
      ph_others: this.rowItemData["ph_other"] || "",
      reserved_female: this.rowItemData["reserved_female"] || "",
      other_reserved: this.rowItemData["other_reserved"] || "",
      others_female: this.rowItemData["other_female"] || "",
      others: this.rowItemData["others"] || "",
      ph_seats: this.rowItemData["pwd_seats"] || "",
      normal_seats: this.rowItemData["normal_seats"] || "",
    });
    this.childFromGroup.get("name").disable();
    this.childFromGroup.controls["ph_female"].disable();
    this.childFromGroup.controls["ph_others"].disable();
    this.childFromGroup.controls["others_female"].disable();
    this.childFromGroup.controls["others"].disable();
    this.childFromGroup.controls["reserved_female"].disable();
    this.childFromGroup.controls["other_reserved"].disable();    
  }

  intialChildForm() {
    this.childFromGroup = new FormGroup({
      name: new FormControl("", Validators.required),
      ph_female: new FormControl("", [
        Validators.required, Validators.min(0),
        Validators.max(999),
      ]),
      ph_others: new FormControl("", [
        Validators.required, Validators.min(0),
        Validators.max(999),
      ]),
      reserved_female: new FormControl("", [
        Validators.required, Validators.min(0),
        Validators.max(999),
      ]),
      other_reserved: new FormControl("", [
        Validators.required, Validators.min(0),
        Validators.max(999),
      ]),            
      others_female: new FormControl("", [
        Validators.required, Validators.min(0),
        Validators.max(999),
      ]),
      ph_seats: new FormControl(""),
      normal_seats: new FormControl(""),
      others: new FormControl("", [Validators.required, Validators.min(0), Validators.max(999)])
    });
  }

  disableNonEditableControls() {
    if (this.optionId != 1) {      
      this.childFromGroup.controls["ph_seats"].disable();
      this.childFromGroup.controls["normal_seats"].disable();      
    }
  }

  onCancel() {
    this._item = this._itemOrig;
    const prodInfo = this._itemOrig;
    this.update.emit({ prodInfo, event });
  }

  sendToParent() {
    let form = document.getElementById("childFrom");
    if (this.childFromGroup.valid === false) {
      form.classList.add("was-validated");
    }
    else if (!this.checkForValidPHSeats()) {
      this.messageService.ok('Assigned ph seats are greater then total capacity');
    }
    else if (!this.checkForValidNormalSeats()) {
      this.messageService.ok('Assigned normal seats are greater then centre normal seats');
    }
    else if (!this.checkForTotalCapicity()) {
      this.messageService.ok('Assigned seats are greater than total capacity');
    }

    else if (this.childFromGroup.valid === true) {
      if (this.optionId == "1") {
        this.messageService
          .confirm(
            [
              "All the allocations will be invalidated by changing the seating capacity of the centre, Are you sure to change the seating capacity record?",
            ],
            "Alert",
            "Yes",
            "NO",
            "error"
          )
          .subscribe((result) => {
            if (result == true) {
              this.messageService.hideModal();
              let formdata = this.childFromGroup.getRawValue();
              formdata["centres_guid"] = this.rowItemData["centres_guid"];
              formdata["ph_female"] = formdata.ph_female;
              formdata["name"] = formdata.name;
              formdata["pwd_seats"] = this.rowItemData["pwd_seats"];
              formdata["address"] = this.rowItemData["address"];
              formdata["star_rating"] = this.rowItemData["star_rating"];
              formdata["ph_others"] = formdata.ph_others;
              formdata["reserved_female"] = formdata.reserved_female;
              formdata["other_reserved"] = formdata.other_reserved;
              formdata["others_female"] = formdata.others_female;
              formdata["others"] = formdata.others;
              formdata["shift_main_id"] = this.rowItemData["shift_main_id"];
              formdata['normal_seats'] = formdata.normal_seats;
              formdata['ph_seats'] = formdata.ph_seats;
              this.childComponentData.emit(formdata);
              return true;
            } else {
              this.messageService.hideModal();
            }
          });
      }
      else {
        let formdata = this.childFromGroup.getRawValue();
        formdata["centres_guid"] = this.rowItemData["centres_guid"];
        formdata["ph_female"] = formdata.ph_female;
        formdata["name"] = formdata.name;
        formdata["pwd_seats"] = this.rowItemData["pwd_seats"];
        formdata["address"] = this.rowItemData["address"];
        formdata["star_rating"] = this.rowItemData["star_rating"];
        formdata["ph_others"] = formdata.ph_others;
        formdata["reserved_female"] = formdata.reserved_female;
        formdata["other_reserved"] = formdata.other_reserved;
        formdata["others_female"] = formdata.others_female;
        formdata["others"] = formdata.others;
        formdata["shift_main_id"] = this.rowItemData["shift_main_id"];
        formdata['normal_seats'] = formdata.normal_seats;
        formdata['ph_seats'] = formdata.ph_seats;
        this.childComponentData.emit(formdata);
        return true;
      }
    }
  }

  checkForValidPHSeats() {

    let formdata = this.childFromGroup.getRawValue();
    let phFemale = +formdata.ph_female;
    let phOther = +formdata.ph_others;
    let totalCapacity = this.rowItemData["total_capacity"];
    if ((phFemale + phOther) <= totalCapacity) {
      return true;
    } else {
      return false;
    }
  }

  checkForTotalCapicity() {
    let formdata = this.childFromGroup.getRawValue();
    let phFemale = +formdata.ph_female;
    let phOther = +formdata.ph_others;
    let otherFemale = +formdata.others_female;
    let others = +formdata.others;
    let totalCapacity = this.rowItemData["total_capacity"];
    if ((phFemale + phOther + otherFemale + others) <= totalCapacity) {
      return true;
    } else {
      return false;
    }
  }

  checkForValidNormalSeats() {
    let formdata = this.childFromGroup.getRawValue();
    let otherFemale = +formdata.others_female;
    let others = +formdata.others;
    let totalNormalSeats = +this.rowItemData["normal_seats"];
    if ((otherFemale + others) <= totalNormalSeats) {
      return true;
    } else {
      return false;
    }
  }

}
