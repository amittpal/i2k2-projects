import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from "@angular/core";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/exam-services/rest/global-rest.service";
import { AuthService } from "src/app/exam-services/auth/auth.service";
import { Exam, HandelError } from "src/app/exam-shared/enumrations/app-enum.enumerations";
import { forkJoin } from "rxjs";
import { Router } from '@angular/router';
import { QuestionAnswerResponse } from './answer-type/question-answer-response.class';
import { ExamHeaderService } from '../layout/exam-header/exam-header.service';
import { ExamQuestionsSummary } from './models/exam-question.models';
import { interval } from 'rxjs'
import { ServerStatusDetails } from "src/app/exam-shared/classes/server-status-details.class";

@Component({
  selector: "app-exam-dashboard",
  templateUrl: "./exam-dashboard.component.html",
  styleUrls: ["./exam-dashboard.component.scss"],
})
export class ExamDashboardComponent implements OnInit, AfterViewChecked {

  interval;
  remainingUserTimeInSeconds: number = 0;
  questionType: string = "";
  questionStatusCode: string = "";
  questionDetails: any;
  languagesList = [];
  sectionsList = [];
  selectedLanguageGuid: string = "";
  selectedSectionGuid: string = "";
  selectedQuestionGuid: string = "";
  selectedStatusGuid: string = "";
  examGuid: string = "";
  selectedSectionName: string = "";
  candidateInformation: any;
  answerSubmitted: boolean;
  studentGuid: any;
  forwardNavigation = false;
  backwardNavigation = false;
  questionMarkToReviewStatus = false;
  clearFormStatus = false;
  examName: string;
  subjectName: string;
  sectionName: string;
  viewAnswerSummary = false;
  fullQuestionView = false;
  selectSection = false;
  public answerSummary: any;
  selectedSectionIndex: number = 0;
  examQuestionSummaryJson: ExamQuestionsSummary;
  examQuestionsSummary: ExamQuestionsSummary;
  examSectionLanguageStatus = [];
  currentSectionStatusList = [];
  currentSelectedSectionStatusList = [];
  markToReviewClick = false;
  hasAnswerChanged = false;
  hasUserClosedModal = false;
  isServerOffline = false;
  isExamResumed = true;
  //initial valus for exam status
  examServeStatusDetails: ServerStatusDetails = {
    isServerOnline: true,
    examOfflineTimeInSeconds: 0,
    hasExamOfflineTimeExceeded: false
  }
  bulkUploadAnswers: QuestionAnswerResponse[] = [];
  unansweredQuestionsArray: any = [];
  examType="";
  constructor(
    private messageService: MessageService,
    private restService: GlobalRestService,
    private authService: AuthService,
    private router: Router,
    private headerService: ExamHeaderService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {

    this.getLanguagesList();
    this.headerService.instructions.next(false);
    this.headerService.exam_config.subscribe(value => {
      if (value) {
        this.headerService.pageTitle.next(value.exam_name);
        this.examName = value.exam_name;
      }
    });

    //subscribing to server status update
    this.headerService.serverDetailsSubject.subscribe((serverStatusDetails: ServerStatusDetails) => {
      if (Object.keys(serverStatusDetails).length > 0) {
        this.examServeStatusDetails = {
          hasExamOfflineTimeExceeded: serverStatusDetails.hasExamOfflineTimeExceeded,
          isServerOnline: serverStatusDetails.isServerOnline,
          examOfflineTimeInSeconds: serverStatusDetails.examOfflineTimeInSeconds
        }
        //show offline time exceeded message screen
        if (this.examServeStatusDetails.hasExamOfflineTimeExceeded) {
          this.isExamResumed = false;
        }
        //bulk update when sever comes back online
        if (this.examServeStatusDetails.isServerOnline) {
          this.bulkAnswerUpdateInDb();
        }
        else {
          //enabling dashboard screen if user is in summary page
          if (this.viewAnswerSummary) {
            this.viewAnswerSummary = false;
          }

        }

      }
    });

    //calling local heartbeat in every 20 seconds.
    this.updateHeartBeat();
    const localHeartbeatIntarval = interval(20000);
    this.headerService.serverHeartbeatSubscription = localHeartbeatIntarval.subscribe(val => this.updateHeartBeat());
  }

  updateHeartBeat() {
    this.restService.ApiEndPointUrlOrKey = Exam.updateHeartbeat;
    this.restService.ShowLoadingSpinner = false;

    this.restService.HttpPostParams = {
      candidate_guid: this.authService.getUserUniqueId(),
      "desktop_system_id": "101",
      "registration_id": this.authService.getRegistrationId(),
      "desktop_last_heartbeat": "",
      "app_last_heartbeat": new Date(),
      "registration_activity_update": new Date(),
      "heartbeat_type": "heartbeat",
      "start_time": new Date(),
      "end_time": "",
      "last_activity_update": new Date(),
      "questions": this.unansweredQuestionsArray,
      // "questions_guid": this.unansweredQuestionsArray,
      "is_server_online": this.examServeStatusDetails.hasExamOfflineTimeExceeded
    }
    this.restService.callApi().subscribe(successResponse => {
      //clear unanswered array only when server is online.
      if (this.examServeStatusDetails.isServerOnline) {
        this.unansweredQuestionsArray = [];
      }
      console.log(new Date() + ': ' + successResponse)
    }, errorResponse => {
      console.error(new Date() + ': ' + errorResponse.httpErrorResponse);
    })
  }

  //#region  Language Functions
  getLanguagesList() {

    this.restService.ApiEndPointUrlOrKey = Exam.getLanguageList;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    const languagesList = this.restService.callApi();

    let keyData = [
      {
        name: "userGuid",
        value: this.authService.getUserUniqueId(),
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getCandidateInformation;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.HttpPostParams = {};
    const candidateDetails = this.restService.callApi(keyData);

    forkJoin([languagesList, candidateDetails]).subscribe((sucessResponse) => {

      this.languagesList = sucessResponse[0].language;
      this.candidateInformation = sucessResponse[1].candidate_info[0];
      this.headerService.exam_config.next(sucessResponse[1].candidate_info[0]);
      this.headerService.examDetails.next(true);
      this.examGuid = sucessResponse[1].candidate_info[0].exam_guid;

      this.selectedLanguageGuid = localStorage.getItem('defaultLanguageGuid');
      this.getAllQuestionsJson();
    }, (errorResponse) => {
      this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
        this.messageService.hideModal();

      })
    })
  }

  setQuestionStatusListByLanguageGuid() {
    if (this.languagesList.length > 0) {
      this.languagesList.forEach(element => {
        let status = { language_guid: "", exam_section_status: [] };
        status.language_guid = element.guid;
        status.exam_section_status = JSON.parse(JSON.stringify(this.examQuestionsSummary.section_status));
        this.examSectionLanguageStatus.push(status);
      });
      if (this.examSectionLanguageStatus.length > 0) {
        this.setCurrentSectionStatusList();
      }
    }
  }

  onLanguageChange(event: any) {
    if (event.target.value) {
      this.selectedLanguageGuid = event.target.value;
      this.setCurrentSectionStatusList();

      let selectedQuestionNumber = this.questionDetails.question[0].question_number;
      if (selectedQuestionNumber) {
        this.questionDetails = this.examQuestionsSummary.question_summary
          .find(q => q.question[0].question_number === selectedQuestionNumber &&
            q.question[0].language_guid === this.selectedLanguageGuid);

        this.questionStatusCode = this.questionDetails.question[0].question_status_type;
        this.selectedQuestionGuid = this.questionDetails.question[0].question_guid;
        this.setQuestionStatusMarkToReview(this.questionStatusCode);

        let questionStatusList = Object.assign(this.examQuestionSummaryJson.section_questions_status)
        let filteredStatus = questionStatusList.filter
          (s => s.section_guid == this.selectedSectionGuid
            //&& s.language_guid === this.selectedLanguageGuid
          );
        this.examQuestionsSummary.section_questions_status = filteredStatus;
      }
    }
  }

  setCurrentSectionStatusList() {
    const statusList = [...this.examSectionLanguageStatus];
    const status = statusList.find(s => s.language_guid === this.selectedLanguageGuid);
    this.currentSectionStatusList = status.exam_section_status;
  }

  //#endregion

  getAllQuestionsJson() {

    let keyData = [
      {
        name: "examGuid",
        value: this.authService.getExamGuid()
      },
      {
        name: "candidateGuid",
        value: this.authService.getRegistrationId()
      }
    ];
    //get all exam questions
    this.restService.ApiEndPointUrlOrKey = Exam.getAllExamQuestions;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData).subscribe((successResponse) => {
      
      this.examType=successResponse.exam_info[0].exam_type.replace(/ +/g, "");
      console.log(this.examType);

      this.examQuestionSummaryJson = successResponse;
      let examJson = { ...this.examQuestionSummaryJson };
      this.setQuestionNumber();
      this.examQuestionsSummary = examJson;      
      this.questionDetails = examJson.question_summary[0];
      this.questionType = examJson.question_summary[0].question[0].answer_type_code;
      this.subjectName = examJson.question_summary[0].question[0].subject;
      this.sectionName = examJson.question_summary[0].question[0].section_name;
      this.sectionsList = examJson.sections;
      this.selectedSectionGuid = examJson.sections[0].section_guid;
      this.selectedSectionIndex = 0;
      this.questionStatusCode = examJson.question_summary[0].question[0].question_status_type;
      this.selectedQuestionGuid = examJson.question_summary[0].question[0].question_guid;
      this.setQuestionStatusListByLanguageGuid();
      this.updateQuestionStatus();
      this.setQuestionStatusMarkToReview(this.questionStatusCode);
      this.startTimer();
    }, (errorResponse) => {
      //localStorage.removeItem('userDetails');
      //clearInterval(this.interval);
      //this.headerService.timerValue.next("");
      this.examQuestionsSummary = undefined;
      this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
        this.messageService.hideModal();
        //this.router.navigateByUrl('/login');
      })
    })
  }

  setQuestionNumber() {
    this.examQuestionSummaryJson.question_summary.forEach((question) => {
      let sectionQuestion = this.examQuestionSummaryJson.section_questions_status
        .find(s => s.question_guid === question.question[0].question_guid);
      if (sectionQuestion) {
        sectionQuestion.question_number = question.question[0].question_number;
      }
    });
  }



  getQuestionDetails() {
    //filter by question
    if (this.selectedQuestionGuid) {
      let selectedQuestionNumber = this.examQuestionsSummary.question_summary
        .find(q => q.question[0].question_guid === this.selectedQuestionGuid).question[0].question_number;

      // let selectedQuestion = this.examQuestionsSummary.question_summary
      //   .find(q => q.question[0].question_guid === this.selectedQuestionGuid
      //     && q.question[0].section_guid === this.selectedSectionGuid
      //     && q.question[0].language_guid === this.selectedLanguageGuid);

      let selectedQuestion = this.examQuestionsSummary.question_summary
        .find(q => q.question[0].question_number === selectedQuestionNumber
          && q.question[0].section_guid === this.selectedSectionGuid
          && q.question[0].language_guid === this.selectedLanguageGuid);

      if (selectedQuestion) {
        this.questionDetails = selectedQuestion;
        this.questionType = this.questionDetails.question[0].answer_type_code;
        this.questionStatusCode = this.questionDetails.question[0].question_status_type;
        this.selectedQuestionGuid = this.questionDetails.question[0].question_guid;
        this.subjectName = this.questionDetails.question[0].subject;
        this.sectionName = this.questionDetails.question[0].section_name;

        this.setQuestionStatusMarkToReview(this.questionStatusCode);
      }
    }
    //filter by section
    else if (!this.selectedQuestionGuid && this.selectedSectionGuid) {
      let selectedSectionQuestionsList = this.examQuestionSummaryJson.question_summary
        .filter(q => q.question[0].section_guid === this.selectedSectionGuid);
      if (selectedSectionQuestionsList) {
        this.examQuestionsSummary.question_summary = selectedSectionQuestionsList;
        this.questionDetails = selectedSectionQuestionsList.filter(q => q.question[0].language_guid === this.selectedLanguageGuid)[0]; //--- select question by language guid
        this.questionType = this.questionDetails.question[0].answer_type_code;
        this.questionStatusCode = this.questionDetails.question[0].question_status_type;
        this.selectedQuestionGuid = this.questionDetails.question[0].question_guid;
        this.setQuestionStatusMarkToReview(this.questionStatusCode);
      }
    }
    this.updateQuestionStatus();
  }

  updateQuestionStatus() {
    //setting question as visited if not
    if (this.questionDetails.question[0].question_status_type === "QuesNoVisit"
      && this.questionMarkToReviewStatus !== true) {

      this.questionDetails.question[0].question_status_type = "QuesVisited";
      this.questionDetails.question[0].question_status_css_tag = "badge-warning";
      this.questionDetails.question[0].status_name = "Unanswered";

      let status = this.examQuestionsSummary.section_questions_status
        .find(q => q.question_guid === this.selectedQuestionGuid);
      status.status_name = "Unanswered";
      status.status_type = "QuesVisited";
      status.status_css_tag = "badge-warning";

      //adding unanswered question in array to update in server
      const questionGuid = this.questionDetails.question[0].question_guid;
      if (this.unansweredQuestionsArray.includes(questionGuid)) {
        const index = this.unansweredQuestionsArray.indexOf(questionGuid);
        if (index > -1) {
          this.unansweredQuestionsArray.splice(index, 1);
        }
      }
      else {
        this.unansweredQuestionsArray.push({
          "question_guid": questionGuid,
          "section_guid": this.questionDetails.question[0].section_guid,
          "sequence_number": this.questionDetails.question[0].question_number,
          "status_guid": this.questionDetails.question[0].status_guid
        })
        // this.unansweredQuestionsArray.push(questionGuid)
      }

      this.updateSectionStatus("QuesNoVisit", "QuesVisited");
    }
    //updating totals in question status
  }



  onAnswerSubmit(answerResponse: QuestionAnswerResponse) {
    if (answerResponse) {
      //status to unreview or review a question
      if (this.markToReviewClick) {
        answerResponse.value_changed = true;
      }

      this.clearFormStatus = false;
      //to set question as mark to review but invalid answer
      if (
        this.questionMarkToReviewStatus === true
        && answerResponse.valid_response === false
        && this.questionStatusCode !== 'QuesMarkReview'
      ) {

        const formattedMessage = { "http_status": "401", "data": [{ "type": "APP_ERROR", "attributes": { "message_type": "APP_ERROR", "message": ["Answer is required"] } }] }
        this.messageService.okRedirectModal(formattedMessage, 'ERROR', 'OK').subscribe(result => {
          this.messageService.hideModal();
        });

        setTimeout((func) => {
          this.answerSubmitted = false;

        }, 100);
        this.questionMarkToReviewStatus = false;
        return;
      }

      //for invalid response from user
      if (this.questionMarkToReviewStatus === false
        && answerResponse.valid_response === false
        && answerResponse.value_changed === true) {
        setTimeout((func) => {
          this.answerSubmitted = false;
        }, 100);

        this.messageService.confirm(["Do you want to proceed with incomplete answer?"],
          "Confirmation", "Yes", "NO").subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              this.setQuestionNavigation();
            }
            else {
              this.messageService.hideModal();
            }
          })
        return;
      }

      if (
        answerResponse.value_changed === false
        && this.questionMarkToReviewStatus !== true
      ) {
        this.setQuestionNavigation();
        setTimeout((func) => {
          this.answerSubmitted = false;
        }, 100);
        return;
      }

      if (
        answerResponse.value_changed === false
        && this.questionMarkToReviewStatus === true
        && this.markToReviewClick === false
      ) {
        this.setQuestionNavigation();
        setTimeout((func) => {
          this.answerSubmitted = false;
        }, 100);
        return;
      }

      if (!answerResponse.answers) {
        setTimeout((func) => {
          this.answerSubmitted = false;
        }, 100);
        return;
      }

      //this.updateAnswerInLocalJson(answerResponse);

      //updating answer in database
      if (this.questionMarkToReviewStatus === true) {
        answerResponse.mark_to_review = "1";
      }
      else {
        answerResponse.mark_to_review = "0";
      }
      if (this.questionMarkToReviewStatus === true && this.markToReviewClick == false) {
        this.updateAnswerInLocalJson(answerResponse);
        this.answerSubmitted = false;
        this.questionMarkToReviewStatus = false;
        this.setQuestionNavigation();
      }
      else {
        //save answer in db when exam server is online
        if (this.examServeStatusDetails.isServerOnline) {
          this.restService.ApiEndPointUrlOrKey = Exam.addQuestionAnswer;
          this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
          this.restService.ShowLoadingSpinner = true;
          //deep copy reference
          const localAnswerResponse = JSON.parse(JSON.stringify(answerResponse));
          //Object.assign({},answerResponse);
          localAnswerResponse.answers[0].description = "";
          this.restService.HttpPostParams = localAnswerResponse;
          //this.onlineStatusService.clearTimerInterval();
          this.restService.callApi().subscribe(
            (sucessResponse) => {
              this.updateAnswerInLocalJson(answerResponse);
              this.answerSubmitted = false;
              this.questionMarkToReviewStatus = false;
              this.setQuestionNavigation();
            },
            (errorResponse) => {

              this.answerSubmitted = false;
              this.questionMarkToReviewStatus = false;
              this.clearFormStatus = true;

              this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK')
                .subscribe(result => {
                  this.messageService.hideModal();
                });

              //const errorMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
              // if (errorMessage == "Exam Server is offline.") {
              //   //displaying error if server is offline
              //   if (this.examServeStatusDetails.isServerOnline === false) {
              //     this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
              //       this.messageService.hideModal();
              //     })
              //   }
              // }
              // else {
              //   this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
              //     this.messageService.hideModal();
              //   })
              // }

            }
          );
        }
        else {
          //update answer locally 
          this.updateAnswerInLocalJson(answerResponse);
          this.answerSubmitted = false;
          this.questionMarkToReviewStatus = false;
          this.setQuestionNavigation();
        }

      }
    } else {
      setTimeout((func) => {
        this.answerSubmitted = false;
        this.questionMarkToReviewStatus = false;
      }, 100);
    }
    //set next prev button text default
    this.hasAnswerChanged = false;
    this.markToReviewClick = false;
  }



  updateAnswerInLocalJson(answerResponse: any) {
    //update answer in local questions json
    let currentQuestion = this.examQuestionsSummary.question_summary
      //.find(q => q.question[0].question_guid === answerResponse.question_guid);
      .find(q => q.question[0].question_number === answerResponse.question_number
        && q.question[0].language_guid === this.selectedLanguageGuid);
    if (currentQuestion) {
      currentQuestion.answers = answerResponse.answers;

      this.questionDetails = currentQuestion;
      if (this.questionMarkToReviewStatus === true) {
        this.questionDetails.question[0].question_status_type = "QuesMarkReview";
        this.questionDetails.question[0].question_status_css_tag = "badge-info";
        let status = this.examQuestionsSummary.section_questions_status
          .find(q => q.question_number === answerResponse.question_number
            && q.language_guid === this.selectedLanguageGuid);
        //.find(q => q.question_guid === answerResponse.question_guid);
        this.updateSectionStatus(status.status_type, "QuesMarkReview");
        // this.forwardNavigation=true;
        status.status_name = "To Review";
        status.status_type = "QuesMarkReview"
        status.status_css_tag = "badge-info";

      }
      else {
        this.questionDetails.question[0].question_status_type = "QuesAnswered";
        this.questionDetails.question[0].question_status_css_tag = "badge-success";
        let status = this.examQuestionsSummary.section_questions_status
          .find(q => q.question_number === answerResponse.question_number
            && q.language_guid === this.selectedLanguageGuid);
        this.updateSectionStatus(status.status_type, "QuesAnswered");
        status.status_name = "Answered";
        status.status_type = "QuesAnswered";
        status.status_css_tag = "badge-success";
      }

      //update status to save question later on db when server is back online.      
      if (this.examServeStatusDetails.isServerOnline === false) {

        const response: QuestionAnswerResponse = {
          candidate_guid: answerResponse.candidate_guid,
          question_guid: answerResponse.question_guid,
          question_number: answerResponse.question_number,
          primary_question_guid: answerResponse.primary_question_guid,
          mark_to_review: answerResponse.mark_to_review,
          language_guid: answerResponse.language_guid,
          section_guid: answerResponse.section_guid,
          answers: answerResponse.answers,
          valid_response: answerResponse.valid_response,
          value_changed: answerResponse.value_changed,
        }

        this.bulkUploadAnswers.forEach((currentValue, index) => {
          if (currentValue.question_guid == response.question_guid) {
            this.bulkUploadAnswers.splice(index, 1);
          }
        });
        this.bulkUploadAnswers.push(response);
      }

      //remove question from unanswered array if exists    
      const questionIndex = this.unansweredQuestionsArray.indexOf(this.questionDetails.question[0].question_guid);
      if (questionIndex > -1) {
        this.unansweredQuestionsArray.splice(questionIndex, 1);
      }

    }
    //end
  }

  bulkAnswerUpdateInDb() {

    const messages = ["Exam server is online. You can resume your exam."];
    const successMessage = { "http_status": "200", "data": [{ "type": "VALID_RETURN", "attributes": { "message_type": "", "message": messages } }] };
    this.hasUserClosedModal = false;

    if (this.bulkUploadAnswers.length > 0 || this.unansweredQuestionsArray.length > 0) {
      this.setLoaderVisibility(true);
      //remove question from unanswered if it already exist in bulk array
      this.unansweredQuestionsArray.forEach((guid, index) => {
        const questionIndex = this.bulkUploadAnswers.findIndex(q => q.question_guid === guid);
        if (questionIndex > -1) {
          this.unansweredQuestionsArray.splice(index, 1);
        }
      });

      const httpPostParams = {
        "offline_exam_duration": this.examServeStatusDetails.examOfflineTimeInSeconds,
        "exam": this.bulkUploadAnswers,
        "questions": this.unansweredQuestionsArray,
        // "questions_guid": this.unansweredQuestionsArray,
        "candidate_guid": this.authService.getUserUniqueId()
      }
      this.restService.ApiEndPointUrlOrKey = Exam.bulkUpdateAnswers;
      this.restService.ShowLoadingSpinner = true;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.HttpPostParams = httpPostParams;
      this.restService.callApi().subscribe(
        (successResponse) => {
          this.setLoaderVisibility(false);

          if (this.remainingUserTimeInSeconds > 0) {
            const submittedQuestionsStatus = successResponse.question_summary;
            //updating answers submit status in local json
            if (submittedQuestionsStatus.length > 0) {
              submittedQuestionsStatus.forEach(element => {
                let questionDetails = this.examQuestionsSummary.question_summary.find(q => q.question[0].question_guid === element.question_guid);
                if (questionDetails) {
                  questionDetails.question[0].is_answer_saved_in_db = element.is_answer_saved_in_db;
                }
              });
            }
            //// updating timer with latest time value from db                                
            this.messageService.okRedirectModal(successMessage, 'SUCCESS', 'OK').subscribe(result => {
              this.bulkUploadAnswers = [];
              this.unansweredQuestionsArray = [];
              this.remainingUserTimeInSeconds = successResponse.exam_duration.allowed_duration_in_seconds;
              this.hasUserClosedModal = true;
              //selecting section after coming from offline page
              // if (this.isExamResumed === false) {
              //   this.selectSection = true;
              // }
              this.isExamResumed = true;
              this.messageService.hideModal();

            });

            //auto close modal after 30 second if user did not close modal
            setTimeout(() => {
              if (this.hasUserClosedModal === false) {
                this.bulkUploadAnswers = [];
                this.unansweredQuestionsArray = [];
                this.remainingUserTimeInSeconds = successResponse.exam_duration.allowed_duration_in_seconds;
                this.isExamResumed = true;
                this.hasUserClosedModal = true;
                this.messageService.hideModal();

              }
            }, 30000);


          }
          else {
            //auto submit exam if exam time is over
            this.submitExam();
          }
        },
        (errorResponse) => {
          this.setLoaderVisibility(false);
          this.bulkUploadAnswers = [];
          this.unansweredQuestionsArray = [];
          this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
            this.messageService.hideModal();
            this.isExamResumed = true;
            //reloading all question json for failed bulk upload to maintain questions initial state
            this.getAllQuestionsJson();
          });
        });
    }
    else {
      //no question updated locally in offline mode.      
      this.messageService.okRedirectModal(successMessage, 'SUCCESS', 'OK').subscribe(result => {
        this.messageService.hideModal();
        this.isExamResumed = true;
        this.hasUserClosedModal = true;
        //auto submit exam if exam time is over
        if (
          this.remainingUserTimeInSeconds <= 0
          && this.examQuestionsSummary.question_summary.length > 0) {
          this.submitExam();
        }
      });

      //auto close modal after 30 second if user did not close modal
      setTimeout(() => {
        if (this.hasUserClosedModal === false) {
          this.isExamResumed = true;
          this.hasUserClosedModal = true;
          this.messageService.hideModal();
        }
      }, 30000);
    }
  }

  setQuestionNavigation() {
    if (this.forwardNavigation === true) {
      this.onNextQuestionClick();
    }
    else if (this.backwardNavigation === true) {
      this.onPreviousQuestionClick();
    }
    else {
      this.getQuestionDetails();
    }
    this.forwardNavigation = false;
    this.backwardNavigation = false;
  }

  onNextQuestionClick() {
    let sectionQuestionsCount = this.examQuestionsSummary.section_questions_status
      .filter(s => s.section_guid === this.selectedSectionGuid && s.language_guid === this.selectedLanguageGuid).length;
    let currentQuestionIndex = this.examQuestionsSummary.section_questions_status
      .filter(s => s.section_guid === this.selectedSectionGuid && s.language_guid === this.selectedLanguageGuid)
      .findIndex(q => q.question_number === this.questionDetails.question[0].question_number) + 1;
    //.findIndex(q=>q.question_guid === this.questionDetails.question[0].question_guid)+1;

    currentQuestionIndex++;
    if (currentQuestionIndex > sectionQuestionsCount) {
      //for last section
      let index = this.examQuestionsSummary.sections.findIndex(s => s.section_guid === this.selectedSectionGuid);
      if (index + 1 === this.examQuestionsSummary.sections.length) {
        //displaying summary if user is on last question of last section        
        this.onFinishExamClick();
        return;
      }

      this.selectedSectionIndex++;
      this.selectedSectionGuid = this.examQuestionsSummary.sections[this.selectedSectionIndex].section_guid;
      this.selectSection = true;
      this.selectedQuestionGuid = "";
      return;
    }


    if (this.questionDetails.question[0].question_number) {
      let nextQuestionNumber: number = parseInt(this.questionDetails.question[0].question_number);
      nextQuestionNumber++;
      let nextQuestion = this.examQuestionsSummary.question_summary.find(q => q.question[0].question_number === String(nextQuestionNumber));
      if (nextQuestion) {
        this.selectedQuestionGuid = nextQuestion.question[0].question_guid;
      }
    }
    else {
      //if user clicks next after last question
      this.viewAnswerSummary = true;
      this.headerService.examDetails.next(false);
      this.sectionName = "";
      this.getAnswerSummary();
      return;
    }

    this.getQuestionDetails();
  }

  onPreviousQuestionClick() {

    let currentQuestionIndex = this.examQuestionsSummary.section_questions_status
      .filter(s => s.section_guid === this.selectedSectionGuid)
      .findIndex(q => q.question_number === this.questionDetails.question[0].question_number);
    if (currentQuestionIndex === 0) {
      this.selectedSectionIndex--;
      this.selectedSectionGuid = this.examQuestionsSummary.sections[this.selectedSectionIndex].section_guid;
      this.selectSection = true;
      let selectedSectionQuestions = this.examQuestionSummaryJson.section_questions_status.filter(s => s.section_guid === this.selectedSectionGuid)
      this.examQuestionsSummary.question_summary = Object.assign(this.examQuestionSummaryJson.question_summary);
      this.selectedQuestionGuid = selectedSectionQuestions[selectedSectionQuestions.length - 1].question_guid;
      return;
    }

    if (this.questionDetails.question[0].question_number) {
      let nextQuestionNumber: number = parseInt(this.questionDetails.question[0].question_number);
      nextQuestionNumber--;
      let nextQuestion = this.examQuestionsSummary.question_summary.find(q => q.question[0].question_number === String(nextQuestionNumber));
      this.selectedQuestionGuid = nextQuestion.question[0].question_guid;
      this.getQuestionDetails();

    }

  }

  onSectionClick(sectionDetails: any) {

    if (sectionDetails) {
      //enabling full question view
      if (sectionDetails.index === -1) {
        // this.examQuestionsSummary.question_summary = Object.assign(this.examQuestionSummaryJson.question_summary);

        let questionStatusList = Object.assign(this.examQuestionSummaryJson.section_questions_status)
        let filteredStatus = questionStatusList.filter
          (s => s.language_guid === this.selectedLanguageGuid);
        // ----- updated selected section status list
        let unansweredCount = 0;
        let answeredCount = 0;
        let noVisitCount = 0;
        let toReviewCount = 0;

        this.currentSelectedSectionStatusList = this.currentSectionStatusList;

        for (let i = 0; i < filteredStatus.length; i++) {
          for (let j = 0; j < this.currentSelectedSectionStatusList.length; j++) {
            if (filteredStatus[i].status_type === "QuesVisited" && this.currentSelectedSectionStatusList[j].status_type === "QuesVisited") {
              unansweredCount++;
            }
            if (filteredStatus[i].status_type === "QuesNoVisit" && this.currentSelectedSectionStatusList[j].status_type === "QuesNoVisit") {
              noVisitCount++;
            }
            if (filteredStatus[i].status_type === "QuesAnswered" && this.currentSelectedSectionStatusList[j].status_type === "QuesAnswered") {
              answeredCount++;
            }
            if (filteredStatus[i].status_type === "QuesMarkReview" && this.currentSelectedSectionStatusList[j].status_type === "QuesMarkReview") {
              toReviewCount++;
            }
            // console.log(i +'  '+ filteredStatus[i].status_type +'  '+ j +'  '+ this.currentSelectedSectionStatusList[j].status_type + ' - '+ this.currentSectionStatusList[j].no_of_questions)
          }
        };
        // for (let j = 0; j < this.currentSelectedSectionStatusList.length; j++) {
        //   if (this.currentSelectedSectionStatusList[j].status_type === "QuesVisited") {
        //     this.currentSelectedSectionStatusList[j].no_of_questions = unansweredCount;
        //   }
        //   if (this.currentSelectedSectionStatusList[j].status_type === "QuesNoVisit") {
        //     this.currentSelectedSectionStatusList[j].no_of_questions = noVisitCount;
        //   }
        //   if (this.currentSelectedSectionStatusList[j].status_type === "QuesAnswered") {
        //     this.currentSelectedSectionStatusList[j].no_of_questions = answeredCount;
        //   }
        //   if (this.currentSelectedSectionStatusList[j].status_type === "QuesMarkReview") {
        //     this.currentSelectedSectionStatusList[j].no_of_questions = toReviewCount;
        //   }
        // }

        this.examQuestionsSummary.question_summary = Object.assign(this.examQuestionSummaryJson.question_summary);

        for (let i = 0; i < this.examQuestionsSummary.question_summary.length; i++) {
          if (this.examQuestionsSummary.question_summary[i].question[0].question_status_type == "QuesVisited") {
            this.examQuestionsSummary.question_summary[i].question[0].status_css_tag = "badge-warning";
          }
          if (this.examQuestionsSummary.question_summary[i].question[0].question_status_type == "QuesNoVisit") {
            this.examQuestionsSummary.question_summary[i].question[0].status_css_tag = "badge";
          }
          if (this.examQuestionsSummary.question_summary[i].question[0].question_status_type == "QuesAnswered") {
            this.examQuestionsSummary.question_summary[i].question[0].status_css_tag = "badge-success";
          }
          if (this.examQuestionsSummary.question_summary[i].question[0].question_status_type == "QuesMarkReview") {
            this.examQuestionsSummary.question_summary[i].question[0].status_css_tag = "badge-info";
          }
        }

        this.currentSectionStatusList = this.currentSelectedSectionStatusList;
        // -----
        this.examQuestionsSummary.section_questions_status = filteredStatus;


        this.fullQuestionView = true;
        return;
      }

      this.fullQuestionView = false;
      this.selectedSectionIndex = sectionDetails.index;
      this.selectedSectionGuid = sectionDetails.sectionInfo.section_guid;
      this.selectedSectionName = sectionDetails.sectionInfo.section_name;
      this.sectionName = sectionDetails.sectionInfo.section_name;
      this.subjectName = sectionDetails.sectionInfo.subject_name;

      let questionStatusList = Object.assign(this.examQuestionSummaryJson.section_questions_status)
      let filteredStatus = questionStatusList.filter
        (s => s.section_guid == this.selectedSectionGuid);

      // ----- updated selected section status list
      let unansweredCount = 0;
      let answeredCount = 0;
      let noVisitCount = 0;
      let toReviewCount = 0;

      this.currentSelectedSectionStatusList = this.currentSectionStatusList;

      for (let i = 0; i < filteredStatus.length; i++) {
        for (let j = 0; j < this.currentSelectedSectionStatusList.length; j++) {
          if (filteredStatus[i].status_type === "QuesVisited" && this.currentSelectedSectionStatusList[j].status_type === "QuesVisited") {
            unansweredCount++;
          }
          if (filteredStatus[i].status_type === "QuesNoVisit" && this.currentSelectedSectionStatusList[j].status_type === "QuesNoVisit") {
            noVisitCount++;
          }
          if (filteredStatus[i].status_type === "QuesAnswered" && this.currentSelectedSectionStatusList[j].status_type === "QuesAnswered") {
            answeredCount++;
          }
          if (filteredStatus[i].status_type === "QuesMarkReview" && this.currentSelectedSectionStatusList[j].status_type === "QuesMarkReview") {
            toReviewCount++;
          }
          // console.log(i +'  '+ filteredStatus[i].status_type +'  '+ j +'  '+ this.currentSelectedSectionStatusList[j].status_type + ' - '+ this.currentSectionStatusList[j].no_of_questions)
        }
      };
      // for (let j = 0; j < this.currentSelectedSectionStatusList.length; j++) {
      //   if (this.currentSelectedSectionStatusList[j].status_type === "QuesVisited") {
      //     this.currentSelectedSectionStatusList[j].no_of_questions = unansweredCount;
      //   }
      //   if (this.currentSelectedSectionStatusList[j].status_type === "QuesNoVisit") {
      //     this.currentSelectedSectionStatusList[j].no_of_questions = noVisitCount;
      //   }
      //   if (this.currentSelectedSectionStatusList[j].status_type === "QuesAnswered") {
      //     this.currentSelectedSectionStatusList[j].no_of_questions = answeredCount;
      //   }
      //   if (this.currentSelectedSectionStatusList[j].status_type === "QuesMarkReview") {
      //     this.currentSelectedSectionStatusList[j].no_of_questions = toReviewCount;
      //   }
      // }

      this.currentSectionStatusList = this.currentSelectedSectionStatusList;
      // -----
      this.examQuestionsSummary.section_questions_status = filteredStatus;

      if (sectionDetails.questionGuid) {
        this.selectedQuestionGuid = sectionDetails.questionGuid;
      }
      else {
        this.selectedQuestionGuid = "";
      }
    }
    this.getQuestionDetails();
    setTimeout(() => { this.selectSection = false; }, 100);
  }

  onQuestionNumberClick(questionGuid: string) {
    if (questionGuid) {
      this.selectedQuestionGuid = questionGuid;
      this.getQuestionDetails();
    }
  }

  onFullQuestionNumberClick(questionGuid: string) {
    if (questionGuid) {
      let selectedSection = this.examQuestionsSummary.question_summary
        .find(s => s.question[0].question_guid === questionGuid);
      if (selectedSection) {
        this.selectedSectionGuid = selectedSection.question[0].section_guid;
        this.selectedQuestionGuid = questionGuid;
        this.fullQuestionView = false;
        this.selectSection = true;

      }
    }
  }

  onQuestionStatusClick(statusGuid: string) {
    if (statusGuid) {
      this.selectedStatusGuid = statusGuid;
      this.selectedQuestionGuid = "";
      this.getQuestionDetails();
    }
  }

  setQuestionStatusMarkToReview(questionStatusCode: string) {
    if (questionStatusCode === 'QuesMarkReview') {
      this.questionMarkToReviewStatus = true;
    }
    else {
      this.questionMarkToReviewStatus = false;
    }
  }

  onMarkToReviewClick() {
    this.questionMarkToReviewStatus = true;
    this.markToReviewClick = true;
    this.answerSubmitted = true;
  }

  onMarkToUnreviewClick() {

    this.questionMarkToReviewStatus = false;
    this.markToReviewClick = true;
    this.answerSubmitted = true;
    /** question  review and unreview  have common method onAnswerSubmit()   */
  }



  onNextOrPreviousClick(forwardNavigation: boolean, backwardNavigation: boolean) {

    if (forwardNavigation === true) {
      this.forwardNavigation = true;
    }
    else if (backwardNavigation === true) {
      this.backwardNavigation = true;
    }

    this.answerSubmitted = true;
  }

  onExamSubmitClick() {
    this.messageService.confirm(["Are you sure you want to submit this exam?"], "Confirmation", "Yes", "NO").subscribe(result => {
      if (result == true) {
        this.messageService.hideModal();
        this.submitExam();
      }
      else {
        this.messageService.hideModal();
      }
    });
  }

  onExamComplete(status: boolean) {
    if (status === true) {
      this.submitExam();
    }
  }

  submitExam() {
    let keyData = [
      {
        "name": "candidateGuid",
        "value": this.authService.getUserUniqueId()
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Exam.submitExam;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        clearInterval(this.interval);
        this.headerService.timerValue.next("");
        this.examQuestionsSummary = undefined;
        if (this.headerService.serverHeartbeatSubscription) {
          this.headerService.serverHeartbeatSubscription.unsubscribe();
        }
        this.router.navigateByUrl('/exam/finished');
        console.log("exam time out")

        //updating custom message
        const successMessage = ["Your Exam was sucessfully submitted.", "Your Exam is locked and you will not be able to resume.", "You will need your exam invigilator's permission to leave the examination room."];
        sucessResponse.data[0].attributes.message = successMessage;
        this.messageService
          .okRedirectModal(sucessResponse, 'SUCCESS', 'ok')
          .subscribe(result => {
            this.messageService.hideModal();
            this.router.navigate(["login"])
          });
      },
      (errorResponse) => {
        this.messageService.hideModal();
        this.answerSubmitted = false;
        this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK')
          .subscribe(result => {
            this.messageService.hideModal();
          })
      }
    );
  }

  onClearClick() {
    this.clearFormStatus = false;
    this.messageService.confirm(['Your saved answer for this question will be deleted,', 'are you sure you want to clear?'], 'Confirm', 'Yes', 'No', 'confirm').subscribe(result => {
      if (result == true) {
        if (this.examServeStatusDetails.isServerOnline) {
          this.messageService.hideModal();
          this.restService.ApiEndPointUrlOrKey = Exam.clearQuestionAnswers;
          this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
          this.restService.HttpPostParams = {
            candidate_guid: this.authService.getUserUniqueId(),
            language_guid: this.selectedLanguageGuid,
            section_guid: this.selectedSectionGuid,
            question_guid: this.selectedQuestionGuid,
            primary_question_guid: this.questionDetails.question[0].question_guid
          };

          this.restService.ShowLoadingSpinner = true;
          //this.onlineStatusService.clearTimerInterval();
          this.restService.callApi().subscribe((successResponse) => {
            this.clearQuestionAnswerLocal();
          },
            (errorResponse) => {
              this.clearFormStatus = false;
              this.hasAnswerChanged = false;
              const errorMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
              if (errorMessage == "Exam Server is offline.") {
                //displaying error if server is offline
                if (this.examServeStatusDetails.isServerOnline === false) {
                  this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
                    this.messageService.hideModal();
                  })
                }
              }
              else {
                this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
                  this.messageService.hideModal();
                })
              }
            }
          );
        }
        else {
          this.clearQuestionAnswerLocal();
          this.messageService.hideModal();
        }
      }
      else {
        this.messageService.hideModal();
        this.clearFormStatus = false;
      }
    }
    )
  }
  clearQuestionAnswerLocal() {

    this.questionDetails.question[0].question_status_type = "QuesVisited";
    this.questionDetails.question[0].question_status_css_tag = "badge-warning";
    let status = this.examQuestionsSummary.section_questions_status
      .find(q => q.question_guid === this.selectedQuestionGuid);
    this.updateSectionStatus(status.status_type, "QuesVisited");
    status.status_name = "Unanswered";
    status.status_type = "QuesVisited"
    status.status_css_tag = "badge-warning";

    this.clearFormStatus = true;
    this.hasAnswerChanged = false;
    //clearing answer
    this.examQuestionsSummary.question_summary
      .find(q => q.question[0].question_guid === this.selectedQuestionGuid).answers = [];
    this.getQuestionDetails();

    //response for bulk update array
    const response: QuestionAnswerResponse = {
      candidate_guid: this.authService.getUserUniqueId(),
      question_guid: this.questionDetails.question[0].question_guid,
      question_number: this.questionDetails.question[0].question_number,
      primary_question_guid: this.questionDetails.question[0].question_guid,
      mark_to_review: "0",
      language_guid: this.questionDetails.question[0].language_guid,
      section_guid: this.questionDetails.question[0].section_guid,
      answers: [],
      valid_response: false,
      value_changed: false,
    }

    this.bulkUploadAnswers.forEach((currentValue, index) => {
      if (currentValue.question_guid == response.question_guid) {
        this.bulkUploadAnswers.splice(index, 1);
      }
    });
    this.bulkUploadAnswers.push(response);
    //this.clearFormStatus = false;
  }

  updateSectionStatus(oldStatus, newStatus) {
    if (oldStatus && newStatus) {
      let statusDetailsOld = this.currentSectionStatusList
        .find(s => s.status_type === oldStatus);
      if (statusDetailsOld) {
        this.currentSectionStatusList
          .find(s => s.status_type === oldStatus).no_of_questions = String(parseInt(statusDetailsOld.no_of_questions) - 1);
      }

      let statusDetailsNew = this.currentSectionStatusList
        .find(s => s.status_type === newStatus);
      if (statusDetailsNew) {
        this.currentSectionStatusList.find(s => s.status_type === newStatus).no_of_questions = String(parseInt(statusDetailsNew.no_of_questions) + 1);
      }
    }
  }

  //starting timer based on seconds
  startTimer() {
    if (this.examQuestionsSummary.exam_duration.allowed_duration_in_seconds &&
      this.examQuestionsSummary.exam_duration.allowed_duration_in_seconds > '0') {
      //let time = parseInt(this.examQuestionsSummary.exam_duration.allowed_duration_in_seconds);
      this.remainingUserTimeInSeconds = parseInt(this.examQuestionsSummary.exam_duration.allowed_duration_in_seconds);
      this.interval = setInterval(() => {
        if (this.remainingUserTimeInSeconds === 0) {
          clearInterval(this.interval);
          //auto submit only when server is online
          if (this.examServeStatusDetails.isServerOnline) {
            this.onExamComplete(true);
          }
          else {
            //show user offline screen
            this.isExamResumed = false;
          }
        } else {
          if (this.examServeStatusDetails.hasExamOfflineTimeExceeded === false
            && this.isExamResumed === true) {

            this.remainingUserTimeInSeconds--;
          }
        }

        if (
          this.examServeStatusDetails.hasExamOfflineTimeExceeded === false
          && this.isExamResumed === true)
          this.headerService.timerValue.next(this.transform(this.remainingUserTimeInSeconds));

      }, 1000);
    } else {
      this.examQuestionsSummary = undefined;
      this.router.navigate(["login"]);
    }
  }
  //formatiing seconds for every second
  transform(value: number): string {
    const sec_num = value;
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - hours * 3600) / 60);
    const seconds = sec_num - hours * 3600 - minutes * 60;
    return (
      (hours < 10 ? "0" + hours : hours) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }

  onFinishExamClick() {    
    if (this.examServeStatusDetails.isServerOnline === true) {
      //calling local haertbeat function to update unanswered questions
      this.updateHeartBeat()
      this.viewAnswerSummary = true;
      this.headerService.examDetails.next(false);
      this.sectionName = "";

      this.getAnswerSummary();
    }
  }

  getAnswerSummary() {

    this.saveJsonForExamPreview();
      
    let postParams = {
      roll_number: "",
      date_of_birth: "",
      candidate_key: "",
      exam_guid: this.examGuid,
      candidate_guid: this.authService.getUserUniqueId(),
      language_guid: this.selectedLanguageGuid,
      section_guid: this.selectedSectionGuid,
      question_guid: this.selectedQuestionGuid,
      status_guid: this.selectedStatusGuid,
    };

    //all sections question answer summary  
    this.restService.ApiEndPointUrlOrKey = Exam.getAnswerSummary;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.HttpPostParams = postParams;
    this.restService.callApi().subscribe(
      (sucessResponse) => {
        this.answerSummary = sucessResponse;
      },
      (errorResponse) => {
        this.answerSummary = undefined;
        this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
          this.messageService.hideModal();
        })
      }
    );

  }

  saveJsonForExamPreview()
  {
    let questionStatusList = Object.assign(this.examQuestionSummaryJson.section_questions_status)
    let filteredStatus = questionStatusList;
    // ----- updated selected section status list
    let unansweredCount = 0;
    let answeredCount = 0;
    let noVisitCount = 0;
    let toReviewCount = 0;

    this.currentSelectedSectionStatusList = this.currentSectionStatusList;

    for (let i = 0; i < filteredStatus.length; i++) {
      for (let j = 0; j < this.currentSelectedSectionStatusList.length; j++) {
        if (filteredStatus[i].status_type === "QuesVisited" && this.currentSelectedSectionStatusList[j].status_type === "QuesVisited") {
          unansweredCount++;
        }
        if (filteredStatus[i].status_type === "QuesNoVisit" && this.currentSelectedSectionStatusList[j].status_type === "QuesNoVisit") {
          noVisitCount++;
        }
        if (filteredStatus[i].status_type === "QuesAnswered" && this.currentSelectedSectionStatusList[j].status_type === "QuesAnswered") {
          answeredCount++;
        }
        if (filteredStatus[i].status_type === "QuesMarkReview" && this.currentSelectedSectionStatusList[j].status_type === "QuesMarkReview") {
          toReviewCount++;
        }
        // console.log(i +'  '+ filteredStatus[i].status_type +'  '+ j +'  '+ this.currentSelectedSectionStatusList[j].status_type + ' - '+ this.currentSectionStatusList[j].no_of_questions)
      }
    };
        
    
     //for exam preview
     this.restService.examQuestionsSummary=this.examQuestionsSummary;      
     this.restService.sectionStatus=this.currentSectionStatusList;
     this.restService.examQuestionsSummary.section_questions_status=filteredStatus;

  }

  onExamSummaryEmmiter(event) {
    if (event) {
      if (event.question_guid) {
        this.selectedQuestionGuid = event.question_guid;
        this.selectedSectionGuid = event.sec_guid;
        //reassigning json
        let examJson = { ...this.examQuestionSummaryJson };
        this.examQuestionsSummary = examJson;

      } else {
        this.sectionName = this.questionDetails.question[0].section_name;
      }
      this.viewAnswerSummary = false;

      setTimeout(() => { this.selectSection = true; }, 100);
      this.headerService.examDetails.next(true);
    }

  }

  onSelectLanguage(event: any) {
    this.selectedLanguageGuid = event;
  }

  onQuestionAnswerChangedEmmiter() {
    this.hasAnswerChanged = true;
  }



  ngOnDestroy() {
    clearInterval(this.interval);
    this.headerService.timerValue.next("");
    this.headerService.examDetails.next(false);
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngAfterContentChecked() {

    this.cdr.detectChanges();

  }

  setLoaderVisibility(showLoader: boolean) {

    const spinner = document.getElementsByClassName('spinner')[0];
    if (showLoader) {
      if (spinner.classList.contains('hidden')) {
        spinner.classList.remove('hidden');
        spinner.classList.add('visible');
      }
    }
    else {
      if (spinner.classList.contains('visible')) {
        spinner.classList.remove('visible');
        spinner.classList.add('hidden');
      }
    }
  }


}
