import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { QuestionRequirement, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { DatePipe } from '@angular/common';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';

@Component({
  selector: 'app-question-requirements-view',
  templateUrl: './question-requirements-view.component.html',
  styleUrls: ['./question-requirements-view.component.scss'],
  providers: [DatePipe]
})
export class QuestionRequirementsViewComponent implements OnInit {
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public totalQuestions: number;
  public totalRequiredQuestions: number;

  public paginationStyle = 'minimal';

  public viewQuestionRequirementsFormGroup: FormGroup;
  private appRoutes: any = {};
  constructor(private restService: GlobalRestService, private route: ActivatedRoute,private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });}

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("View Question Requirements");

    this.viewQuestionRequirementsFormGroup = new FormGroup({
      exam_id: new FormControl({value: '', disabled: true}),
      exam_number: new FormControl({value: '', disabled: true}),
      code: new FormControl({value: '', disabled: true}),
      name: new FormControl({value: '', disabled: true}),
      primary_language: new FormControl({value: '', disabled: true}),
      shifts: new FormControl({value: '', disabled: true}),
      additional_factor: new FormControl({value: '', disabled: true}),
      enable_review_process: new FormControl({value: '', disabled: true}),
      enable_approval_process: new FormControl({value: '', disabled: true}),
      exam_grade: new FormControl({value: '', disabled: true})
    });
    this.route.params.subscribe((params: Params) => {
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
    this.restService.callApi(keyData)
      .subscribe(successResponse => {
        this.initializeFields(successResponse.questions_requirement[0]);
        this.items = successResponse.questions;
        this.calculateTotals();
      }, errorResponse => {
        //this.messageService.ok(errorResponse);
      }
      );
  }

  public initializeFields(result) {
    this.viewQuestionRequirementsFormGroup = new FormGroup({
      exam_id: new FormControl({ value: result.exam_id, disabled: true }),
      exam_number: new FormControl({ value: result.exam_number, disabled: true }),
      code: new FormControl({ value: result.code, disabled: true }),
      name: new FormControl({ value: result.name, disabled: true }),
      primary_language: new FormControl({ value: result.primary_language, disabled: true }),
      shifts: new FormControl({ value: result.shifts, disabled: true }),
      additional_factor: new FormControl({ value: result.additional_factor, disabled: false }),
      enable_review_process: new FormControl({ value: result.enable_review_process, disabled: false }),
      enable_approval_process: new FormControl({ value: result.enable_approval_process, disabled: false }),
      exam_grade: new FormControl({ value: result.exam_grade, disabled: true })
    });
  }

  public rowClick(event) {
    // console.log('Clicked: ' + rowEvent.row.item.name);
  }

  public rowDoubleClick(event) {
    // alert('Double clicked: ' + rowEvent.row.item.name);
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
