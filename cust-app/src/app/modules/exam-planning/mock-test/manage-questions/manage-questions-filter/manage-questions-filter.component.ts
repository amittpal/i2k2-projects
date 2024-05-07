import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../../services/filter/filter.service';
import { GlobalRestService } from '../../../../../services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-manage-questions-filter',
  templateUrl: './manage-questions-filter.component.html',
  styleUrls: ['./manage-questions-filter.component.scss']
})
export class ManageQuestionsFilterComponent implements OnInit {

  public searchFilter: any = {};
  public manageQuestionsFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  public subjectList = [];
  public languageList = [];
  public difficultyLevelList = [];
  public questionTypeList = [];
  public questionStatusList = [];
  examGuid: any;
  orderId: any;
  examId: any;

  @Output() updateEvent = new EventEmitter<{ searchFilterData: any }>();
  @Input() get resetFlter() {
    return this._resetFlag;
  }

  set resetFlter(flag: any) {
    this._resetFlag = flag;
    if (this._resetFlag) {
      this.resetFilterGroup();
    }
  }

  @Input() get updatedFilter() {
    return this._updateFilter;
  }

  set updatedFilter(updatedFilter: any) {
    this._updateFilter = updatedFilter;
    this.updateFilterFG();
  }

  constructor(
    private filterService: FilterService, private restService: GlobalRestService, private route: ActivatedRoute, private authService: AuthService
  ) { }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.examId = params['examId'];
      let filters = this.filterService.getFilter("manageQuestionsListFilter");
      if (filters === undefined) {
        this.filterService.addFilter("manageQuestionsList");
        filters = this.filterService.getFilter("manageQuestionsListFilter");
      }
      this.initFormGroup();
      this.onmanageQuestionsFormSubmit(); // on submit

      this.getSubjectList();
      this.getLanguageList();
      this.getDifficultyLevelList();
      this.getQuestionTypeList();
      // this.getQuestionStatusList();


    }, error => {
      console.error('Error: ', error);
    });

  }

  public initFormGroup() {
    
    this.manageQuestionsFormGroup = new FormGroup({
      subject: new FormControl(''),
      language: new FormControl(''),
      difficulty_level: new FormControl(''),
      question_type: new FormControl(''),
      // status_guid: new FormControl('')
    });

  }

  onmanageQuestionsFormSubmit() {
    if (this.manageQuestionsFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.manageQuestionsFormGroup.value);
      console.log(this.manageQuestionsFormGroup.value)
      this.searchFilter.bubbleConfig = this.manageQuestionsFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.questions = this.manageQuestionsFormGroup.value;
    for (let filter in this.searchFilter.questions) {
      if (this.searchFilter.questions[filter] == null || this.searchFilter.questions[filter] == "") {
        delete this.searchFilter.questions[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("manageQuestionsListFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.questions, 0, "manageQuestionsListFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.questions = this.manageQuestionsFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.resetFormGroup();
    this.searchFilter.questions = this.manageQuestionsFormGroup.value;
    this.updateBubbleConfig(this.manageQuestionsFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.resetFormGroup();
    this.searchFilter.questions = this.manageQuestionsFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        // if (filter == "status") {
        //   let name = this.manageQuestionsFormGroup.find((x: any) => x.value == ctrlVal[filter]).name;
        //   this.searchFilter.bubbleConfig[filter] = name;
        // }
      }
    }
  }

  resetFormGroup() {
    this.manageQuestionsFormGroup.reset({
      subject : '',
      language : '',
      difficulty_level : '',
      question_type : '',
      // status_guid: ''
    });
  }

  getSubjectList() {
    
    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Exam.getMockTestSubjectList;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.subjectList = successResponse.subject;
    }, errorResponse => {
      this.subjectList = [];
      console.error('ERROR: ', errorResponse.httpErrorResponse.data[0].attributes.message[0]);
    });
  }

  getLanguageList() {
    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getMockTestLanguageList;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.languageList = successResponse.language;
    }, errorResponse => {
      this.languageList = [];
      console.error('ERROR: ', errorResponse.httpErrorResponse.data[0].attributes.message[0]);
    });
  }

  getDifficultyLevelList() {
    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getMockTestDifficultyLevelList;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.difficultyLevelList = successResponse.level;
    }, errorResponse => {
      this.difficultyLevelList = [];
      console.error('ERROR: ', errorResponse.httpErrorResponse.data[0].attributes.message[0]);
    });
  }

  getQuestionTypeList() {
    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getMockTestQuestionTypeList;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.questionTypeList = successResponse.level;
    }, errorResponse => {
      this.questionTypeList = [];
      console.error('ERROR: ', errorResponse.httpErrorResponse.data[0].attributes.message[0]);
    });
  }

  // getQuestionStatusList() {
  //   var keyData = [
  //     {
  //       "name": "orderId",
  //       "value": this.orderId
  //     },
  //     {
  //       "name": "examGuid",
  //       "value": this.examGuid
  //     }
  //   ];
  //   let userGuid = this.authService.getUserUniqueId();
  //   let postParams = {
  //     "local_endpoint_object": {
  //       "user_guid": userGuid,
  //       "order_id": this.orderId,
  //       "exam_guid": this.examGuid,
  //       "endpoint_type": "AUTHORING"
  //     }
  //   }
  //   this.restService.ApiEndPointUrlOrKey = Author.getQuestionStatusList;
  //   this.restService.HttpPostParams = postParams;
  //   this.restService.callApi(keyData).subscribe(successResponse => {
  //     this.questionStatusList = successResponse.difficulty_level;
  //   }, errorResponse => {
  //     this.questionStatusList = [];
  //     console.error('ERROR: ', errorResponse.httpErrorResponse.data[0].attributes.message[0]);
  //   });
  // }

}
