import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../services/filter/filter.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, ImportAuthors } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-languages-filter',
  templateUrl: './languages-filter.component.html',
  styleUrls: ['./languages-filter.component.scss']
})
export class LanguagesFilterComponent implements OnInit {
  public languageListFormGroup: FormGroup;
  public searchFilter: any = {};
  public _resetFlag = false
  public _updateFilter = false;
  public LanguageList = [];


  @Input() get languageResetFlter() {
    return this._resetFlag;
  }
  set languageResetFlter(flag: any) {
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

  @Output() updateEvent = new EventEmitter<any>();

  constructor(private filterService: FilterService, private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
  }



  ngOnInit() {
    this.getLanguages();

    let filters = this.filterService.getFilter("languagesFilter");
    if (filters === undefined) {
      this.filterService.addFilter("languages");
    }
    this.initFormGroup();
    this.languageListFormGroup.controls.language_guid.patchValue('');
    this.onLanguageFormSubmit();
  }

  public onLanguageFormSubmit(event?) {
    if (this.languageListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("languagesFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.formData, 0, "languagesFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.languageListFormGroup.value;
    this.updateBubbleConfig(this.languageListFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.languageListFormGroup.reset();
    this.languageListFormGroup.controls.language_guid.patchValue('');
    this.updateBubbleConfig(this.languageListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.languageListFormGroup = new FormGroup({
      language_guid: new FormControl('', Validators.minLength(3))

    });
    let filter = this.filterService.getFilter("languagesFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.languageListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.languageListFormGroup.reset();
    this.languageListFormGroup.controls.language_guid.patchValue('');
    this.searchFilter.formData = this.languageListFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];

      }
    }
  }

  public getLanguages() {
    let keyData = [{
      name: "languageGuid",
      value: '0'
    }]
    this.restService.ApiEndPointUrlOrKey = ImportAuthors.getLanguages;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.LanguageList = successResponse.languages;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
}