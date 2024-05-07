import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';

import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../service/shared.service';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-final-review-rowdetail',
  templateUrl: './final-review-rowdetail.component.html',
  styleUrls: ['./final-review-rowdetail.component.scss']
})
export class FinalReviewRowdetailComponent implements OnInit {
  @Output() private sendToParent = new EventEmitter<number>(); // Sends tab id to parent component
  public questionData: any;
  @Input() order: any;
  emailIdSub: Subscription;
  IdSub: Subscription;
  examId: any;
  Id: any;
  sectionId: any;
  constructor(private messageService: MessageService, private SharedService: SharedService, private restService: GlobalRestService) { }

  ngOnInit() {
    this.sectionId = this.order.id;
    // this.getData(this.order.id);
    // console.log( this.sectionId);
    this.getExamId();
  }

  getExamId() {
    this.emailIdSub = this.SharedService.ExamId.subscribe(examId => {
      if (examId != null) {
        this.examId = examId;
        this.getData();
      }
    });

    ///Restrict new user to update section
    // this.IdSub = this.SharedService.ID.subscribe(id => {
    //   // debugger
    //   if (id != null) {
    //     // New User
    //     this.emailIdSub = this.SharedService.ExamId.subscribe(examId => {
    //       if (examId != null) {
    //         this.examId = examId;
    //         this.Id = id;
    //         this.getData();
    //       }
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    // this.config.data = [];
    // this.config.data.push({});

    // prevent memory leak when component destroyed
    if (this.IdSub) {
      this.IdSub.unsubscribe();
    }
    if (this.emailIdSub) {
      this.emailIdSub.unsubscribe();
    }

  }


  updateQuestion() {
    this.sendToParent.emit(2);
    this.SharedService.sectionId.next(this.sectionId);
  }

  onDelete(question_id, question_number) {

    this.messageService.confirm(["Are you sure you want to delete this record?"], "Delete", "Yes", "NO", "error").subscribe(result => {
      if (result == true) {
        this.messageService.hideModal();
        const keyData = [
          {
            "name": "examId",
            "value": this.examId
          },
          {
            "name": "sectionId",
            "value": this.sectionId
          },
          {
            "name": "question_number",
            "value": question_number
          },
          {
            "name": "id",
            "value": question_id
          }
        ];
        let params = { "exam_id": this.examId, "section_id": this.sectionId, "question_number": question_number, "id": question_id };
        this.restService.ApiEndPointUrlOrKey = Exam.deleteQuestion;
        this.restService.HttpPostParams = params;
        this.restService.callApi(keyData).subscribe(successResponse => {
          // this.messageService.ok(successResponse.message[0]);
          this.messageService.okRedirectModal(successResponse, 'SUCCESS').subscribe(result => {

            if (result == true) { // OK = true for redirection
              this.messageService.hideModal();
              // this.getData();
              this.questionData = this.questionData.filter(list => list.question_Id !== question_id)
              // this.getData(this._getRemoteParameters(), false);
            }
            else { // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });
        }, () => {
          this.messageService.hideModal();
        });
      } else {
        this.messageService.hideModal();
      }
    })
  }

  getData() {
    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }, {
        "name": "sectionId",
        "value": this.sectionId
      }
    ];
    // Get Section List According to ExamId
    this.restService.ApiEndPointUrlOrKey = Exam.getQuestionList;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        // console.log(JSON.stringify(sucessResponse['Question']));
        this.questionData = sucessResponse['Question'];
        // this.sectionList = sucessResponse.sections;
      }, errorResponse => {
        console.error('ERROR: ', errorResponse.message[0]);
      });
  }

}
