import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';

import { SharedService } from '../../service/shared.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-questions',
  templateUrl: './questions-view.component.html',
  styleUrls: ['./questions-view.component.scss']
})
export class QuestionsViewComponent implements OnInit {
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
  centreTypeList: any;
  showDropDown = false;
  sectionList: any;
  subjectList: any;
  examId: any;
  Id: any;
  emailIdSub: Subscription;
  IdSub: Subscription;
  sectionIdSub: Subscription;
  selectedSubject: any;
  questionTypeList: any;
  sectionId: any;
  public params: any = {
    "exam_id": "",
    "section_id": "",
    "questionDetails": "",
  };
  public questiondata: any = {
    "question_number": "",
    "subject_guid": "",
    "difficulty_level_guid": "",
    "duration_uom_guid": "",
    "duration": "",
    "question_type_guid": "",
    "marks": "",
    "negative_marks": "",
    "question_Id": ""
  };
  public questionDetails: any = [];


  // Child
  difficultyLevels: any;
  public childFromGroup: FormGroup;
  uomsList: any;
  allowDurationStatus: boolean=false;

  constructor(private configService: AppsettingsConfService, private SharedService: SharedService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Manage Exam");
    this.initializeFields();
    this.getExamId();
    this.getSectionId();
    this.intialChildForm();
  }

  intialChildForm() {
    this.childFromGroup = new FormGroup({
      subject_guids: new FormControl('', Validators.required),
      difficulty_level_guids: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      duration_uom_guids: new FormControl('', Validators.required),
      question_type: new FormControl('', Validators.required),
      marks: new FormControl('', Validators.required),
      negative_marks: new FormControl('', Validators.required),
    });
  }

  getSectionId() {
    this.sectionIdSub = this.SharedService.sectionId.subscribe(sectionID => {
      if (sectionID != null) {
        this.setSectionDetails(sectionID);
      }
    });
  }

