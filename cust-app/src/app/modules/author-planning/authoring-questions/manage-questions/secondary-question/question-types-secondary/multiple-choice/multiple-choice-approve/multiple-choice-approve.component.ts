import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Author, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-multiple-choice-approve',
  templateUrl: './multiple-choice-approve.component.html',
  styleUrls: ['./multiple-choice-approve.component.scss']
})
export class MultipleChoiceApproveComponent implements OnInit {

  @Input() QuestionDetails: any;
  questionApproveFormGroup: FormGroup;
  optionList = ["(a)", "(b)", "(c)", "(d)", "(e)", "(f)", "(g)"];
  approveStatusList = [];
  constructor(
    private primaryHeader: PrimaryHeaderService,
    private router: Router,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {}
  ngOnChanges() {
    this.primaryHeader.pageTitle.next("QUESTION APPROVE");
    this.getApproveStatusList();
    this.setupInitialDetails();
  }


  initializeForm() {
    let examDetails = this.QuestionDetails.question_summary[0];
    if (examDetails) {
      this.questionApproveFormGroup = new FormGroup({
        exam_number: new FormControl({ value: examDetails.exam_number, disabled: true }),
        subject: new FormControl({ value: examDetails.subject, disabled: true }),
        language: new FormControl({ value: examDetails.language, disabled: true }),
        questions: new FormControl({ value: examDetails.number_of_options, disabled: true }),
        reviewStatus: new FormControl('', [Validators.required]),
        remarks: new FormControl('', [Validators.required, Validators.maxLength(200)])
      });
    }
  }

  setupInitialDetails() {
    this.QuestionDetails.options = this.QuestionDetails.options
      .map((arrayData, index) => (
        {
          "selected": this.QuestionDetails.answer.some(el => el.option_guid === arrayData.guid),
          ...arrayData
        }));

    this.QuestionDetails.option_primary = this.QuestionDetails.option_primary
      .map((arrayData, index) => (
        {
          "selected": this.QuestionDetails.answer_primary.some(el => el.option_guid === arrayData.guid),
          ...arrayData
        }));

    this.QuestionDetails.requirement_summary = this.QuestionDetails.requirement_summary
      .map((e, index) => ({ "selected": false, ...e }));

    this.initializeForm();
  }

  onQuestionApproveClick() {
    if (this.questionApproveFormGroup.valid) {
      var keyData = [
        {
          "name": "detailId",
          "value": this.QuestionDetails.question[0].detail_id
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Author.updateQuestionApproveStatus;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.HttpPostParams = this.getPostParams();
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
          //console.log(sucessResponse);
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go Back to List').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              this.router.navigate(["/author/questions/" + this.QuestionDetails.question_summary[0].exam_guid + "/manage"]);
            }
            else {
              this.messageService.hideModal();
            }
          });
        }, errorResponse => {
          this.messageService.alert(errorResponse);
          //this.messageService.notify(errorResponse);
        });
    }
    else {
      document.getElementById('questionApproveForm').classList.add('was-validated');
      //this.messageService.ok('Please provide approve status and remark for question.')
    }
  }

  getApproveStatusList() {
    this.restService.ApiEndPointUrlOrKey = Author.getApprovePlanStatusList;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.approveStatusList = sucessResponse.plan_status;
      }, errorResponse => {
        this.messageService.alert(errorResponse);
      });
  }
  getPostParams() {
    let postParams = {
      "completion_status_guid": this.questionApproveFormGroup.get('reviewStatus').value,
      "remark": this.questionApproveFormGroup.get('remarks').value
    }
    return postParams;
  }

}
