import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'ngx-ixcheck-message-lib'
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, ImportAuthors } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'assign-question-rowdetail',
  templateUrl: './assign-questions-rowdetails.component.html',
  styleUrls: ['./assign-questions-rowdetails.component.scss']
})
export class AssignQuestionsRowdetailComponent implements OnInit {

  //@Output() private childComponentData = new EventEmitter<number>();
  @Input('examId') examId: string;  
  @Input('examShiftDetails') examShiftDetails: any;
  @Input('rowItemData') rowItemData: any;
   
  @Output() update = new EventEmitter();
  // Child
  difficultyLevels: any;
  public childFromGroup: FormGroup;
  uomsList: any; //del it
  selectedSubject: any;//del it
  questionTypeList: any;//del it
  sectionList: any;//del it
  _item: any;
  _itemOrig: any;
  languageList: any;
  authorList = [];

  @Input() get item() {
    return this._item;
  }
  set item(item: any) {
    this._itemOrig = Object.assign({}, item);
    this._item = item;
  }

  constructor(private messageService: MessageService,
    private restService: GlobalRestService) { }

  ngOnInit() {    
    this.getIntialData();
    this.intialChildForm();
    this.setIntialdata();
  }

  getIntialData() {
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

    this.restService.ApiEndPointUrlOrKey = ImportAuthors.getImporteedAuthors;
    this.restService.HttpPostParams = search_config;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        //console.log(sucessResponse);
        this.authorList = sucessResponse.import_authors;
        //console.log(this.authorList.find(a=>a.guid==="284641c7-b608-434e-9e2d-9e6ab1a776f1"));  

      }, errorResponse => {

      }
      );
  }

  intialChildForm() {
    this.childFromGroup = new FormGroup({
      author_guids: new FormControl('', Validators.required),
      reviewer_guids: new FormControl('', Validators.required),
      approver_guid: new FormControl('', Validators.required),
    });

    if(this.examShiftDetails.enable_review_process !== '1')
    {
      this.childFromGroup.get('reviewer_guids').disable();
    }
    if(this.examShiftDetails.enable_approval_process !== '1')
    {
      this.childFromGroup.get('approver_guid').disable();
    }

  }
  setIntialdata() {
    this.childFromGroup.patchValue({
      author_guids: this.rowItemData.author_guid,
      reviewer_guids: this.rowItemData.reviewer_guid,
      approver_guid: this.rowItemData.approver_guid
    });

  }

  onCancel() {
    //this._item = this._itemOrig;
    //const prodInfo = this._itemOrig;
    this.update.emit(this.rowItemData);
  }

  sendToParent() {
    let formdata = this.childFromGroup.getRawValue();
    if (formdata) {
      this.rowItemData.author_name = this.authorList.find(a => a.guid === formdata.author_guids).name;
      this.rowItemData.reviewer_name = this.authorList.find(a => a.guid === formdata.reviewer_guids).name;
      this.rowItemData.approver_name = this.authorList.find(a => a.guid === formdata.approver_guid).name;
      this.rowItemData.author_guid = formdata.author_guids;
      this.rowItemData.reviewer_guid = formdata.reviewer_guids;
      this.rowItemData.approver_guid = formdata.approver_guid;
      this.update.emit(this.rowItemData);
      return true;
    }


  }

}