  setSectionDetails(sectionId: any) {
    this.getQuestionList(sectionId);
    this.sectionId = sectionId;
    this.addQuestionsFormGroup.patchValue({
      section: sectionId
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

    this.emailIdSub = this.SharedService.ExamId.subscribe(examId => {
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
        "name": "examId",
        "value": this.examId
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getSectionList;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.sectionList = sucessResponse.sections;
        this.setSectionDetails(this.sectionList[0].id);
      }, errorResponse => {
        console.error('ERROR: ', errorResponse.message[0]);
      });

    // get Uoms List
    this.restService.ApiEndPointUrlOrKey = Exam.getUomsList;
    this.restService.callApi().subscribe(successResponse => {
      this.uomsList = successResponse.uoms;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Difficulty level
    this.restService.ApiEndPointUrlOrKey = Exam.getDifficultyLevelList;
    this.restService.callApi().subscribe(successResponse => {
      this.difficultyLevels = successResponse.difficulty_levels;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Select Subject List
    // var keyData = [
    //   {
    //     "name": "examId",
    //     "value": examId
    //   },
    // ];
    // this.restService.ApiEndPointUrlOrKey = Exam.getUserSelectedSubjectList;
    // this.restService.callApi(keyData)
    //   .subscribe(sucessResponse => {
    //     this.selectedSubject = sucessResponse.subjects;
    //   }, errorResponse => {
    //     console.error('ERROR: ', errorResponse.message[0]);
    //   });

    // Get Question Type List
    // this.restService.ApiEndPointUrlOrKey = Exam.getQuestionTypeList;
    // this.restService.callApi()
    //   .subscribe(sucessResponse => {
    //     this.questionTypeList = sucessResponse.Question;
    //   }, errorResponse => {
    //     console.error('ERROR: ', errorResponse.message[0]);
    //   });
  }

  valueChange(event: any) {
    this.sectionId = event.target.value;
    this.getQuestionList(this.sectionId)
  }

  getQuestionList(sectionId) {
    this.items = [];
    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }, {
        "name": "sectionId",
        "value": sectionId
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getQuestionList;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.setFields(sucessResponse);
      }, errorResponse => {
        console.error('ERROR: ', errorResponse.message[0]);
        // this.resetIntialData();
      });
  }

  setQuestionType() {
    let questionType = this.addQuestionsFormGroup.get('question_type').value;
    this.items.forEach(questionId => {
      questionId['question_type'] = questionType.questionType;
      questionId['question_type_guid'] = questionType.question_type_guid;
    });
    this.childFromGroup.patchValue({
      question_type: questionType,
    });
    this.childFromGroup.get('question_type').disable();
  }

  setSubject() {
    let subjects = this.addQuestionsFormGroup.get('subjects').value;
    this.items.forEach(subjectId => {
      subjectId['subject'] = subjects.name;
      subjectId['subject_guid'] = subjects.guid;
    });
    this.childFromGroup.patchValue({
      subject_guids: subjects,
    });
    this.childFromGroup.get('subject_guids').disable();
  }

  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  public initializeFields() {
    this.addQuestionsFormGroup = new FormGroup({
      section: new FormControl('', Validators.required),
      subjects: new FormControl({ value: '', disabled: true }, Validators.required),
      question_type: new FormControl({ value: '', disabled: true }),
      name: new FormControl({ value: '', disabled: true }, Validators.required),
    });
  }

  //Setting the main Form
  public setFields(result: any) {
    this.items = [];
    let durationStatus = +result["Question"][0]["allow_duration"];
    this.allowDurationStatus = durationStatus ? true : false;

    let question = result.Question;
    if (question.length) {
      question.forEach(element => {
        this.items.push(Object.assign({}, element));
      });

      this.addQuestionsFormGroup.patchValue({
        name: result['question_type'][0]['section_name'],
        // subjects: result['question_type'][0]['subject_guid']
      });
    }
    else {
      this.resetIntialData();
    }
  }

  resetIntialData() {
    this.addQuestionsFormGroup.patchValue({
      name: '',
      section: '',
      subjects: '',
      question_type: '',
    });

    this.items = [];

  }

  private getParams() {
    let params = this.addQuestionsFormGroup.getRawValue();
    return params;
  }

  public formSubmit() {

    if (this.addQuestionsFormGroup.valid === false) {
      let form = document.getElementById('addQuestionsForm');
      form.classList.add('was-validated');
    } else if (this.items.length === 0) {
      this.messageService.ok("Please add table details");
      return false;
    } else if (this.addQuestionsFormGroup.valid === true) {

      this.items.forEach((data) => {
        // console.log(JSON.stringify(data));
        this.questiondata.question_number = data['question_number'];
        this.questiondata.subject_guid = data['subject_guid'] || data['subject_guids']['guid'];
        this.questiondata.difficulty_level_guid = data['difficulty_level_guid'] || data['difficulty_level_guids']['guid'];
        this.questiondata.duration_uom_guid = data['duration_uom_guid'] || data['duration_uom_guids']['guid'];
        this.questiondata.duration = data['duration'];
        this.questiondata.question_type_guid = data['question_type_guid'] || data['question_type']['question_type_guid'];
        this.questiondata.marks = data['marks'];
        this.questiondata.negative_marks = data['negative_marks'];
        this.questiondata.question_Id = data['question_Id'];
        this.questionDetails.push(Object.assign({}, this.questiondata));
      })

      this.params.exam_id = this.examId;
      this.params.section_id = this.sectionId;
      this.params.questionDetails = this.questionDetails;

      // console.log(JSON.stringify(this.params));

      // // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        var keyData = [
          {
            "name": "examId",
            "value": this.examId
          }, {
            "name": "sectionId",
            "value": this.sectionId
          }
        ];
        this.restService.ApiEndPointUrlOrKey = Exam.saveQuestion;
        this.restService.ApiEndPointMehod = RestMethods.Put;
        this.restService.HttpPostParams = this.params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to Final Review').subscribe(result => {
              if (result == true) { // OK = true for redirection
                this.messageService.hideModal();
                this.nextTab.emit(3); // Select next tab
              }
              else { // NO/CANCEL = false
                this.messageService.hideModal();
              }
            });
          }, errorResponse => {
            if (errorResponse !== undefined) {
              //this.messageService.ok(errorResponse);
            }
          }
          );
      }
    }
  }

  public reset() {
    let form = document.getElementById('addQuestionsForm');
    form.classList.remove('was-validated');
    this.addQuestionsFormGroup.reset();
    this.initializeFields();
    let params = this.getParams();
  }

  // Child
  onCancel(itemData: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (this.items[i].question_number === itemData.question_number) {
        //console.log(JSON.stringify(itemData));
        this.items[i] = itemData;
        // this.calTotalAmount();
        break;
      }
    }
  }

  sendToParent(value: any) {
    let formdata = this.childFromGroup.getRawValue();

    if (this.childFromGroup.valid === false) {
      let form = document.getElementById('childFrom');
      form.classList.add('was-validated');
      return false;
    }
    // let formdata = this.childFromGroup.getRawValue();
    // formdata['line_num'] = value['line_num'];
    formdata['question_Id'] = value['question_Id'];
    formdata['question_number'] = value['question_number'];
    formdata['subject_name'] = formdata.subject_guids.name;
    formdata['level_name'] = formdata.difficulty_level_guids.name;
    formdata['uoms_name'] = formdata.duration_uom_guids.name;
    formdata['question_type_name'] = formdata.question_type.questionType;
    let linenumber = formdata['question_number'];
    this.items.forEach((element, i) => {
      if (element['question_number'] == linenumber) {
        this.items[i] = formdata;
      }
    });
    return true;
  }
}

