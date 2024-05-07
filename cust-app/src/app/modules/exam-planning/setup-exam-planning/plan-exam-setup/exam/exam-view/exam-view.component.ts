import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';

import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';
import { SharedService } from '../../service/shared.service'

@Component({
  selector: 'app-view-exam',
  templateUrl: './exam-view.component.html',
  styleUrls: ['./exam-view.component.scss']
})
export class ExamViewComponent implements OnInit {

  public addExamFormGroup: FormGroup;
  private appRoutes: any = {};
  languageList: any;
  subjectList: any;
  examTypeList: any;
  uomsList: any;
  questionOptionSequenceList: any;
  questionRandomizationOptionList: any;
  questionViewOptionList: any;
  loadingData: any;
  displayData: boolean = false; // display table after data load
  newUser: boolean = false;  // flag

  @Input() examId: any; // get examID from parent component
  @Input() Id: any; // get ID from parent component
  @Output() private nextTab = new EventEmitter<number>(); // Sends tab id to parent component
  @Output() private exam_num = new EventEmitter<string>(); // Sends exam_number to parent tab
  gradeList: any;
  primLangList: any = [];

  constructor(private configService: AppsettingsConfService, private router: Router, private SharedService: SharedService, private primaryHeader: PrimaryHeaderService,
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
    this.primaryHeader.pageTitle.next("Exam Setup");
    this.initializeFields();
    this.getIntialData();
    this.getData(this.examId, this.Id);
    this.SharedService.ExamId.next(this.examId); //Sharing Exam ID to other component

  }

