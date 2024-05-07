import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Exam,
} from "src/app/shared/enumrations/app-enum.enumerations";
import { Centre } from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";
import { SharedService } from "../../service/shared.service";

@Component({
  selector: "shift-rowdetail",
  templateUrl: "./shift-rowdetails.component.html",
  styleUrls: ["./shift-rowdetails.component.scss"],
})
export class ShiftRowdetailComponent implements OnInit {
  @Output() private childComponentData = new EventEmitter<number>();
  @Input("examGuid") examGuid: string;
  @Input("regGuid") regGuid: string;
  
  @Input() snapShotId: any; // get Snapshot id from parent component
  @Input("rowItemData") rowItemData: any;
  @Input("visibilty") showdistribution: any;
  // @Input('disableApprovar') disableApprovar: any;
  // @Input('disableReviewer') disableReviewer: any;
  // @Input('disableAuthor') disableAuthor: any;

  @Output() update = new EventEmitter();
  // Child
  difficultyLevels: any;
  public childFromGroup: FormGroup;
  uomsList: any; //del it
  selectedSubject: any; //del it
  questionTypeList: any; //del it
  sectionList: any; //del it
  _item: any;
  _itemOrig: any;
  languageList: any;
  minDate: any;
  shift:any;

  public rowData: any = {
    id: "",
    exam_guid: "",
    exam_date: "",
    exam_reporting_time: "",
    exam_start_time: "",
    exam_end_time: "",
    shift_number: "",
    status: "",
    distribution: "",
  };
  hours = Array.from({ length: 13 }, (_, i) => {
    if (i < 10) {
      return `0${i}`;
    }
    return `${i}`;
  });

  minutes = Array.from({ length: 60 }, (_, i) => {
    if (i < 10) {
      return `0${i}`;
    }
    return `${i}`;
  });
  selectedDays: any = [];
  validDays: string = "";

  @Input() get item() {
    return this._item;
  }
  set item(item: any) {
    this._itemOrig = Object.assign({}, item);
    this._item = item;
  }

  constructor(
    private messageService: MessageService,
    private restService: GlobalRestService,
    private SharedService: SharedService
  ) {}

  ngOnInit() {
    this.getIntialData();
    this.intialChildForm();
    this.setIntialdata();
  }

  getIntialData() {
    this.shift = this.rowItemData["shifts"];
    this.minDate = new Date().toJSON().slice(0, 10);

    let keyData = [
      {
        name: "regGuid",
        value: this.regGuid
      },
      {
        name: "id",
        value: this.snapShotId
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getSnapshotInfo;
    this.restService.callApi(keyData).subscribe(
      (successResponse) => {
        this.selectedDays = successResponse["snapshot_info"].days;
        this.getUserSelectedDays();
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );

  }

  spiltTime(data: any) {
    let hour = data.split(":");
    let minute = hour[1].split(" ");
    return [hour[0], minute[0], minute[1]];
  }

  setIntialdata() {    
    if (this.rowItemData["exam_reporting_time"].length > 0) {
      let srt = [];
      let sst = [];
      let set = [];
      srt = this.spiltTime(this.rowItemData["exam_reporting_time"]);
      sst = this.spiltTime(this.rowItemData["exam_start_time"]);
      set = this.spiltTime(this.rowItemData["exam_end_time"]);

      this.childFromGroup.patchValue({
        exam_date: this.rowItemData["exam_date"],
        sst_hour: sst[0],
        sst_minute: sst[1],
        sst_ums: sst[2],
        set_hour: set[0],
        set_minute: set[1],
        set_ums: set[2],
        srt_hour: srt[0],
        srt_minute: srt[1],
        srt_ums: srt[2],
        distribution: this.rowItemData["reg_distributions"],
      });
    }
  }

  intialChildForm() {
    if (this.showdistribution) {
      this.childFromGroup = new FormGroup({
        exam_date: new FormControl({ value: '', disabled: true }, Validators.required),
        sst_hour: new FormControl({ value: '', disabled: true }, Validators.required),
        sst_minute: new FormControl({ value: '', disabled: true }, Validators.required),
        sst_ums: new FormControl({ value: '', disabled: true }, Validators.required),
        set_hour: new FormControl({ value: '', disabled: true }, Validators.required),
        set_minute: new FormControl({ value: '', disabled: true }, Validators.required),
        set_ums: new FormControl({ value: '', disabled: true }, Validators.required),
        srt_hour: new FormControl({ value: '', disabled: true }, Validators.required),
        srt_minute: new FormControl({ value: '', disabled: true }, Validators.required),
        srt_ums: new FormControl({ value: '', disabled: true }, Validators.required),

        distribution: new FormControl({ value: '', disabled: true }, Validators.required),
      });
    } else {
      this.childFromGroup = new FormGroup({
        exam_date: new FormControl({ value: '', disabled: true }, Validators.required),
        sst_hour: new FormControl({ value: '', disabled: true }, Validators.required),
        sst_minute: new FormControl({ value: '', disabled: true }, Validators.required),
        sst_ums: new FormControl({ value: '', disabled: true }, Validators.required),
        set_hour: new FormControl({ value: '', disabled: true }, Validators.required),
        set_minute: new FormControl({ value: '', disabled: true }, Validators.required),
        set_ums: new FormControl({ value: '', disabled: true }, Validators.required),
        srt_hour: new FormControl({ value: '', disabled: true }, Validators.required),
        srt_minute: new FormControl({ value: '', disabled: true }, Validators.required),
        srt_ums: new FormControl({ value: '', disabled: true }, Validators.required),
      });
    }
  }

  convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };

  comparetime(timeA: any, timeB: any) {
    var time1Date = new Date("01/01/2000 " + timeA);
    var time2Date = new Date("01/01/2000 " + timeB);

    if (time1Date >= time2Date) {
      return 1;
    } else {
      return 0;
    }
  }

  getUserSelectedDays() {
    var days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    this.selectedDays.forEach((a,i) => {
      this.validDays += (i > 0 ? ',' : ' ') + days[a.days_number];
    });
  }

  validateDate(arg0: any) {
    let getdate = new Date(arg0);
    let inputDay = this.getDay(getdate);
    let res = Boolean(this.selectedDays.find((a) => a.days_number == inputDay));
    if (res) {
      return 0;
    } else {
      return 1;
    }
  }

  getDay(arg: Date) {
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let inputDate = arg.toString().slice(0, 3);
    const res = days.findIndex((a) => a === inputDate);
    return res;
  }

}
