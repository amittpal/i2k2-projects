import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
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

@Component({
  selector: "app-questions",
  templateUrl: "./questions.component.html",
  styleUrls: ["./questions.component.scss"],
})
export class QuestionsComponent implements OnInit {
  @Output() private nextTab = new EventEmitter<number>(); // Sends tab id to parent component
  public items = [];
  public lastSeenIdMax = 0;
  public itemCount = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public notFound: boolean = false;

  public addQuestionsFormGroup: FormGroup;
  private appRoutes: any = {};
  statesList: any;
  cityList: any;
  uomsList: any;
  centreTypeList: any;
  showDropDown = false;
  sectionList: any;
  subjectList: any;
  difficultyLevelList: any;
  examId: any;
  Id: any;
  emailIdSub: Subscription;
  IdSub: Subscription;
  sectionIdSub: Subscription;
  selectedSubject: any;
  questionTypeList: any;
  sectionId: any;
  disabledSubjectStatus: boolean = false;
  disabledQuestionTypeStatus: boolean = false;
  disabledMarksStatus: boolean = false;
  disabledNegativeMarksStatus: boolean = false;
  disabledDuration: boolean = false;
  disabledDurationType: boolean = false;
  public params: any = {
    exam_id: "",
    section_id: "",
    questionDetails: "",
    is_negative_marking_enable:false
  };

  public questiondata: any = {
    question_number: "",
    subject_guid: "",
    difficulty_level_guid: "",
    duration_uom_guid: "",
    duration: "",
    question_type_guid: "",
    marks: "",
    negative_marks: "",
    question_Id: "",
  };
  allowDurationStatus: boolean = false;
  isNegativeMarkingEnabled: boolean = false;

  public questionDetails: any = [];
  newSecionId: any = 0;
  allowBulkUpdate = false;

  constructor(
    private configService: AppsettingsConfService,
    private SharedService: SharedService,   
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
    this.getSectionId();
  }

  getSectionId() {
    this.sectionIdSub = this.SharedService.sectionId.subscribe((sectionID) => {
      if (sectionID != null) {
        this.newSecionId = sectionID;
        this.SharedService.sectionId.next(null);
        // this.setSectionDetails(sectionID);
      }
    });    
  }

  setSectionDetails(sectionId: any) {
    this.getQuestionList(sectionId);
    this.sectionId = sectionId;
    this.addQuestionsFormGroup.patchValue({
      section: sectionId,
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
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

  getExamId() {
    this.emailIdSub = this.SharedService.ExamId.subscribe((examId) => {
      if (examId != null) {
        this.examId = examId;
        this.getIntialData(examId);
      }
    });

    // Restrict New user to call API
    // this.IdSub = this.SharedService.ID.subscribe(id => {
    //   if (id != null) {
    //     // New User
    //     this.emailIdSub = this.SharedService.ExamId.subscribe(examId => {
    //       if (examId != null) {
    //         this.examId = examId;
    //         this.Id = id;
    //         this.getIntialData(examId);
    //       }
    //     });
    //   }
    // });
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
        if (this.newSecionId) {
          this.setSectionDetails(this.newSecionId);
        } else {
          this.setSectionDetails(this.sectionList[0].id);
        }
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
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

    // get Difficulty level List
    this.restService.ApiEndPointUrlOrKey = Exam.getDifficultyLevelList;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.difficultyLevelList = successResponse.difficulty_levels;        
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

  valueChange(event: any) {
    this.sectionId = event.target.value;
    this.getQuestionList(this.sectionId);
    
    //disabling bulk upload on section change
    this.addQuestionsFormGroup.get('bulkUpdateForm').reset();              
    this.addQuestionsFormGroup.get('bulkUpdateForm').disable();
    this.allowBulkUpdate = false;


  }

  getQuestionList(sectionId) {
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
    this.restService.ApiEndPointUrlOrKey = Exam.getQuestionList;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        if (sucessResponse.Question.length == 0) {
          this.resetIntialData();
        } else {
          this.setFields(sucessResponse);
        }

      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
        this.resetIntialData();
      }
    );
  }

  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  // child-component
  public getChildComponentData(childData: any) {
    let linenumber = childData["question_number"];

    this.items.forEach((element, i) => {
      if (element["question_number"] == linenumber) {
        this.items[i] = childData;
      }
    });
  }

  public updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (
        this.items[i].question_number === updatedItem.prodInfo.question_number
      ) {
        this.items[i] = updatedItem.prodInfo;
        // this.calTotalAmount();
        break;
      }
    }
  }