  getData(examId: any, id?: any) {
    if (id == undefined) {
      // For new user
      this.newUser = true;
    } else {
      // For existing user
      this.SharedService.ID.next(id); //Sharing ID to other component
    }

    var keyData = [
      {
        "name": "examId",
        "value": examId
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getExamById;
    this.restService.callApi(keyData).subscribe(sucessResponse => {
      this.displayData = true;
      if (sucessResponse.exam_setup) {
        // for updating the exam
        this.loadsFields(sucessResponse);
      } else {
        // for new exam
        this.loadingData = sucessResponse['exams'][0]['exam_number'];
        let examLabelPublic = sucessResponse["exams"][0]["exam_public_label"];
        this.exam_num.emit(this.loadingData);
        this.addExamFormGroup.setValue({
          exam_number: this.loadingData,
          code: "",
          name: "",
          description: "",
          duration: "",
          sections: "",
          languages: "",
          shifts: "",
          exam_type_guid: "",
          primary_language_guid: "",
          grade_type_guid: "",
          dual_show_primary: "",
          subjects: "",
          duration_uom_guid: "",
          negative_marking: "",
          exam_public_label: examLabelPublic,
          question_option_sequence: "",
          question_paper_randomization: "",
          full_question_paper: ""
        });
      }
    },
      err => console.log('HTTP Error', err)
    );
  }

  // Add New Section
  addNewSection() {
    var keyData = [
      {
        "name": "examId",
        "value": this.examId,
      }
    ];
    let params: any = {
      id: this.examId
    }
    this.restService.ApiEndPointUrlOrKey = Exam.addNewSection;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = params;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData).subscribe(successResponse => {
      if (successResponse['http_status'] == 200)
        this.getData(this.examId, this.Id);
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  getIntialData() {

    // get Uoms List
    this.restService.ApiEndPointUrlOrKey = Exam.getUomsList;
    this.restService.callApi().subscribe(successResponse => {
      this.uomsList = successResponse.uoms;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // get Exam Type List
    this.restService.ApiEndPointUrlOrKey = Exam.getExamTypeList;
    this.restService.callApi().subscribe(successResponse => {
      this.examTypeList = successResponse.exam_type;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // get Language List
    this.restService.ApiEndPointUrlOrKey = Exam.getLanguageList;
    this.restService.callApi().subscribe(successResponse => {
      this.languageList = successResponse.languages;

    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // get Subject List
    this.restService.ApiEndPointUrlOrKey = Exam.getSubjectList;
    this.restService.callApi().subscribe(successResponse => {
      this.subjectList = successResponse.subjects;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // get Grade List
    this.restService.ApiEndPointUrlOrKey = Exam.getGradeList;
    this.restService.callApi().subscribe(successResponse => {
      this.gradeList = successResponse.sections;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // get Question Option Sequence List
    this.restService.ApiEndPointUrlOrKey = Exam.getQuestionOptionSequenceList;
    this.restService.callApi().subscribe(
      successResponse => {
        this.questionOptionSequenceList = successResponse.Question;
      },
      errorResponse => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );

    // get Question Randomization Option List
    this.restService.ApiEndPointUrlOrKey = Exam.getQuestionRandomizationOptionList;
    this.restService.callApi().subscribe(
      successResponse => {
        this.questionRandomizationOptionList = successResponse.Question;
      },
      errorResponse => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );

    // get Question View Option List
    this.restService.ApiEndPointUrlOrKey = Exam.getQuestionViewOptionList;
    this.restService.callApi().subscribe(
      successResponse => {
        this.questionViewOptionList = successResponse.Question;
      },
      errorResponse => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );

  }

  multiLangComp(c1: any, c2: any): any {
    return c1 && c2 ? c1.guid === c2.guid : c1 === c2;
  }

  multisubjectComp(c1: any, c2: any): any {
    return c1 && c2 ? c1.guid === c2.guid : c1 === c2;
  }

  public initializeFields() {
    this.addExamFormGroup = new FormGroup({
      exam_number: new FormControl({ value: '', disabled: true }),
      languages: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      exam_type_guid: new FormControl('', Validators.required),
      shifts: new FormControl('', Validators.required),
      primary_language_guid: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      dual_show_primary: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      subjects: new FormControl('', Validators.required),
      sections: new FormControl('', Validators.required),
      grade_type_guid: new FormControl('', Validators.required),
      duration_uom_guid: new FormControl('', Validators.required),
      negative_marking: new FormControl('0', Validators.required),
      no_of_city_priority: new FormControl("", Validators.required),
      exam_public_label: new FormControl({ value: "", disabled: true }),
      question_option_sequence: new FormControl("", Validators.required),
      question_paper_randomization: new FormControl("", Validators.required),
      full_question_paper: new FormControl("", Validators.required),
    });
  }

  // setting the value in existing exam
  public loadsFields(result: any) {

    this.newUser = false;
    this.Id = result['exam_setup'][0]['id'];
    this.exam_num.emit(result.exam_setup[0].exam_number);
    this.addExamFormGroup.patchValue({
      exam_number: result.exam_setup[0].exam_number,
      code: result.exam_setup[0].code,
      name: result.exam_setup[0].name,
      description: result.exam_setup[0].description,
      duration: result.exam_setup[0].duration,
      sections: result.exam_setup[0].sections,
      languages: result.languages,
      exam_type_guid: result.exam_setup[0].exam_type_guid,
      shifts: result.exam_setup[0].shifts,
      primary_language_guid: result.exam_setup[0].primary_language_guid,
      dual_show_primary: result.exam_setup[0].dual_show_primary,
      subjects: result.subjects,
      duration_uom_guid: result.exam_setup[0].duration_uom_guid,
      negative_marking: result.exam_setup[0].negative_marking,
      grade_type_guid: result.exam_setup[0].grade_type_guid,
      no_of_city_priority: result.exam_setup[0].no_of_city_priority,
      exam_public_label: result.exams[0].exam_public_label,
      question_option_sequence: result.exam_setup[0].question_option_sequence,
      question_paper_randomization: result.exam_setup[0].question_paper_randomization,
      full_question_paper: result.exam_setup[0].full_question_paper
    });
    // this.subjectList = result.subjects; ///verify
    this.loadPrimaryLanguage(result.languages);
    this.addExamFormGroup.disable();
  }

  loadPrimaryLanguage(language) {
    this.primLangList = language;
  }

  setPrimaryLanguage(language) {
    try {
      this.languageList.forEach((element) => {
        if (element.guid == language) {
          this.primLangList.push(element);
        }
      });
    }
    catch (e) {
      // language list empty
      console.log("language list empty");
    }
  }

  private getParams() {
    let params = this.addExamFormGroup.getRawValue();
    return params;
  }

  valueChange(event: any) {
    this.primLangList = [];
    this.primLangList = event;
  }

  public formSubmit() {

    if (this.addExamFormGroup.valid === false) {
      let form = document.getElementById('addExamForm');
      form.classList.add('was-validated');
    } else if (this.addExamFormGroup.valid === true) {
      let params = this.getParams();

      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        //// API call for new exam
        if (this.newUser) {
          params['exam_id'] = this.examId;
          var keyData = [
            {
              "name": "examId",
              "value": this.examId
            },
          ];
          this.restService.ApiEndPointUrlOrKey = Exam.saveExam;
          this.restService.ApiEndPointMehod = RestMethods.Post;
          this.restService.HttpPostParams = params;
          this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
          this.restService.callApi(keyData)
            .subscribe(sucessResponse => {
              this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to next tab').subscribe(result => {
                if (result == true) { // OK = true for redirection
                  this.messageService.hideModal();
                  this.nextTab.emit(1); // Select next tab
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
        else {
          //// API call to update the exam
          params['id'] = this.Id;
          params['exam_id'] = this.examId;
          var keyData = [
            {
              "name": "examId",
              "value": this.examId
            },
            {
              "name": "examSetupId",
              "value": this.Id
            }
          ];
          this.restService.ApiEndPointUrlOrKey = Exam.updateExam;
          this.restService.ApiEndPointMehod = RestMethods.Put;
          this.restService.HttpPostParams = params;
          this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
          this.restService.callApi(keyData)
            .subscribe(sucessResponse => {
              this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to next tab').subscribe(result => {
                if (result == true) { // OK = true for redirection
                  this.messageService.hideModal();
                  this.nextTab.emit(1); // Select next tab
                  this.SharedService.ExamId.next(this.examId);
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
  }

  public reset() {
    let form = document.getElementById('addExamForm');
    form.classList.remove('was-validated');
    this.addExamFormGroup.reset();
    this.initializeFields();
    let params = this.getParams();
  }


}
