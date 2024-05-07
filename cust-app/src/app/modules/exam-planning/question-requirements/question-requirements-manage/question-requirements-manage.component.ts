import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { QuestionRequirement, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { DatePipe } from '@angular/common';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';

import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-question-requirements-manage',
  templateUrl: './question-requirements-manage.component.html',
  styleUrls: ['./question-requirements-manage.component.scss'],
  providers: [DatePipe]
})
export class QuestionRequirementsManageComponent implements OnInit {
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public totalQuestions: number;
  public totalRequiredQuestions: number;

  public paginationStyle = 'minimal';

  public manageQuestionRequirementsFormGroup: FormGroup;
  public examId;
  public orginalData;
  private appRoutes: any = {};
  constructor(private restService: GlobalRestService, private route: ActivatedRoute, private router: Router, private configService: AppsettingsConfService,
    private messageService: MessageService, private primaryHeader: PrimaryHeaderService) {
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
    this.primaryHeader.pageTitle.next("Manage Question Requirements");

    this.manageQuestionRequirementsFormGroup = new FormGroup({
      exam_id: new FormControl({value: '', disabled: true}),
       exam_number: new FormControl({value: '', disabled: true}),
      code: new FormControl({value: '', disabled: true}),
      name: new FormControl({value: '', disabled: true}),
      primary_language: new FormControl({value: '', disabled: true}),
      shifts: new FormControl({value: '', disabled: true}),
      additional_factor: new FormControl('', Validators.required),
      enable_review_process: new FormControl('1', Validators.required),
      enable_approval_process: new FormControl('1', Validators.required),
      exam_grade: new FormControl({value: '', disabled: true})
    });
    this.route.params.subscribe((params: Params) => {
      this.examId = params['id'];
      this.getData(params['id']);
    }, error => {
      console.error('Error: ', error);
    });
  }

  getData(id) {
    var keyData = [
      {
        "name": "examId",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = QuestionRequirement.getQuestionRequirementsByExamId;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData)
      .subscribe(successResponse => {
        this.initializeFields(successResponse.questions_requirement[0]);
        this.items = successResponse.questions;
        this.calculateTotals();
        this.orginalData = Object.assign([], successResponse);
      }, errorResponse => {
        //this.messageService.ok(errorResponse);
      }
      );
  }

  private getParams(): any {
    let params = this.manageQuestionRequirementsFormGroup.getRawValue();
    params['id'] = this.examId;
    params.questions= this.items;
    return params;
  }

  public onFormSubmit(): void {
    if (this.manageQuestionRequirementsFormGroup.valid === false) {
      let form = document.getElementById('manageQuestionRequirementsForm');
      form.classList.add('was-validated');
    } else if (this.manageQuestionRequirementsFormGroup.valid === true) {
      let params = this.getParams();
      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        var keyData = [
          {
            "name": "examId",
            "value": this.examId
          }
        ];
        this.restService.ApiEndPointUrlOrKey = QuestionRequirement.saveQuestionRequirements;
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi(keyData)
          .subscribe(successResponse => {
            this.messageService.okRedirectModal(successResponse, 'SUCCESS', 'Go to List').subscribe(result => {
              if (result == true) { // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(['question/requirements']);
              }
              else { // NO/CANCEL = false
                this.messageService.hideModal();
              }
            });
          }, errorResponse => {
            //this.messageService.ok(errorResponse);
          }
          );
      }
    }
  }

  public reset() {
    let form = document.getElementById('manageQuestionRequirementsForm');
    form.classList.remove('was-validated');
    this.manageQuestionRequirementsFormGroup.reset();
    this.initializeFields(this.orginalData.questions_requirement[0]);
    this.items = this.orginalData.questions;
    this.setQuestionRequirements();
  }

  public initializeFields(result) {
    this.manageQuestionRequirementsFormGroup = new FormGroup({
      exam_id: new FormControl({ value: result.exam_id, disabled: true }),
      exam_number: new FormControl({ value: result.exam_number, disabled: true }),
      code: new FormControl({ value: result.code, disabled: true }),
      name: new FormControl({ value: result.name, disabled: true }),
      primary_language: new FormControl({ value: result.primary_language, disabled: true }),
      shifts: new FormControl({ value: result.shifts, disabled: true }),
      additional_factor: new FormControl(result.additional_factor, Validators.required),
      enable_review_process: new FormControl(result.enable_review_process, Validators.required),
      enable_approval_process: new FormControl(result.enable_approval_process, Validators.required),
      exam_grade: new FormControl({ value: result.exam_grade, disabled: true })
    });
    this.examId = result.exam_id;
  }

  getControlValue(type: string){
    return this.manageQuestionRequirementsFormGroup.controls[type].value;
  }

  public rowClick(event) {
    // console.log('Clicked: ' + rowEvent.row.item.name);
  }

  public rowDoubleClick(event) {
    // alert('Double clicked: ' + rowEvent.row.item.name);
  }

  setQuestionRequirements() {
    let additionalFactor = Number(this.getControlValue('additional_factor'));
    let shifts = Number(this.getControlValue('shifts'));
    let additionalFactorLimit = this.orginalData.questions_requirement[0].max_Additional_factor;
    if (Number(additionalFactorLimit) >= Number(additionalFactor)){
      this.totalRequiredQuestions = 0;
      if (additionalFactor < 1) {
        additionalFactor = 1;
        // this.manageQuestionRequirementsFormGroup.value['additional_factor'] = additionalFactor;
        this.manageQuestionRequirementsFormGroup.controls['additional_factor'].setValue(
          additionalFactor
        );
      }
      if (this.items) {
        for (let item of this.items) {
          // item.required_questions = Math.ceil(item.number_of_questions * additionalFactor * shifts);
          item.required_questions = Math.ceil(item.number_of_questions * additionalFactor);
          this.totalRequiredQuestions += item.required_questions;
        }
      }
    }
    else{
      this.messageService.ok('Additional factor can not be greater than ' + additionalFactorLimit);
      this.manageQuestionRequirementsFormGroup.controls['additional_factor'].setValue(
        this.orginalData.questions_requirement[0].additional_factor
      );
      additionalFactor = this.orginalData.questions_requirement[0].additional_factor;
      this.totalRequiredQuestions = 0;
      if (this.items) {
        for (let item of this.items) {
          // item.required_questions = Math.ceil(item.number_of_questions * additionalFactor * shifts);
          item.required_questions = Math.ceil(item.number_of_questions * additionalFactor);
          this.totalRequiredQuestions += item.required_questions;
        }
      }
    }
  }

  calculateTotals() {
    this.totalQuestions = 0;
    this.totalRequiredQuestions = 0;
    if (this.items) {
      for (let item of this.items) {
        this.totalQuestions += item.number_of_questions;
        this.totalRequiredQuestions += item.required_questions;
      }
    }
  }

}
