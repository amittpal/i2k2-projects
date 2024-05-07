import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from '../../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Author } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-manage-question-assignments',
  templateUrl: './manage-question-assignments.component.html',
  styleUrls: ['./manage-question-assignments.component.scss']
})
export class ManageQuestionAssignmentsComponent implements OnInit {
  @Input() examId: any;
  shiftNumber:any;
  langGuid: any;
  primary: any;
  public examShiftFormGroup: FormGroup;
  examShiftDetails: any = {};
  numberOfShifts: any = [];
  items: any;
  total_assigned_students = 0;
  total_remaining_students = 0;
  lastSeenIdMin: any;
  lastSeenIdMax: any;
  lastOffset: any;
  itemCount: any;
  notFound: any;
  searchUserModal: any;
  orgItems: any;
  totalQuestions:number=0;
  totalQuestionAssigned:number=0;
  totalQuestionBalance:number=0;
  totalQuestionApproved:number=0;
  totalQuestionCreated:number=0;

  constructor(
     private configService: AppsettingsConfService,
     private route: ActivatedRoute,
     private router: Router,
     private primaryHeader: PrimaryHeaderService,
     private messageService: MessageService,
     private restService: GlobalRestService) { }

  ngOnInit() {
    //setting page title
    //console.log('fired');
    this.primaryHeader.pageTitle.next("MANAGE QUESTION ASSIGNMENTS");
    this.createExamShiftForm();
    this.getRouteParam();
    this.getIntialData();

  }

  getRouteParam() {
    this.route.params.subscribe((params: Params) => {
      this.examId = params['id'];
      this.shiftNumber = params['shiftNo'];
      this.langGuid = params['language_guid'];
      this.primary = params['primary'];
    }, error => {
      console.error('Error: ', error);
    });
  }

  public reloadItems(params: any) {
    // this.getData(params);
  }

