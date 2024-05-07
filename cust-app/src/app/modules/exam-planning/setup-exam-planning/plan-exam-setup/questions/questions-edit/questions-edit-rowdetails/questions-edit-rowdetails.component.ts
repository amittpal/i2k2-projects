import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {  
  Exam,
} from "src/app/shared/enumrations/app-enum.enumerations";
@Component({
  selector: "questions-edit-rowdetail",
  templateUrl: "./questions-edit-rowdetails.component.html",
  styleUrls: ["./questions-edit-rowdetails.component.scss"],
})
export class QuestionsEditRowdetailComponent implements OnInit {
  @Output() private childComponentData = new EventEmitter<number>();
  @Input("examId") examId: string;
  @Input("rowItemData") rowItemData: any;
  @Input("disabledSubject") disabledSubject: any;
  @Input("disabledQuestionType") disabledQuestionType: any;
  @Input("disabledMarks") disabledMarks: any;
  @Input("disabledDuration") disabledDuration: any;
  @Input("disabledNegativeMarks") disabledNegativeMarks: any;  
  @Input("disabledDurationType") disabledDurationType: any;
  @Input("isNegativeMarkingEnabled") isNegativeMarkingEnabled: boolean;
  
  @Output() update = new EventEmitter();
  // Child
  difficultyLevels: any;
  public childFromGroup: FormGroup;
  uomsList: any;
  selectedSubject: any;
  questionTypeList: any;
  sectionList: any;
  _item: any;
  _itemOrig: any;
  allowDurationStatus: boolean = false;

  @Input() get item() {
    return this._item;
  }
  set item(item: any) {
    this._itemOrig = Object.assign({}, item);
    this._item = item;
  }
  
  constructor(    
    private restService: GlobalRestService
  ) {
    // this._checkSubTree = true;
  }

  ngOnInit() {
    this.getIntialData(this.examId);
    this.setIntialdata();
  }

