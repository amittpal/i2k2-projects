import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from '../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { HandelError, Author } from '../../../../shared/enumrations/app-enum.enumerations';
import { RestMethods } from '../../../../shared/models/app.models';


@Component({
  selector: 'app-assign-approval-authority',
  templateUrl: './assign-approval-authority.component.html',
  styleUrls: ['./assign-approval-authority.component.scss']
})
export class AssignApprovalAuthorityComponent implements OnInit {

  public addApprovalAuthorityFormGroup: FormGroup;
  private appRoutes: any = {};
  examId: any;
  authorList:any = [];

  constructor(private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService, private route: ActivatedRoute) {
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
    this.primaryHeader.pageTitle.next("APPROVAL AUTHORITIES");
    this.getRouteParam();
    this.initializeFields();
    this.getExamDetails();
    this.getAuthorList();
  }


  getRouteParam() {
    this.route.params.subscribe((params: Params) => {
      this.examId = params['id'];
    }, error => {
      console.error('Error: ', error);
    });
  }

  public initializeFields() {
    this.addApprovalAuthorityFormGroup = new FormGroup({
      number: new FormControl({ value: "", disabled: true }),
      type: new FormControl({ value: "", disabled: true }),
      code: new FormControl({ value: "", disabled: true }),
      name: new FormControl({ value: "", disabled: true }),
      grade: new FormControl({ value: "", disabled: true }),
      label: new FormControl({ value: "", disabled: true }),
      approver: new FormControl('', Validators.required)
    });
  }
  private getParams() {
    let params = this.addApprovalAuthorityFormGroup.getRawValue();
    return params;
  }

  getExamDetails() {

    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }
    ];

    // Get Exam Details
    this.restService.ApiEndPointUrlOrKey = Author.getApprovalAuthorityExamDetails;
    this.restService.callApi(keyData).subscribe(successResponse => {
      let detail = successResponse.exams[0];
      this.addApprovalAuthorityFormGroup.patchValue({
        number: detail["exam_number"],
        type: detail["exam_type"],
        code: detail["exam_public_label"],
        name: detail["exam_name"],
        grade: detail["grade_type"],
        label: detail["exam_public_label"],
      })
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  getAuthorList() {
    let search_config: any = {
      "imported_authors_filter":
      {
        "imported_authors": {

        },
        "cols": [],
        "paging": {
          "total_rows": 0,
          "returned_rows": 0,
          "direction": 0,
          "order_dir": "",
          "page_size": 10,
          "sort_by": "",
          "last_offset": 0,
          "last_seen_id_max": 0,
          "last_seen_id_min": 0
        }
      }
    };
    this.restService.ApiEndPointUrlOrKey = Author.getImporteedAuthors;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = search_config;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.authorList = sucessResponse.import_authors;
      }, errorResponse => {
      }
      );
  }

  public formSubmit() {
    if (this.addApprovalAuthorityFormGroup.valid === false) {
      let form = document.getElementById('addApprovalAuthorityForm');
      form.classList.add('was-validated');
    } else if (this.addApprovalAuthorityFormGroup.valid === true) {
      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {

        let authorGuid = this.addApprovalAuthorityFormGroup.controls["approver"].value;

        var keyData = [
          {
            "name": "examId",
            "value": this.examId
          },
          {
            "name": "authorGuid",
            "value": authorGuid
          }
        ];


        this.restService.ApiEndPointUrlOrKey = Author.updatePrincipalApprover;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
              if (result == true) { // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(['author/approval/authority']);
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
    let form = document.getElementById('addApprovalAuthorityForm');
    form.classList.remove('was-validated');
    this.addApprovalAuthorityFormGroup.patchValue({
      approver:""
    });
  }

}