  getIntialData() {

    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      },
      {
        "name": "shiftNumber",
        "value": this.shiftNumber
      },
      {
        "name": "languageGuid",
        "value": this.langGuid
      },
      {
        "name": "primary",
        "value": this.primary
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Author.getAssignmentDetail;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.initializeFormFields(successResponse);      
      this.items = successResponse.manage_assignments;      
      this.items.forEach(element => {
        this.totalQuestions = this.totalQuestions + parseInt(element.no_of_questions);
        this.totalQuestionAssigned=this.totalQuestionAssigned + parseInt(element.number_of_questions_assigned);  
        this.totalQuestionBalance=this.totalQuestionBalance + parseInt(element.number_of_questions_balance);            
        this.totalQuestionCreated = this.totalQuestionCreated + parseInt(element.number_of_questions_created);
        this.totalQuestionApproved=this.totalQuestionApproved + parseInt(element.Approved);         
      });                         
    },
      errorResponse => {
        this.messageService.alert(errorResponse);
      })
  }

  // getExamCityStudents() {
  //   var keyData = [
  //     {
  //       "name": "examId",
  //       "value": this.examId
  //     },
  //     {
  //       "name": "examShiftNumber",
  //       "value": this.numberOfShifts[0].no_of_shifts
  //     },
  //   ];

  //   this.restService.ApiEndPointUrlOrKey = Author.getExamCityStudent;
  //   this.restService.ApiEndPointMehod = RestMethods.Get;
  //   this.restService.callApi(keyData).subscribe(successResponse => {
  //     // console.log(JSON.stringify(successResponse.city_student_detail));
  //     this.orgItems = successResponse.city_student_detail;
  //     this.items = successResponse.city_student_detail;
  //     this.calculateTotalAssignedStudents();
  //   },
  //     errorResponse => {
  //       this.messageService.alert(errorResponse);
  //     })
  // }

  createExamShiftForm() {
    this.examShiftFormGroup = new FormGroup({
      shift_no: new FormControl('', Validators.required),
      total_students: new FormControl('', Validators.required)
    });
  }

  initializeFormFields(data: any) {
    if (data.exams.length > 0) {
      this.examShiftDetails = data.exams[0];
      this.examShiftFormGroup.patchValue({
        shift_no: this.examShiftDetails.shift_number,
        total_students: this.examShiftDetails.total_students
      })
    }
  }

  onShiftNumberChange(shiftNumber: any) {
    if (shiftNumber) {
      var keyData = [
        {
          "name": "examId",
          "value": this.examId
        },
        {
          "name": "examShiftNumber",
          "value": shiftNumber
        },
      ];

      // this.restService.ApiEndPointUrlOrKey = Author.getExamShiftMainById;
      this.restService.ApiEndPointMehod = RestMethods.Get;
      this.restService.callApi(keyData).subscribe(successResponse => {
        this.initializeFormFields(successResponse);
        // this.getExamCityStudents();
      })
    }
    //console.log(shiftNumber);
  }

  // Filtering the search inputs
  doFilterEvents(data) {
    data = data.toLowerCase();
    this.items = this.orgItems.filter(it => it.city_name.toLowerCase().includes(data));
  }

  onTotalStudentTextboxChange(totalStudentsCount) {
    if (totalStudentsCount) {
      totalStudentsCount = parseInt(totalStudentsCount);
      this.examShiftDetails.total_students = totalStudentsCount;
      this.calculateTotalAssignedStudents();
    }
    else {
      this.examShiftDetails.total_students = 0;
      this.calculateTotalAssignedStudents();
    }

  }

  onAssignedStudentCountChange(assignedStudentObject: any, assignedStudentCount: any) {
    if (assignedStudentCount) {
      assignedStudentCount = parseInt(assignedStudentCount);
      if (assignedStudentObject && assignedStudentCount > -1) {
        if (assignedStudentCount <= this.total_remaining_students) {
          assignedStudentObject.no_of_candidates = assignedStudentCount;
          this.calculateTotalAssignedStudents();
        }
      }
    }
    else {
      assignedStudentObject.no_of_candidates = 0;
      this.calculateTotalAssignedStudents();
    }
  }

  calculateTotalAssignedStudents() {

    let allAssignedStudentSum = this.items.filter(item => item.no_of_candidates)
      .reduce((sum, current) => parseInt(sum) + parseInt(current.no_of_candidates), 0);

    this.total_assigned_students = allAssignedStudentSum;
    this.total_remaining_students = parseInt(this.examShiftDetails.total_students) - this.total_assigned_students;
  }

  getParams() {
    let formValues = this.examShiftFormGroup.getRawValue();
    let params = {
      id: this.examShiftDetails.id,
      exam_id: this.examShiftDetails.exam_id,
      examestatecity: this.items,
      total_students: this.examShiftDetails.total_students,
      exam_date: this.examShiftDetails.exam_date,
      exam_reporting_time: this.examShiftDetails.exam_reporting_time,
      exam_start_time: this.examShiftDetails.exam_start_time,
      exam_end_time: this.examShiftDetails.exam_end_time,
      shift_number: this.examShiftDetails.shift_number
    };

    return params;
  }

  formSubmit() {
    if (this.examShiftFormGroup.valid === false) {
      let form = document.getElementById('examShiftFormGroup');
      form.classList.add('was-validated');
    } else if (this.examShiftFormGroup.valid === true) {
      let keyData = [{ "name": "examId", "value": this.examId }]
      let params = this.getParams();
      // this.restService.ApiEndPointUrlOrKey = Author.u pdateExamShiftMainStudent;
      this.restService.ApiEndPointMehod = RestMethods.Put;
      this.restService.HttpPostParams = params;
      this.restService.callApi(keyData).subscribe(successResponse => {
        // this.SharedService.tabsId.next(3);
        this.messageService.alert(successResponse);
      }, errorResponse => {
        //this.messageService.alert(errorResponse);
      }
      )
    }
  }


}