  public initializeFields() {
    this.addQuestionsFormGroup = new FormGroup({
      section: new FormControl("", Validators.required),
      name: new FormControl({ value: "", disabled: true }, Validators.required),
      bulkUpdateForm: new FormGroup({
        subjects: new FormControl(""),
        question_type: new FormControl(""),
        difficulty_level: new FormControl(""),
        duration: new FormControl(""),
        duration_uom_guid: new FormControl(""),
        marks: new FormControl(""),
        negativeMarks: new FormControl(""),
      })

    });
    //
    this.addQuestionsFormGroup.get('bulkUpdateForm').disable();
  }

  //Setting the main Form
  public setFields(result: any) {            
    this.items = [];
    let durationStatus = +result["Question"][0]["allow_duration"];
    this.allowDurationStatus = durationStatus ? true : false;
    
    const nagativeMarking=this.sectionList.find(s=>s.id == this.sectionId).negative_marking;
    this.isNegativeMarkingEnabled = nagativeMarking === "1" ? true :false;

    let question = result.Question;
    if (question.length) {
      const list = question
        .sort((a, b) => a.question_number - b.question_number)
        .map((data, index, array) => data);
      list.forEach((element) => {
        this.items.push(Object.assign({}, element));
      });

      this.addQuestionsFormGroup.patchValue({
        name: result["question_type"][0]["section_name"],
        subjects: "",
        question_type: "",
        duration: "",
        duration_uom_guid: "",
        marks: "",
        negativeMarks: "",
      });

      this.disabledQuestionTypeStatus = false;
      this.disabledSubjectStatus = false;
    } else {
      this.resetIntialData();
    }
  }

  resetIntialData() {
    this.addQuestionsFormGroup.patchValue({
      name: "",
      section: "",
      subjects: "",
      question_type: "",
      duration: "",
      duration_uom_guid: "",
      marks: "",
      negativeMarks: "",
    });

    this.items = [];
  }