  getIntialData(examId: any) {
    // Get Section List
    var keyData = [
      {
        name: "examId",
        value: this.examId,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getSectionList;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        this.sectionList = sucessResponse.sections;
        // this.setSectionDetails(this.sectionList[0].id);
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );

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

    // Get Question Type List
    this.restService.ApiEndPointUrlOrKey = Exam.getQuestionTypeList;
    this.restService.callApi().subscribe(
      (sucessResponse) => {
        this.questionTypeList = sucessResponse.Question;
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

    // Get Select Subject List
    var keyInData = [
      {
        name: "examId",
        value: examId,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getUserSelectedSubjectList;
    this.restService.callApi(keyInData).subscribe(
      (sucessResponse) => {
        this.selectedSubject = sucessResponse.subjects;
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );

    // Get Question Type List
    this.restService.ApiEndPointUrlOrKey = Exam.getQuestionTypeList;
    this.restService.callApi().subscribe(
      (sucessResponse) => {
        this.questionTypeList = sucessResponse.Question;
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

  setIntialdata() {        
    //Check Subject for undefined
    let durationStatus = +this.rowItemData["allow_duration"];
    this.allowDurationStatus = durationStatus ? true : false;   
    this.intialChildForm();

    if (typeof this.rowItemData["subject_guid"] == "undefined") {
      // this.disabledSubject = false;
    } else {
      this.childFromGroup.patchValue({
        subject_guids: this.rowItemData["subject_guid"],
      });
    }

    if (typeof this.rowItemData["subject_guids"] == "undefined") {
      // this.disabledSubject = false;
    } else {
      this.childFromGroup.patchValue({
        subject_guids: this.rowItemData["subject_guids"]["guid"],
      });
    }

    //Check QuestionType for undefined
    if (typeof this.rowItemData["question_type"] == "undefined") {
      this.disabledQuestionType = false;
    } else {
      this.childFromGroup.patchValue({
        question_type:
          this.rowItemData["question_type"]["question_type_guid"] ||
          this.rowItemData["question_type_guid"],
      });
    }

    this.childFromGroup.patchValue({
      difficulty_level_guids:
        this.rowItemData["difficulty_level_guid"] ||
        this.rowItemData["difficulty_level_guids"]["guid"],
      duration: this.rowItemData["duration"] || "",
      marks: this.rowItemData["marks"] || "",
      negative_marks: this.rowItemData["negative_marks"],
    });

    if (typeof this.rowItemData["duration_uom_guid"] != "undefined") {
      this.childFromGroup.patchValue({
        duration_uom_guids: this.rowItemData["duration_uom_guid"],
      });
    }

    if (typeof this.rowItemData["duration_uom_guids"] != "undefined") {
      this.childFromGroup.patchValue({
        duration_uom_guids: this.rowItemData["duration_uom_guids"]["guid"],
      });
    }
    if (this.disabledSubject) {
      this.childFromGroup.get("subject_guids").disable();
    } else {
      this.childFromGroup.get("subject_guids").enable();
    }
    if (this.disabledQuestionType) {
      this.childFromGroup.get("question_type").disable();
    } else {
      this.childFromGroup.get("question_type").enable();
    }

    if (this.disabledMarks) {
      this.childFromGroup.get("marks").disable();
    } else {
      this.childFromGroup.get("marks").enable();
    }
    
    if (this.disabledNegativeMarks) {
      this.childFromGroup.get("negative_marks").disable();
    } else {
      this.childFromGroup.get("negative_marks").enable();
    }


    if (this.disabledDuration) {
      this.childFromGroup.get("duration").disable();
    } else {
      this.childFromGroup.get("duration").enable();
    }

    if (this.disabledDurationType) {
      this.childFromGroup.get("duration_uom_guids").disable();
    } else {
      this.childFromGroup.get("duration_uom_guids").enable();
    }



  }

  intialChildForm() {

    this.childFromGroup = new FormGroup({
      subject_guids: new FormControl("", Validators.required),
      difficulty_level_guids: new FormControl("", Validators.required),       
      question_type: new FormControl("", Validators.required),
      marks: new FormControl("", [Validators.required, Validators.max(999)]),   
    });

    if (this.allowDurationStatus) {
      this.childFromGroup.addControl("duration", new FormControl("", [
        Validators.required,
        Validators.max(999),
      ]));
      this.childFromGroup.addControl("duration_uom_guids", new FormControl("", Validators.required));     
       
    }
    if(this.isNegativeMarkingEnabled)
    {
      this.childFromGroup.addControl("negative_marks", new FormControl("", [
        Validators.required,
        Validators.max(999),
      ]))
    }       
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
      // selectedSubject
      this.selectedSubject.forEach((element) => {
        if (formdata.subject_guids == element.guid) {
          formdata.subject_guids = element;
        }
      });
      // difficultyLevels

      this.difficultyLevels.forEach((element) => {
        if (formdata.difficulty_level_guids == element.guid) {
          formdata.difficulty_level_guids = element;
        }
      });

      // uomsList
      if (this.allowDurationStatus) {
        this.uomsList.forEach((element) => {
          if (formdata.duration_uom_guids == element.guid) {
            formdata.duration_uom_guids = element;
          }
        });
      } else {
        formdata.duration_uom_guids = "0";
      }
      // questionTypeList
      this.questionTypeList.forEach((element) => {
        if (formdata.question_type == element.question_type_guid) {
          formdata.question_type = element;
        }
      });
      
      formdata["allow_duration"] = this.rowItemData["allow_duration"];
      formdata["question_Id"] = this.rowItemData["question_Id"];
      formdata["question_number"] = this.rowItemData["question_number"];
      formdata["subject_name"] = formdata.subject_guids.name;
      formdata["level_name"] = formdata.difficulty_level_guids.name;
      formdata["uoms_name"] = this.allowDurationStatus
        ? formdata.duration_uom_guids.name
        : "0";
      formdata["question_type_name"] = formdata.question_type.questionType;

      this.childComponentData.emit(formdata);
      return true;
    }
}
}
