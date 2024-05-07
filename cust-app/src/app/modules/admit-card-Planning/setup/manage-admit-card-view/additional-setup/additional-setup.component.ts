import { Component, OnInit, Input } from '@angular/core';
import { AppsettingsConfService } from '../../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { GlobalRestService } from '../../../../../services/rest/global-rest.service';
import { Params, ActivatedRoute } from '@angular/router';
import { AdmitCard } from '../../../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-additional-setup',
  templateUrl: './additional-setup.component.html',
  styleUrls: ['./additional-setup.component.scss']
})
export class AdditionalSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  @Input() smsEmailActiveFlag: string;

  additionalSetupFormGroup: FormGroup;

  public items = [];
  public attrItems = [];

  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public paginationStyle = 'minimal';

  registrationGuid = "";

  constructor(private route: ActivatedRoute, private configService: AppsettingsConfService,
    private restService: GlobalRestService, private messageService: MessageService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
      if (this.registrationGuid) {
        this.additionalSetupFormGroup = new FormGroup({});
        this.getTermsAndConditionsDetails(this.registrationGuid);
      }
    }, error => {
      console.error('Error: ', error);
    });
  }

  // Get initial value of the form control through api
  getTermsAndConditionsDetails(id: any) {
    //call api code here...
    var keyData = [
      {
        "name": "registrationGuid",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getTermAndConditions;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.items = sucessResponse.admit_card_terms_notes_details;
        this.attrItems = this.getAttrParams(sucessResponse.admit_card_terms_notes[0])

        this.initializeForm();

        this.items.forEach(item => {
          this.postTermsConditions.admit_card_terms_notes_details.push(
            {
              "exam_guid": item.exam_guid,
              "language_guid": item.language_guid,
              "language_name": item.language_name,
              "terms_conditions": item.terms_conditions,
              "notes": item.notes
            }
          );
        });

      },
        errorResponse => {
          //this.messageService.alert(errorResponse);
        }
      );
  }


  initializeForm() {
    let items = this.items;
    let attrItems = this.attrItems;
    if (items && attrItems) {
      this.attrItems.forEach(rollNumberAttributes => {
        this.additionalSetupFormGroup.addControl('priority' + rollNumberAttributes.attribute, new FormControl({ value: rollNumberAttributes.priority, disabled: true }, Validators.required))
        this.additionalSetupFormGroup.addControl('length' + rollNumberAttributes.attribute, new FormControl({ value: rollNumberAttributes.length, disabled: true }, Validators.required))
      });

      this.items.forEach(conditionAndNotes => {

        if (conditionAndNotes.language_name == 'English') {
          this.additionalSetupFormGroup.addControl('termsConditions' + conditionAndNotes.language_name, new FormControl({ value: conditionAndNotes.terms_conditions, disabled: true }, Validators.required))
          this.additionalSetupFormGroup.addControl('notes' + conditionAndNotes.language_name, new FormControl({ value: conditionAndNotes.notes, disabled: true }, Validators.required))
        }

        if (conditionAndNotes.language_name != 'English') {
          this.additionalSetupFormGroup.addControl('termsConditions' + conditionAndNotes.language_name, new FormControl({ value: '', disabled: true }))
          this.additionalSetupFormGroup.addControl('notes' + conditionAndNotes.language_name, new FormControl({ value: '', disabled: true }))
          this.additionalSetupFormGroup.addControl('termsConditionsHidden' + conditionAndNotes.language_name, new FormControl({ value: conditionAndNotes.terms_conditions, disabled: true }, Validators.required))
          this.additionalSetupFormGroup.addControl('notesHidden' + conditionAndNotes.language_name, new FormControl({ value: conditionAndNotes.notes, disabled: true }, Validators.required))
        }
      });
    }
  }

  // create custom object for roll number attribute section to be used for easy iteration
  getAttrParams(resp) {

    let attrParams = [{
      "attribute": "City_Id",
      "priority": resp.city_priority,
      "length": resp.city_length
    },
    {
      "attribute": "Shift_Number",
      "priority": resp.shift_priority,
      "length": resp.shift_length
    },
    {
      "attribute": "Roll_Number",
      "priority": resp.rollnumber_priority,
      "length": resp.rollnumber_length
    }];

    return attrParams;
  }

  // object for posting form data while submission
  public postTermsConditions = {
    "admit_card_terms_notes_details": [],
    "exam_guid": "",
    "city_priority": "",
    "city_length": "",
    "shift_priority": "",
    "shift_length": "",
    "rollnumber_priority": "",
    "rollnumber_length": ""
  };
}