  public formSubmit() {

    this.messageService.confirm(["Are you sure you want to apply all changes?"], "Confirmation", "Update", "Cancel").subscribe(result => {
      if (result == true) {
        this.questionDetails = [];
        if (this.addQuestionsFormGroup.valid === false) {
          let form = document.getElementById("addQuestionsForm");
          form.classList.add("was-validated");
        } else if (this.items.length === 0) {
          this.messageService.ok("Please add table details");
          return false;
        } else if (this.addQuestionsFormGroup.valid === true) {
          try {
            this.items.forEach((data) => {
              // console.log(JSON.stringify(data));
              this.questiondata.question_number = data["question_number"];
              this.questiondata.subject_guid =
                data["subject_guid"] || data["subject_guids"]["guid"];
              this.questiondata.difficulty_level_guid =
                data["difficulty_level_guid"] ||
                data["difficulty_level_guids"]["guid"];
              if (this.allowDurationStatus) {
                this.questiondata.duration_uom_guid =
                  data["duration_uom_guid"] || data["duration_uom_guids"]["guid"];
                this.questiondata.duration = data["duration"];
              } else {
                this.questiondata.duration_uom_guid = null;
                this.questiondata.duration = "0";
              }
              this.questiondata.question_type_guid =
                data["question_type_guid"] ||
                data["question_type"]["question_type_guid"];
              this.questiondata.marks = data["marks"];
              this.questiondata.negative_marks = data["negative_marks"];
              this.questiondata.question_Id = data["question_Id"];
              this.questionDetails.push(Object.assign({}, this.questiondata));
            });
          } catch (err) {
            this.messageService.ok("Please add question level details");
            return false;
          }
          this.params.exam_id = this.examId;
          this.params.section_id = this.sectionId;
          this.params.is_negative_marking_enable=this.isNegativeMarkingEnabled;
          this.params.questionDetails = this.questionDetails;

          // call api code here...
          if (Object.keys(this.appRoutes).length !== 0) {
            var keyData = [
              {
                name: "examId",
                value: this.examId,
              },
              {
                name: "sectionId",
                value: this.sectionId,
              },
            ];
            this.restService.ApiEndPointUrlOrKey = Exam.saveQuestion;
            this.restService.ApiEndPointMehod = RestMethods.Put;
            this.restService.HttpPostParams = this.params;
            this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
            this.restService.callApi(keyData).subscribe(
              (sucessResponse) => {
                this.messageService
                  .okRedirectModal(sucessResponse, "SUCCESS")
                  .subscribe((result) => {
                    if (result == true) {
                      // OK = true for redirection
                      this.messageService.hideModal();
                      // this.nextTab.emit(3); // Select next tab
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
        this.messageService.hideModal();
      }
      else {
        this.messageService.hideModal();
      }
    });

  }

  public reset() {
    let form = document.getElementById("addQuestionsForm");
    form.classList.remove("was-validated");
    this.addQuestionsFormGroup.reset();
    this.items.forEach((a) => {
      a["subject_guid"] = "";
      a["subject"] = "";
      a["difficulty_level_guid"] = "";
      a["difficulty_levels"] = "";
      a["duration_uom_guid"] = "";
      a["duration"] = "";
      a["duration_um"] = "";
      a["marks"] = "";
      a["negative_marks"] = "";
      a["question_type_guid"] = "";
      a["question_type"] = "";
    });
  }

  // Child
  // onCancel(itemData: any) {
  //   let i = 0;
  //   for (i; i < this.itemCount; i++) {
  //     if (this.items[i].question_number === itemData.question_number) {
  //       let element: HTMLElement = document.getElementsByClassName('expand-icons')[i] as HTMLElement;
  //       element.click();
  //       break;
  //     }
  //   }
  // }

  // setSubject() {
  //   let subjects = this.addQuestionsFormGroup.get("subjects").value;

  //   if (typeof subjects == "object") {
  //     this.items.forEach((subjectId) => {
  //       subjectId["subject_name"] = "";
  //       subjectId["subject"] = subjects.name;
  //       subjectId["subject_guid"] = subjects.guid;
  //     });
  //     this.disabledSubjectStatus = true;
  //   } else {
  //     this.items.forEach((subjectId) => {
  //       subjectId["subject_name"] = "";
  //       subjectId["subject"] = subjects.name;
  //       subjectId["subject_guid"] = subjects.guid;
  //     });
  //     this.disabledSubjectStatus = false;
  //   }
  //   // this.childFromGroup.patchValue({
  //   //   subject_guids: subjects,
  //   // });
  //   // this.childFromGroup.get('subject_guids').disable();
  // }

  // setQuestionType() {
  //   let questionType = this.addQuestionsFormGroup.get("question_type").value;
  //   if (typeof questionType == "object") {
  //     this.items.forEach((questionId) => {
  //       questionId["question_type_name"] = "";
  //       questionId["question_type"] = questionType.questionType;
  //       questionId["question_type_guid"] = questionType.question_type_guid;
  //     });
  //     this.disabledQuestionTypeStatus = true;
  //   } else {
  //     this.items.forEach((questionId) => {
  //       questionId["question_type_name"] = "";
  //       questionId["question_type"] = questionType.questionType;
  //       questionId["question_type_guid"] = questionType.question_type_guid;
  //     });
  //     this.disabledQuestionTypeStatus = false;
  //   }
  //   // this.childFromGroup.patchValue({
  //   //   question_type: questionType,
  //   // });
  //   // this.childFromGroup.get('question_type').disable();
  // }
  // setQuestionMarks() {
  //   let questionMarks = this.addQuestionsFormGroup.get("marks").value;
  //   if (questionMarks) {
  //     this.items.forEach((element) => {
  //       element["marks"] = questionMarks;
  //     });
  //     this.disabledMarksStatus = true;
  //   } else {
  //     this.items.forEach((element) => {
  //       element["marks"] = 0;
  //     });
  //     this.disabledMarksStatus = false;
  //   }
  // }
  // setNegativeQuestionMarks() {
  //   let negativeQuestionMarks = this.addQuestionsFormGroup.get("negativeMarks")
  //     .value;
  //   if (negativeQuestionMarks) {
  //     this.items.forEach((element) => {
  //       element["negative_marks"] = negativeQuestionMarks;
  //     });
  //     this.disabledNegativeMarksStatus = true;
  //   } else {
  //     this.items.forEach((element) => {
  //       element["negative_marks"] = 0;
  //     });
  //     this.disabledNegativeMarksStatus = false;
  //   }
  // }

  // setDuration() {
  //   let duration = this.addQuestionsFormGroup.get("duration").value;
  //   if (duration) {
  //     this.items.forEach((element) => {
  //       element["duration"] = duration;
  //     });
  //     this.disabledDuration = true;
  //   } else {
  //     this.items.forEach((element) => {
  //       element["duration"] = 0;
  //     });
  //     this.disabledDuration = false;
  //   }
  // }

  // setDurationTimeFormat() {
  //   let durationFormatValue = this.addQuestionsFormGroup.get("duration_uom_guid").value;
  //   let details = this.uomsList.find((u) => u.guid === durationFormatValue);
  //   if (details) {
  //     if (typeof details == "object") {
  //       this.items.forEach((durationType) => {
  //         durationType["duration_um"] = "";
  //         durationType["duration_um"] = details.name;
  //         durationType["duration_uom_guid"] = details.guid;
  //       });
  //       this.disabledDurationType = true;
  //     } else {
  //       this.items.forEach((durationType) => {
  //         durationType["duration_um"] = "";
  //         durationType["duration_um"] = details.name;
  //         durationType["duration_uom_guid"] = details.guid;
  //       });
  //       this.disabledDurationType = false;
  //     }
  //   }
  //   else {
  //     this.disabledDurationType = false;
  //   }
  // }



  /*bulk table update*/
  
  onBulkUpdateButtonClick() {    
    if (this.allowBulkUpdate) {
      this.messageService.confirm(["Are you sure you want to proceed ?"],
        "Confirmation", "Update", "Cancel").subscribe(result => {
          if (result == true) {

            let bulkFormValues = this.addQuestionsFormGroup.get('bulkUpdateForm').value;
            if (bulkFormValues) {
              //updating bulk values in table
              //Subjects
              if(bulkFormValues.subjects)
              {
                if (typeof bulkFormValues.subjects == "object") {
                  this.items.map(el => {
                    el.subject = bulkFormValues.subjects.name;
                    el.subject_guid = bulkFormValues.subjects.guid;
                  });
                }
              }
             
              //Question Types
              if(bulkFormValues.question_type)
              {
                if (typeof bulkFormValues.question_type == "object") {
                  this.items.map(el => {
                    el.question_type = bulkFormValues.question_type.questionType;
                    el.question_type_guid = bulkFormValues.question_type.question_type_guid;
                  });
                }
              }
              

              //Difficulty level
              if(bulkFormValues.difficulty_level)
              {
                if (typeof bulkFormValues.difficulty_level == "object") {
                  this.items.map(el => {
                    el.difficulty_levels = bulkFormValues.difficulty_level.name;
                    el.difficulty_level_guid = bulkFormValues.difficulty_level.guid;
                  });
                }
              }
             

              //Duration
              if (bulkFormValues.duration) {
                this.items.map(el => {
                  el.duration = bulkFormValues.duration;
                });
              }
              //Duration Type
              if (bulkFormValues.duration_uom_guid) {
                this.items.map(el => {
                  el.duration_um = bulkFormValues.duration_uom_guid.name;
                  el.duration_uom_guid = bulkFormValues.duration_uom_guid.guid;
                });
              }
              //Marks
              if (bulkFormValues.marks) {
                this.items.map(el => {
                  el.marks = bulkFormValues.marks;
                });
              }
              //Negative marks
              if (bulkFormValues.negativeMarks) {
                this.items.map(el => {
                  el.negative_marks = bulkFormValues.negativeMarks;
                });
              }

              this.addQuestionsFormGroup.get('bulkUpdateForm').reset();              
              this.addQuestionsFormGroup.get('bulkUpdateForm').disable();
              this.allowBulkUpdate = false;
              
            }
            this.messageService.hideModal();
          }
          else {
            this.messageService.hideModal();
          }
        });
    }
    else {

      this.messageService.confirm(["This will update/overwrite all entries for all questions in this section"],
        "Confirmation", "Unlock", "Cancel").subscribe(result => {
          if (result == true) {
            this.allowBulkUpdate = true;
            this.addQuestionsFormGroup.get('bulkUpdateForm').enable();
            this.messageService.hideModal();
          }
          else {
            this.messageService.hideModal();
          }
        });


    }

  }
}
