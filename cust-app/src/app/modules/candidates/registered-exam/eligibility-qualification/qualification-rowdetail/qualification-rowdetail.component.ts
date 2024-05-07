import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Candidates, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-qualification-rowdetail',
  templateUrl: './qualification-rowdetail.component.html',
  styleUrls: ['./qualification-rowdetail.component.scss']
})
export class QualificationRowdetailComponent implements OnInit {
  public qualificationFormGroup: FormGroup;
  @Input() item: any;
  @Output() updateEvent = new EventEmitter<any>();
  constructor(private restService: GlobalRestService,private authService: AuthService, private messageService: MessageService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
  }

  ngOnInit() {
    this.initializedForm();
  }

  public initializedForm() {
    this.qualificationFormGroup = new FormGroup({
      qualified: new FormControl(this.item.qualified == undefined || this.item.qualified == 0||this.item.qualified == '' ? 0 : this.item.qualified),
      remarks: new FormControl(this.item.remarks)
    })
  }

  public updateExam() {
    if (this.qualificationFormGroup.valid === false) {
      let form = document.getElementById("qualificationFormGroup");
      form.classList.add("was-validated");
      return false;
    }
    else {
      let requestParams = {
        registration_guid: this.item.registration_guid,
        candidate_guid: this.item.candidate_guid,
        exam_guid: this.item.exam_guid,
        status: this.qualificationFormGroup.get('qualified').value,
        remarks: this.qualificationFormGroup.get('remarks').value,
        entry_by: this.authService.getUserUId()
      }
      this.restService.ApiEndPointUrlOrKey = Candidates.updateCandidateExam;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.HttpPostParams = requestParams;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
            }
            else {
              this.messageService.hideModal();
            }
            this.updateEvent.emit(true);
          });
        },
          errorResponse => {
            //this.messageService.alert(errorResponse);
            this.messageService.notify(errorResponse.httpErrorResponse);
          }
        );
    }
  }
  public resetFormGroup() {
    this.qualificationFormGroup = new FormGroup({
      qualified: new FormControl(''),
      remarks: new FormControl('')
    })
  }
}