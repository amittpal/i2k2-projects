import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { RegistrationsSetup } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-final-review',
  templateUrl: './final-review.component.html',
  styleUrls: ['./final-review.component.scss']
})
export class FinalReviewComponent implements OnInit {
  examGuid = "";
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public paginationStyle = 'minimal';
  public notFound: boolean = false;
  public displayMessage: any;
  public basicSetupFormGroup: FormGroup;
  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.setupFormFields();
    this.route.params.subscribe((params: Params) => {
      this.examGuid = params['id'];
      if (this.examGuid) {
        this.getData();
      }
    }, error => {
      console.error('Error: ', error);
    });

  }

  setupFormFields() {
    this.basicSetupFormGroup = new FormGroup({
      code: new FormControl({ value: '', disabled: true }),
      name: new FormControl({ value: '', disabled: true }),
      exam_type: new FormControl({ value: '', disabled: true }),
      registration_start_date: new FormControl({ value: '', disabled: true }),
      registration_end_date: new FormControl({ value: '', disabled: true }),
      fee_end_date: new FormControl({ value: '', disabled: true }),
      required_payment: new FormControl({ value: '', disabled: true })
    });

  }

  initializeFormFields(setupDetails: any) {
    this.basicSetupFormGroup.patchValue({
      code: setupDetails.code,
      name: setupDetails.name,
      exam_type: setupDetails.exam_type,
      registration_start_date: setupDetails.registration_start_date,
      registration_end_date: setupDetails.registration_end_date,
      fee_end_date: setupDetails.fee_end_date,
      required_payment: setupDetails.required_payment
    });
  }

  getData() {
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getFeesSetupList;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.initializeFormFields(sucessResponse.registration_setup_details[0])
        this.items = sucessResponse.fee_setup_details;
      });
  }

  onFinalizeFormSubmit() {
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.updateApplicableFeesSetup;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
          if (result == true) {
            this.router.navigateByUrl("/registration/setup");
            this.messageService.hideModal();
          }
          else {
            this.messageService.hideModal();
          }
        });
      });
  }


}
