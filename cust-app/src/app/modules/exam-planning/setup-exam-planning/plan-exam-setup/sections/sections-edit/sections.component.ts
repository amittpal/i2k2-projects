import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { Router } from "@angular/router";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Exam,
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";
import { SharedService } from "../../service/shared.service";
import { Subscription } from "rxjs";

import { SectionsRowClass } from "src/app/shared/classes/sections-row.class";
@Component({
  selector: "app-sections",
  templateUrl: "./sections.component.html",
  styleUrls: ["./sections.component.scss"],
})
export class SectionsComponent implements OnInit {
  @Output() private nextTab = new EventEmitter<number>(); // Sends tab id to parent component
  public items = [];
  public lastSeenIdMax = 0;
  public itemCount = 0;
  uomsList: any;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public notFound: boolean = false;
  subjectName: any;
  difficultyLevelName: any;
  uomsName: any;
  public addSectionsFormGroup: FormGroup;
  private appRoutes: any = {};
  statesList: any;
  cityList: any;
  centreTypeList: any;
  examId: any;
  Id: any;
  showDropDown = false;
  selectedSubject: any;
  difficultyLevels: any;
  sectionList: any;
  totalQuestion: any;
  emailIdSub: Subscription;
  IdSub: Subscription;
  sectionIdSub: Subscription;
  public tableData: any = {
    table_Id: "",
    subject: "",
    subject_guid: "",
    difficulty_level: "",
    difficulty_level_guid: "",
    // "duration": "",
    // "duration_ums": "",
    duration_uom_guid: "",
    number_of_questions: "",
  };
  public questiondata: any = {
    subject_guid: "",
    difficulty_level_guid: "",
    // "duration": "",
    // "duration_uom_guid": "",
    number_of_questions: "",
  };
  public questionJson = [];
  newSectionId: any = 0;
  newUser: boolean = true;
  addRowStatus: boolean = true;
  // allowDurationStatus: boolean = false;
  // disabledTable: boolean;

  constructor(
    private fb: FormBuilder,
    private configService: AppsettingsConfService,
    private SharedService: SharedService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(
      (configData) => {
        this.appRoutes = configData;
      },
      (error) => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
  }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Manage Exam");
    this.initializeFields();
    this.getExamId();
    this.getIntialData();
    this.getDurationAllowStatus();
    this.getSectionId();
  }

  getSectionId() {
    this.sectionIdSub = this.SharedService.sectionId.subscribe((sectionID) => {
      if (sectionID != null) {
        this.newSectionId = sectionID;
        this.SharedService.sectionId.next(null);
      }
    });
  }

  setSectionDetails(sectionID) {
    this.getSectionDetails(sectionID);
    this.addSectionsFormGroup.patchValue({
      section_id: sectionID,
    });
  }

  getExamId() {
    this.emailIdSub = this.SharedService.ExamId.subscribe((examId) => {
      if (examId != null) {
        this.examId = examId;
        this.getData(examId);
      }
    });

    ///Restrict new user to update section
    // this.IdSub = this.SharedService.ID.subscribe(id => {
    //   // debugger
    //   if (id != null) {
    //     // Existing User
    //     this.emailIdSub = this.SharedService.ExamId.subscribe(examId => {
    //       if (examId != null) {
    //         this.examId = examId;
    //         this.Id = id;
    //         this.getData(examId);
    //       }
    //     });
    //   }
    // });
  }

  multisubjectComp(c1: any, c2: any): any {
    return c1 && c2 ? c1.guid === c2.guid : c1 === c2;
  }

  onSubjectChange(value: any) {
    this.items = [];
    if (value) {
      this.addDataRows(value);
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // debugger
    if (this.IdSub) {
      this.IdSub.unsubscribe();
    }
    if (this.emailIdSub) {
      this.emailIdSub.unsubscribe();
    }
    if (this.sectionIdSub) {
      this.sectionIdSub.unsubscribe();
    }
  }

  getDurationAllowStatus() {
    this.addSectionsFormGroup
      .get("allow_duration")
      .valueChanges.subscribe((data) => {
        if (data === "false") {
          this.addSectionsFormGroup.get("duration").disable();
          this.addSectionsFormGroup.get("auto_switch").disable();
          this.addSectionsFormGroup.get("duration_uom_guid").disable();
        } else {
          this.addSectionsFormGroup.get("duration").enable();
          this.addSectionsFormGroup.get("auto_switch").enable();
          this.addSectionsFormGroup.get("duration_uom_guid").enable();
        }
      });
  }

  getData(examId: any) {
    this.newSectionId = 0;
    var keyData = [
      {
        name: "examId",
        value: examId,
      },
    ];

    //Get Section List According to ExamId
    this.restService.ApiEndPointUrlOrKey = Exam.getSectionList;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        // debugger
        this.sectionList = sucessResponse.sections;

        if (this.newSectionId) {
          this.setSectionDetails(this.newSectionId);
        } else {
          this.setSectionDetails(this.sectionList[0].id);
        }
      },
      (errorResponse) => {
        console.error("ERROR: Section List ", errorResponse.message[0]);
      }
    );

