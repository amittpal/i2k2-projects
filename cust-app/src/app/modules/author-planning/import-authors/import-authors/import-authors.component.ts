import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { HandelError, ImportAuthors } from '../../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from '../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import bubbleConfig from '../../../../../assets/config/bubbleconfig.json';
import { RestMethods } from '../../../../shared/models/app.models';

@Component({
  selector: 'app-import-authors',
  templateUrl: './import-authors.component.html',
  styleUrls: ['./import-authors.component.scss']
})
export class ImportAuthorsComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  stateId: string;
  Id: string;

  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public config = bubbleConfig
  public bubbleLabels: any = {}
  public resultModal: string;
  public resetFilterFlag: boolean = false;
  public updatedFilter: any;
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  public showProgress: boolean = false;
  public isLoading: boolean = false;
  public reloadBubble = true
  public paginationStyle = 'minimal';
  public appRoutes: any = {};
  index: any;

  //Subjects
  public subjectsList: any;
  public dataAddSubjects: any;
  public originalSubjectsData = [];
  public originaldataAddSubjects: Array<any>;

  //Language
  public languagesList: any;
  public dataAddLanguages: any;
  public originalLanguagesData = [];
  public originaldataAddLanguages: Array<any>;

  //Author
  public authorsList: any;
  public dataAddAuthors: any;
  public originalAuthorsData = [];
  public originaldataAddAuthors: Array<any>;
  public importJson: any;

  public search_config: any = {

    "subjects_filter":
    {
      "subjects": {},
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

  public search_language_config: any = {

    "languages_filter":
    {
      "languages": {},
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

  public search_author_config: any = {

    "authors_filter":
    {
      "authors": {
        "subject_guid": [],
        "language_guid": []


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



  constructor(private route: ActivatedRoute, private restService: GlobalRestService, private authService: AuthService, private filterService: FilterService,
    private configService: AppsettingsConfService, private messageService: MessageService, private router: Router,
    private primaryHeader: PrimaryHeaderService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }
  ngOnInit() {
    this.primaryHeader.pageTitle.next("Import Authors");
    this.dataAddSubjects = [];
    this.originaldataAddSubjects = Object.assign([], this.dataAddSubjects);
    this.dataAddLanguages = [];
    this.originaldataAddLanguages = Object.assign([], this.dataAddLanguages);
  }
  // Subjects list functions

  public updateSubjectTable(data: any) {
    this.offset = 0;
    this.search_config.subjects_filter.subjects = data.formData;
    this.config.data[0] = data.bubbleConfig;
    this.getSubjectData(this._getSubjectRemoteParameters(), false);
    this.updatedFilter = {};
  }
  private getSubjectData(params: NgxIxcheckTableParams, fromSubmit: boolean) {
    this.resetFilterFlag = false;
    let difficultyLevelsSearchParams = this.getSubjectSearchParams(params, fromSubmit);
    //call api code here...
    
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = ImportAuthors.getSubjectsList;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      
      let keyData = [{
        name: "subjectGuid",
        value: difficultyLevelsSearchParams.subjects_filter.subjects.subject_guid?difficultyLevelsSearchParams.subjects_filter.subjects.subject_guid:"0"
      }]
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {

          this.items = sucessResponse.subjects;
          this.subjectsList = sucessResponse.subjects;
          this.originalSubjectsData = Object.assign([], this.subjectsList);
          if (this.subjectsList.count > 0) {
            if (this.originaldataAddSubjects.length > 0) {
              for (let i = 0; i < this.originaldataAddSubjects.length; i++) {
                this.mapSubjectList(this.originaldataAddSubjects[i], i);
              }
            }
          }
          // this.notFound = false;
          //paging info
          // this.itemCount = sucessResponse.paging.total_rows;
          // this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          // this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          // this.lastOffset = sucessResponse.paging.last_offset;
          // this.search_config.subjects_filter.paging = sucessResponse.paging;
        }, errorResponse => {
          if (errorResponse !== undefined) {
            // this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        }
        );
    }
  }
  addSubject(subject: any, i: any) {
    this.subjectsList.splice(i, 1);
    this.dataAddSubjects.push({
      id: subject.id,
      subject_guid: subject.subject_guid,
      name: subject.name,
      code: subject.code
    });
    const indexInOriginalStates = this.originalSubjectsData.indexOf(subject);
    this.originalSubjectsData.splice(indexInOriginalStates, 1);  //removing it from the original data right table
    this.originaldataAddSubjects.push(subject);
  }
  revertSubject(state: any, i: any) {
    this.messageService.confirm(["Are you sure you want to remove as it will remove subjects?", JSON.stringify(name)], "Delete", "Yes", "NO", "error").subscribe(result => {
      if (result == true) {
        this.messageService.hideModal();
        this.dataAddSubjects.splice(i, 1);
        this.originalSubjectsData.push({
          id: state.id,
          guid: state.guid,
          name: state.name,
          code: state.code
        });
        let index = this.originalSubjectsData.indexOf(state);
        this.subjectsList.splice(index, 0, state);
        const indexInOriginalAddedSubjects = this.originaldataAddSubjects.indexOf(state);
        this.originaldataAddSubjects.splice(indexInOriginalAddedSubjects, 1);  //removing it from the original Added data Left table
      }
      else {
        this.messageService.hideModal();
      }
    })
  }
  private getSubjectSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
    this.search_config.subjects_filter.paging = {
      total_rows: this.itemCount || 0,
      returned_rows: 0,
      direction: params.direction || 0,
      order_dir: params.sortAsc ? 'asc' : 'desc' || "",
      page_size: 10,
      sort_by: params.sortBy || "",
      offset: params.offset || 0,
      last_offset: params.lastOffset || 0,
      last_seen_id_max: params.lastSeenIdMax || 0,
      last_seen_id_min: params.lastSeenIdMin || 0
    }
    return this.search_config;
  }
  public updateSubjectFilter() {



    this.count = Number(this.count) + 1;
    this.updatedFilter = this.search_config.subjects_filter.subjects;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }
  public reloadSubjectItems(params: any, fromSubmit: any) {
    this.getSubjectData(params, fromSubmit);
  }
  private _getSubjectRemoteParameters(): NgxIxcheckTableParams {
    let params = <NgxIxcheckTableParams>{};

    params.sortBy = '';
    params.sortAsc = true;
    params.offset = 0;
    params.limit = 10;
    params.lastSeenIdMax = 0;
    params.lastSeenIdMin = 0;
    params.lastOffset = 0;

    return params;
  }
  public resetSubjectFilter() {
    this.search_config.subjects_filter.subjects = {}
    this.getSubjectData(this._getSubjectRemoteParameters(), false);
    this.resetFilterFlag = true;
  }

  onSubjectformSubmit() {
    this.tabset.tabs[1].active = true;
  }

  mapSubjectList(subject: any, i: any) {
    // map all selected subject

    this.index = this.subjectsList.findIndex(C => C.guid === subject.guid)
    if (this.index > -1) {
      this.subjectsList.splice(this.index, 1);
      this.originalSubjectsData.splice(this.index, 1);  //removing it from the original data right table
    }

  }

  public resetSubject() {
    this.ngOnInit();
    this.getSubjectData(this._getSubjectRemoteParameters(), false);
  }

  // Language list functions

  public updateLanguageTable(data: any) {

    this.offset = 0;
    this.search_language_config.languages_filter.languages = data.formData;
    this.config.data[0] = data.bubbleConfig;
    this.getLanguageData(this._getLanguageRemoteParameters(), false);
    this.updatedFilter = {};
  }
  private getLanguageData(params: NgxIxcheckTableParams, fromSubmit: boolean) {
    this.resetFilterFlag = false;
    let difficultyLevelsSearchParams = this.getLanguageSearchParams(params, fromSubmit);
    //call api code here...
    
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = ImportAuthors.getLanguagesList;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      let keyData = [{
        name: "languageGuid",
        value: difficultyLevelsSearchParams.languages_filter.languages.language_guid?difficultyLevelsSearchParams.languages_filter.languages.language_guid:'0'
      }]
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
          this.items = sucessResponse.languages;
          this.languagesList = sucessResponse.languages;
          this.originalLanguagesData = Object.assign([], this.languagesList);

          if (this.languagesList.count > 0) {
            if (this.originaldataAddLanguages.length > 0) {
              for (let i = 0; i < this.originaldataAddLanguages.length; i++) {
                this.mapLanguageList(this.originaldataAddLanguages[i], i);
              }
            }
          }

          // this.notFound = false;
          //paging info
          // this.itemCount = sucessResponse.paging.total_rows;
          // this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          // this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          // this.lastOffset = sucessResponse.paging.last_offset;
          // this.search_language_config.languages_filter.paging = sucessResponse.paging;
        }, errorResponse => {
          if (errorResponse !== undefined) {
            // this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        }
        );
    }
  }
  addLanguage(language: any, i: any) {

    this.languagesList.splice(i, 1);
    this.dataAddLanguages.push({
      language_guid: language.language_guid,
      name: language.name,
      code: language.code
    });
    const indexInOriginalLanguages = this.originalLanguagesData.indexOf(language);
    this.originalLanguagesData.splice(indexInOriginalLanguages, 1);  //removing it from the original data right table
    this.originaldataAddLanguages.push(language);

  }

  revertLanguage(language: any, i: any) {
    this.messageService.confirm(["Are you sure you want to remove as it will remove language?", JSON.stringify(name)], "Delete", "Yes", "NO", "error").subscribe(result => {
      if (result == true) {
        this.messageService.hideModal();
        this.dataAddLanguages.splice(i, 1);
        this.originalLanguagesData.push({
          language_guid: language.language_guid,
          name: language.name,
          code: language.code
        });
        let index = this.originalLanguagesData.indexOf(language);
        this.subjectsList.splice(index, 0, language);
        const indexInOriginalAddedLanguages = this.originaldataAddLanguages.indexOf(language);
        this.originaldataAddLanguages.splice(indexInOriginalAddedLanguages, 1);  //removing it from the original Added data Left table
      }
      else {
        this.messageService.hideModal();
      }
    })
  }
  private getLanguageSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
    this.search_language_config.languages_filter.paging = {
      total_rows: this.itemCount || 0,
      returned_rows: 0,
      direction: params.direction || 0,
      order_dir: params.sortAsc ? 'asc' : 'desc' || "",
      page_size: 10,
      sort_by: params.sortBy || "",
      offset: params.offset || 0,
      last_offset: params.lastOffset || 0,
      last_seen_id_max: params.lastSeenIdMax || 0,
      last_seen_id_min: params.lastSeenIdMin || 0
    }
    return this.search_language_config;
  }
  public updateLanguageFilter() {



    this.count = Number(this.count) + 1;
    this.updatedFilter = this.search_language_config.languages_filter.languages;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }
  public reloadLanguageItems(params: any, fromSubmit: any) {
    this.getLanguageData(params, fromSubmit);
  }
  private _getLanguageRemoteParameters(): NgxIxcheckTableParams {
    let params = <NgxIxcheckTableParams>{};

    params.sortBy = '';
    params.sortAsc = true;
    params.offset = 0;
    params.limit = 10;
    params.lastSeenIdMax = 0;
    params.lastSeenIdMin = 0;
    params.lastOffset = 0;

    return params;
  }
  public resetLanguageFilter() {
    this.search_language_config.languages_filter.languages = {}
    this.getLanguageData(this._getLanguageRemoteParameters(), false);
    this.resetFilterFlag = true;
  }
  onLanguageformSubmit() {
    this.tabset.tabs[2].active = true;
  }

  mapLanguageList(language: any, i: any) {
    // map all selected language

    this.index = this.languagesList.findIndex(C => C.guid === language.guid)
    if (this.index > -1) {
      this.languagesList.splice(this.index, 1);
      this.originalLanguagesData.splice(this.index, 1);  //removing it from the original data right table
    }

  }

  public resetLanguage() {
    this.dataAddLanguages = [];
    this.originaldataAddLanguages = Object.assign([], this.dataAddLanguages);
    this.getLanguageData(this._getLanguageRemoteParameters(), false);
  }

  // Authors list function

  public updateAuthorTable(data: any) {
    this.offset = 0;
    this.search_author_config.authors_filter.authors = data.formData;
    this.search_author_config.authors_filter.authors.subject_guid = [];
    this.search_author_config.authors_filter.authors.language_guid = [];

    for (let i = 0; i < this.originaldataAddSubjects.length; i++) {
      this.search_author_config.authors_filter.authors.subject_guid.push({
        "guid": this.originaldataAddSubjects[i].subject_guid
      })
    }
    for (let i = 0; i < this.originaldataAddLanguages.length; i++) {
      this.search_author_config.authors_filter.authors.language_guid.push({
        "guid": this.originaldataAddLanguages[i].language_guid
      })
    }
    this.config.data[0] = data.bubbleConfig;
    this.getAuthorData(this._getAuthorRemoteParameters(), false);
    this.updatedFilter = {};
  }
  private getAuthorData(params: NgxIxcheckTableParams, fromSubmit: boolean) {

    this.resetFilterFlag = false;
    let authorsSearchParams = this.getAuthorSearchParams(params, fromSubmit);
    //call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = ImportAuthors.getAuthorsList;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.HttpPostParams = authorsSearchParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.items = sucessResponse.authors;
          this.authorsList = sucessResponse.authors;
          
          this.originalAuthorsData = Object.assign([], this.authorsList.map((e, index) => ({ "index": index + 1, ...e })));
          //console.log(this.originalAuthorsData);
          this.notFound = false;
          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.search_author_config.authors_filter.paging = sucessResponse.paging;
        }, errorResponse => {
          this.originalAuthorsData = [];
          if (errorResponse !== undefined) {
            this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        }
        );
    }
  }
  public reloadItems(params, fromSubmit) {
    this.getAuthorData(params, fromSubmit);
  }
  addRow(data: any) {

    let item = this.originalAuthorsData.find(c => c.index === data.index);
    if (item) {
      if (item.is_select === '0') {
        this.originalAuthorsData.find(c => c.index === data.index).is_select = '1';
      }
      else {
        this.originalAuthorsData.find(c => c.index === data.index).is_select = '0';
      }

    }
  }
  private getAuthorSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {

    this.search_author_config.authors_filter.paging = {
      total_rows: this.itemCount || 0,
      returned_rows: 0,
      direction: params.direction || 0,
      order_dir: params.sortAsc ? 'asc' : 'desc' || "",
      page_size: 10,
      sort_by: params.sortBy || "",
      offset: params.offset || 0,
      last_offset: params.lastOffset || 0,
      last_seen_id_max: params.lastSeenIdMax || 0,
      last_seen_id_min: params.lastSeenIdMin || 0
    }
    return this.search_author_config;
  }
  public updateAuthorFilter() {
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.search_author_config.authors_filter.authors;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }
  public reloadAuthorItems(params: any, fromSubmit: any) {
    this.getLanguageData(params, fromSubmit);
  }
  private _getAuthorRemoteParameters(): NgxIxcheckTableParams {
    let params = <NgxIxcheckTableParams>{};
    params.sortBy = '';
    params.sortAsc = true;
    params.offset = 0;
    params.limit = 10;
    params.lastSeenIdMax = 0;
    params.lastSeenIdMin = 0;
    params.lastOffset = 0;
    return params;
  }
  public resetAuthorFilter() {
    this.search_author_config.authors_filter.authors = {}
    this.getLanguageData(this._getLanguageRemoteParameters(), false);
    this.resetFilterFlag = true;
  }

  onAuthorsformSubmit() {
    this.getImportJson();
  }

  getImportJson() {
    this.restService.ApiEndPointUrlOrKey = ImportAuthors.getImportJson;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = this.importParams();
    if (this.importParams()) {
      this.restService.callApi().subscribe(successResponse => {
        this.importJson = successResponse;
        console.log(successResponse)
        this.importMeta(this.importJson);
      }, errorResponse => {
        console.error('ERROR: ', errorResponse);
      });
    }
  }

  importParams() {
    if (this.originalAuthorsData.filter(ob => ob.is_select === '1').length > 0) {
      var parameters = {
        imports_parameter: {
          author_details_guid: this.originalAuthorsData.filter(ob => ob.is_select === '1').map(s => ({ "guid": s.author_details_guid }))
        }
      };
      return parameters;
    }
    else {
      this.messageService.ok('Please select atlest one Author !');
    }
  }

  importMeta(parameters: any) {
    this.restService.ApiEndPointUrlOrKey = ImportAuthors.saveImportMeta;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = parameters;
    //call api
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
          if (result == true) { // OK = true for redirection
            this.messageService.hideModal();
            this.router.navigate(['author/imported']);
          }
          else { // NO/CANCEL = false
            this.messageService.hideModal();
          }
        });
      }, errorResponse => {
        if (errorResponse !== undefined) {
          // this.messageService.ok(errorResponse);
        }
      }
      );
  }

  public resetAuthors() {
    this.getAuthorData(this._getAuthorRemoteParameters(), false);
  }

  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }

  public resetFilter() {

    if (this.tabset.tabs[0].active == true) {
      this.search_config.subjects_filter.subjects = {}
      this.getSubjectData(this._getSubjectRemoteParameters(), false);
      // this.resetFilterFlag = true;
    }

    if (this.tabset.tabs[1].active == true) {
      this.search_language_config.languages_filter.languages = {}
      this.getLanguageData(this._getLanguageRemoteParameters(), false);
      //this.resetFilterFlag = true;
    }

    if (this.tabset.tabs[2].active == true) {
      this.search_author_config.authors_filter.authors = {}

      this.search_author_config.authors_filter.authors.subject_guid = [];
      this.search_author_config.authors_filter.authors.language_guid = [];

      for (let i = 0; i < this.originaldataAddSubjects.length; i++) {
        this.search_author_config.authors_filter.authors.subject_guid.push({
          "guid": this.originaldataAddSubjects[i].subject_guid
        })
      }
      for (let i = 0; i < this.originaldataAddLanguages.length; i++) {
        this.search_author_config.authors_filter.authors.language_guid.push({
          "guid": this.originaldataAddLanguages[i].language_guid
        })
      }
      this.getAuthorData(this._getAuthorRemoteParameters(), false);
      this.resetFilterFlag = true;
    }
  }

  public updateSearch(removedId: string) {

  }
}