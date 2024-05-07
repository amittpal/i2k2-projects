import { RestMethods, HandelError } from './../../../shared/models/app.models';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Registered } from './../../../shared/enumrations/app-enum.enumerations';
import { LayoutDetails } from './../../../shared/classes/registration/form.class';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalRestService } from './../../../services/rest/global-rest.service';
import { PageClass } from './../../../shared/classes/registration/page.class';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from './../../layout/primary-header/primary-header.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { GridsterConfig, GridType } from 'angular-gridster2';


@Component({
  selector: 'app-registered-candidates-view',
  templateUrl: './registered-candidates-view.component.html',
  styleUrls: ['./registered-candidates-view.component.scss']
})
export class RegisteredCandidatesViewComponent implements OnInit {
  @ViewChild('pagesTabs', { static: false }) pageTabs: TabsetComponent;
  templateForm: FormGroup = new FormGroup({});
  layoutDetails: LayoutDetails;
  examGuid: string = "bc485a52-afd9-11ea-ad74-fa163e30423a";
  additionalDetails = {
    "examGuid": "",
    "registrationGuid": "",
    "candidateGuid":""
  };
  skipComponents = ["NgxIxcheckPassword", "NgxIxcheckConfirmpassword"];
  //gridster configration
  gridsterConfigration: GridsterConfig = {
    mobileBreakpoint: 750,
    gridType: GridType.VerticalFixed,
    fixedRowHeight: 75,
    minCols: 12,
    //minRows: 6, 
    setGridSize: true,
    maxCols: 12

  };
  constructor(
    private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService
  ) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Registered Candidate View");
    this.route.params.subscribe((params: Params) => {
      this.getLayoutDetails(params['cId']);

    }, error => {
      console.error('Error: ', error);
    });
  }

  getLayoutDetails(candidate_guid: string) {
    if (candidate_guid) {
      var keyData = [
        {
          "name": "candidate_guid",
          "value": candidate_guid
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Registered.getCandidateDetailsByExamGuid;
      this.restService.ApiEndPointMehod = RestMethods.Get;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
          console.log(sucessResponse);
          this.layoutDetails = sucessResponse;
          this.additionalDetails.registrationGuid = this.layoutDetails.layout.registration_guid;
          this.additionalDetails.candidateGuid = this.layoutDetails.layout.candidate_guid;
          //this.examGuid=sucessResponse.exams[0].exam_guid;
          // this.additionalDetails.examGuid=this.examGuid;
          this.addFormGroups(this.layoutDetails);
        }, errorResponse => {
          //this.messageService.ok('No data available...');
        });

    }
  }

  //Adding form group
  addFormGroups(formData: any) {
    //each page in object will be a form group
    for (let i = 0; i < formData.layout.pages.length; i++) {
      this.templateForm.addControl(formData.layout.pages[i].page_name, new FormGroup({}));
    }
    // this.addPaymentPageToLayout();
  }

  //adding json for payment page
  addPaymentPageToLayout() {
    const paymentPage: PageClass = new PageClass();
    paymentPage.page_name = "Payment";
    this.layoutDetails.layout.pages.push(paymentPage);
  }


}