    // Get Select Subject List
    var keyData = [
      {
        name: "examId",
        value: examId,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getUserSelectedSubjectList;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        this.selectedSubject = sucessResponse.subjects;
      },
      (errorResponse) => {
        console.error("ERROR: Select Subject List", errorResponse.message[0]);
      }
    );
  }

  addDataRows(subjectList?: any) {
    this.itemCount = 0;
    let i = this.itemCount + 1;

    const j = subjectList.length || i + 1;
    for (i; i <= j; i++) {
      let name = subjectList[i - 1].name;

      this.items.push(new SectionsRowClass(i, name));
    }

    this.SharedService.selectedSubject.next(subjectList); // Sharing subject with child component
  }

  incrementRows() {
    let i = this.itemCount + 1;
    const j = i + 1;
    for (i; i < j; i++) {
      this.items.push(new SectionsRowClass(i));
    }
  }

  getIntialData() {
    // get Uoms List
    this.restService.ApiEndPointUrlOrKey = Exam.getUomsList;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.uomsList = successResponse.uoms;
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );

    // Get Difficulty level
    this.restService.ApiEndPointUrlOrKey = Exam.getDifficultyLevelList;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.difficultyLevels = successResponse.difficulty_levels;
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

  public initializeFields() {
    this.addSectionsFormGroup = new FormGroup({
      section_id: new FormControl("", Validators.required),
      question_count: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(999),
      ]),
      section_name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
      ]),
      allow_duration: new FormControl("1", Validators.required),
      subjects: new FormControl("", Validators.required),
      duration: new FormControl("", [Validators.required,Validators.min(1), Validators.max(999)]),
      duration_uom_guid: new FormControl("", Validators.required),
      auto_switch: new FormControl("0", Validators.required),
    });
  }

  private getParams() {
    let params = this.addSectionsFormGroup.getRawValue();
    return params;
  }

  public formSubmit() {
    this.questionJson = [];

    if (this.addSectionsFormGroup.valid === false) {
      let form = document.getElementById("addSectionsForm");
      form.classList.add("was-validated");
    } else if (
      this.totalQuestion !==
      parseInt(this.addSectionsFormGroup.getRawValue().question_count)
    ) {
      this.messageService.ok(
        "Total number of question should be equal to question count"
      );
      return false;
    } else if (typeof this.items[0]["name"] == "undefined") {
      this.messageService.ok("Please add question level details");
      return false;
    } else if (this.addSectionsFormGroup.valid === true) {
      let params = this.getParams();

      if (params["allow_duration"] == "0") {
        params["duration"] = 0;
        params["auto_switch"] = "0";
        params["duration_uom_guid"] = null;
      }
      params["exam_id"] = this.examId;
      try {
        this.items.forEach((data) => {
          this.questiondata.number_of_questions = data["number_of_questions"];
          this.questiondata.subject_guid =
            data["subject_guid"] || data["subject_guids"]["guid"];
          this.questiondata.difficulty_level_guid =
            data["difficulty_level_guid"] ||
            data["difficulty_level_guids"]["guid"];
          // this.questiondata.duration = data['duration'];
          // this.questiondata.duration_uom_guid = data['duration_uom_guid'] || data['duration_uom_guids']['guid'];
          this.questionJson.push(Object.assign({}, this.questiondata));
        });
      } catch (err) {
        this.messageService.ok("Please add question level details");
        return false;
      }

      params["question_level"] = this.questionJson;
      let sectionId = params["section_id"];

      var keyData = [
        {
          name: "examId",
          value: this.examId,
        },
        {
          name: "sectionId",
          value: sectionId,
        },
      ];
      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        this.restService.ApiEndPointUrlOrKey = Exam.saveSection;
        this.restService.ApiEndPointMehod = RestMethods.Put;
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi(keyData).subscribe(
          (sucessResponse) => {
            this.messageService
              .okRedirectModal(sucessResponse, "SUCCESS")
              .subscribe((result) => {
                if (result == true) {
                  // OK = true for redirection
                  this.messageService.hideModal();
                  // this.nextTab.emit(2); // Select next tab
                } else {
                  // NO/CANCEL = false
                  this.messageService.hideModal();
                }
              });
          },
          (errorResponse) => {
            if (errorResponse !== undefined) {
              //this.messageService.ok(errorResponse);
            }
          }
        );
      }
    }
  }

  public reset() {
    let form = document.getElementById("addSectionsForm");
    form.classList.remove("was-validated");
    this.addSectionsFormGroup.reset();
    this.initializeFields();
  }

  // Table3 start
  public clearAllRows(event: any) {
    // alert('clearAll clicked: ' + event);
    //  console.log("clear all ", event);
    // this.calTotalAmount();
  }

  onDragged(dragEvent: any) {
    //Avinash - 10/12/2019
    const [e, el] = dragEvent.args;
    // do something
  }

  public deleteRow(rowitem: any) {
    // this.calTotalAmount();
    // const rows = this.items.length;
    // /* this._items.splice(index, 1);
    // if (this.sortIndexOnDrop) {
    //   this.reOrderDataRows();
    // } */
    // console.log(JSON.stringify(this.items));

    // let i = 0;
    // for (i; i < rows; i++) {
    //   if (this.items[i].line_num === rowitem['rowitem']['line_num']) {
    //     // console.log("items ", this.items[i].line_num);
    //     // console.log("rowitem ", rowitem['rowitem']['line_num']);
    //     // console.log(this.items[i]);

    //     this.items.splice(i, 1);
    //     // if (this.sortIndexOnDrop) {
    //     //   this.reOrderDataRows();
    //     // }
    //     break;
    //   }
    // }
    this.questionCount();
  }

  // ngx-ixcheck-product-info -Start
  public getChildComponentData(childData: any) {
    let enableInsert = true;
    childData["name"] = childData.subject_guids.name;
    childData["difficulty_levels"] = childData.difficulty_level_guids.name;

    // Check for duplicate entry
    this.items.forEach((element) => {
      if (element["name"] == childData["name"]) {
        if (element["difficulty_levels"] == childData["difficulty_levels"]) {
          if (element["line_num"] != childData["line_num"]) {
            this.messageService.ok("Details already exists");
            enableInsert = false;
          }
        }
      }
    });

    if (enableInsert) {
      let linenumber = childData["line_num"];
      this.items[linenumber - 1] = childData;
      this.questionCount();
    }
  }

  questionCount() {
    this.totalQuestion = 0;
    try {
      this.items.forEach((element) => {
        if (element.number_of_questions) {
          this.totalQuestion += parseInt(element.number_of_questions);
        }
      });
    } catch (e) {
      console.log("Difficulty Levels is empty");
    }
  }

  public updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (this.items[i].line_num === updatedItem.prodInfo.line_num) {
        this.items[i] = updatedItem.prodInfo;
        // this.calTotalAmount();
        break;
      }
    }
  }

  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  disableDuration(event: any) {
    let result = event.target.value;
    this.disableAllowduration(result);
  }

  disableAllowduration(result: any) {
    let status = parseInt(result);
    if (!status) {
      // this.allowDurationStatus = true;
      this.addSectionsFormGroup.patchValue({
        duration: "",
        auto_switch: "",
        duration_uom_guid: "",
      });
      this.addSectionsFormGroup.get("duration").disable();
      this.addSectionsFormGroup.get("auto_switch").disable();
      this.addSectionsFormGroup.get("duration_uom_guid").disable();
    } else {
      // this.allowDurationStatus = false;
    }
  }
  //Get intial data when user select id

  valueChange(event: any) {
    let sectionId = event.target.value;
    this.getSectionDetails(sectionId);
  }

  getSectionDetails(sectionId) {
    // this.items = [];
    var keyData = [
      {
        name: "examId",
        value: this.examId,
      },
      {
        name: "sectionId",
        value: sectionId,
      },
    ];

    this.restService.ApiEndPointUrlOrKey = Exam.getSaveSection;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        if (!sucessResponse["sections"][0]["section_name"]) {
          this.resetIntialData();
        } else {
          this.setIntialData(sucessResponse);
        }
      },
      (errorResponse) => {
        console.error(
          "ERROR: ",
          errorResponse["httpErrorResponse"]["http_status"]
        );
      }
    );
  }

  resetIntialData() {
    this.addSectionsFormGroup.patchValue({
      question_count: "",
      section_name: "",
      allow_duration: "",
      duration: "",
      auto_switch: "",
      duration_uom_guid: "",
      subjects: "",
    });
    this.addSectionsFormGroup.get("subjects").enable();
    this.totalQuestion=0;
    this.addRowStatus = true;
  }

  // Setting intial data
  setIntialData(value: any) {
    this.newUser = false;
    value["question_level"].forEach((data) => {
      data["status"] = "false";
    });
    this.addSectionsFormGroup.patchValue({
      question_count: value["sections"][0]["question_count"],
      section_name: value["sections"][0]["section_name"],
      allow_duration: value["sections"][0]["allow_duration"],
      duration: value["sections"][0]["duration"],
      auto_switch: value["sections"][0]["auto_switch"],
      duration_uom_guid: value["sections"][0]["duration_uom_guid"],
      subjects: value["subjects"],
    });
    this.SharedService.selectedSubject.next(value["subjects"]);
    this.items = value["question_level"];
    this.addRowStatus = false;
    let allowDuration = value["sections"][0]["allow_duration"];
    this.disableAllowduration(allowDuration);
    this.questionCount();
    //// For temp
    try {
      for (let i = 1; i <= this.items.length; i++) {
        this.items[i - 1]["line_num"] = i;
      }
    } catch (e) {
      console.log("list is empty");
    }

    for (let i = 0; i < this.items.length; i++) {
      this.items[i]["isReadonly"] = true;
    }
    this.addSectionsFormGroup.get("subjects").disable();
  }
}
