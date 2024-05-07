import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormClass } from 'src/app/shared/classes/registration/form.class';
import { PageClass } from 'src/app/shared/classes/registration/page.class';
import { SectionClass } from 'src/app/shared/classes/registration/section.class';
import { UUID } from 'angular2-uuid';
import { TabsetComponent } from 'ngx-bootstrap';
import IxcheckComponents from '../../../../../assets/config/appmodulesandroutes.json';

import { Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service.js';
import { Registration } from '../../../../shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from '../../../../shared/models/app.models';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service.js';

@Component({
  selector: 'app-layout-add',
  templateUrl: './layout-add.component.html',
  styleUrls: ['./layout-add.component.scss']
})
export class LayoutAddComponent implements OnInit {
  @ViewChild('filterOpen', { static: false }) filterOpen: ElementRef<HTMLElement>;
  initialLayout = true;
  mainLayout = false;
  private componentsList: any = {};
  layoutName: string = "";
  registrationList: any = [];
  layoutTypeList: any = [];
  //Tabs
  @ViewChild('pagesTabs', { static: false }) pageTabs: TabsetComponent;
  @ViewChild('settingTabs', { static: false }) settingTabs: TabsetComponent;
  //modal pop up references  
  addPageModalRef: BsModalRef;
  editPageModalRef: BsModalRef;
  addSectionModalRef: BsModalRef;
  editSectionModalRef: BsModalRef;
  editComponentSettingsModalRef: BsModalRef;

  //form groups
  public initialLayoutFormGroup: FormGroup;
  formClass: FormClass = new FormClass();
  templateForm: FormGroup = new FormGroup({});
  addPageForm: FormGroup;
  editPageForm: FormGroup;
  addSectionForm: FormGroup;
  editSectionForm: FormGroup;
  componentSettingsForm: FormGroup;
  currentSelectedPageId: string;
  currentSelectedSectionId: string;
  componentObject: any;
  addedComponents: any = [];
  searchedComponents: any = [];
  addedSections: any = [];
  //gridster configration
  gridsterConfigration: GridsterConfig = {
    pushItems: true,
    minCols: 12,
    maxCols: 12,
    //minRows: 7,
    setGridSize: true,
    mobileBreakpoint: 750,
    gridType: GridType.VerticalFixed,
    fixedRowHeight: 80,
    resizable: {
      enabled: true
    },
    draggable: {
      enabled: true
    }
  };

  constructor(
    private primaryHeader: PrimaryHeaderService,
    private modalService: BsModalService,
    private messageService: MessageService,
    private restService: GlobalRestService,
    private router: Router
  ) { }
  ngOnInit() {
    this.primaryHeader.pageTitle.next("LAYOUT ADD");
    //initializing components list  
    this.componentsList = IxcheckComponents;
    //setting default value
    this.searchedComponents = this.componentsList.ixcheckComponents[0].components;

    this.setUpPageForms();
    this.getRegistrationsList();
    this.getLayoutTypeList();
    this.setUpSectionForms();
  }

  public getRegistrationsList() {

    this.restService.ApiEndPointUrlOrKey = Registration.getRegistrationTypeList;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        //console.log(sucessResponse);
        if (sucessResponse.registrations) {
          this.registrationList = sucessResponse.registrations;
        }
      }, errorResponse => {
        if (errorResponse !== undefined) {
        }
      });
  }


  public getLayoutTypeList() {
    this.restService.ApiEndPointUrlOrKey = Registration.getLayoutTypeList;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.layoutTypeList = sucessResponse.layout_type;
      }, errorResponse => {
        if (errorResponse !== undefined) {
        }
      });
  }
  public filterClick() {
    let el: HTMLElement = this.filterOpen.nativeElement;
    el.click();
  }

  //#region **********Methods for page**********  
  onInitialLayoutFormSubmit() {
    if (this.initialLayoutFormGroup.valid) {
      //initializting layout object
      let selectedRegType = this.registrationList.find(e => e.guid === this.initialLayoutFormGroup.get('layoutRegType').value);
      let selectedLayoutType = this.layoutTypeList.find(e => e.layout_type_guid === this.initialLayoutFormGroup.get('layoutType').value);

      this.formClass.layout_guid = UUID.UUID();
      this.formClass.name = this.initialLayoutFormGroup.get('layoutName').value;
      this.formClass.layout_code = this.initialLayoutFormGroup.get('layoutCode').value;
      this.formClass.layout_code = this.initialLayoutFormGroup.get('layoutCode').value;
      //this.formClass.layout_exam_type = this.initialLayoutFormGroup.get('layoutExamType').value;
      //this.formClass.layout_exam_type = selectedRegType.code;
      this.formClass.layout_registration_guid = selectedRegType.guid;
      this.formClass.layout_type = selectedLayoutType.code;
      this.formClass.layout_type_guid = selectedLayoutType.layout_type_guid;


      //setting page modal
      let page = new PageClass();
      page.page_guid = UUID.UUID(),
        page.page_name = this.initialLayoutFormGroup.get('sectionGroupName').value;
      this.formClass.pages.push(page);
      this.currentSelectedPageId = page.page_guid;

      this.initialLayout = false;
      this.mainLayout = true;
      this.filterClick();
    }
    else {
      document.getElementById('initialLayoutForm').classList.add("was-validated");
    }

  }

  //initializing page add & edit forms  
  setUpPageForms() {
    //setting initial form controls
    this.initialLayoutFormGroup = new FormGroup({
      layoutCode: new FormControl('', [Validators.required]),
      layoutName: new FormControl('', [Validators.required]),
      layoutRegType: new FormControl('', [Validators.required]),
      layoutType: new FormControl('', [Validators.required]),
      sectionGroupName: new FormControl('', [Validators.required])
    })
    //setting add page form controls
    this.addPageForm = new FormGroup({
      pageName: new FormControl('', Validators.required)
    });

    //setting edit page form controls
    this.editPageForm = new FormGroup({
      pageName: new FormControl('', Validators.required)
    });

  }

  //Opening modal popup for add new page 
  openAddPageModel(newPageModalTemplate: TemplateRef<any>) {
    this.addPageModalRef = this.modalService.show(newPageModalTemplate, { backdrop: 'static', keyboard: false });
  }

  //Adding new page
  onAddNewPageSubmit() {
    if (this.addPageForm.valid) {
      //setting page modal
      let page = new PageClass();
      page.page_guid = UUID.UUID(),
        page.page_name = this.addPageForm.value.pageName;
      this.formClass.pages.push(page);
      this.currentSelectedPageId = page.page_guid;
      this.addPageForm.reset();
      this.addPageModalRef.hide();
    }

  }

  //opening modal for edit page details
  openEditPageModel(editPageModalTemplate: TemplateRef<any>) {
    if (this.currentSelectedPageId) {
      let page = this.formClass.pages.find(p => p.page_guid === this.currentSelectedPageId);
      if (page) {
        this.editPageForm.setValue({
          pageName: page.page_name
        })
        this.editPageModalRef = this.modalService.show(editPageModalTemplate, { backdrop: 'static', keyboard: false });
      }
    }
  }

  //edit page form submit
  onEditPageSubmit() {
    if (this.editPageForm.valid) {
      let page = this.formClass.pages.find(p => p.page_guid === this.currentSelectedPageId);
      page.page_name = this.editPageForm.value.pageName;
      this.currentSelectedPageId = page.page_guid;
      this.editPageForm.reset();
      this.editPageModalRef.hide();
    }
  }

  //Setting current active page id  
  setActivePageId(pageId: any) {
    if (pageId) this.currentSelectedPageId = pageId;
  }

  //deleting page
  onDeletePage(pageId: any) {
    this.messageService.confirm(["Do you want to delete this page?"], 'Delete Page', 'DELETE', 'CANCEL')
      .subscribe(userResponse => {
        if (userResponse) {
          let itemIndex = this.formClass.pages.findIndex(p => p.page_guid === pageId);
          this.formClass.pages.splice(itemIndex, 1);
        }
        this.messageService.hideModal();
      })
  }

  //#endregion

  //#region **********Methods for section********** 

  //initializing section add & edit forms   
  setUpSectionForms() {
    //setting add page form controls
    this.addSectionForm = new FormGroup({
      sectionName: new FormControl('', Validators.required),
      visibility: new FormControl(1, Validators.required)
    });

    //setting edit page form controls
    this.editSectionForm = new FormGroup({
      sectionName: new FormControl('', Validators.required),
      visibility: new FormControl(1, Validators.required)
    });
  }

  //Setting current active section id
  setSectionId(sectionId: any, event: any) {
    if (sectionId && sectionId !== this.currentSelectedSectionId)
      this.currentSelectedSectionId = sectionId;
  }

  //Opening modal popup for add new section 
  openAddSectionModel(newSectionModalTemplate: TemplateRef<any>) {
    this.addSectionModalRef = this.modalService.show(newSectionModalTemplate, { backdrop: 'static', keyboard: false });
  }

  //Adding new section
  onAddNewSectionSubmit() {

    if (this.addSectionForm.valid) {
      //setting section modal
      let section = new SectionClass();
      section.section_guid = UUID.UUID();
      section.section_name = this.addSectionForm.value.sectionName;
      section.section_visibility = this.addSectionForm.value.visibility;
      this.formClass.pages.find(p => p.page_guid === this.currentSelectedPageId).sections.push(section);
      this.currentSelectedSectionId = section.section_guid;
      this.addSectionForm.reset();
      this.addSectionForm.patchValue({
        sectionName: '',
        visibility: 1
      });
      this.addSectionModalRef.hide();
    }

  }

  //Opening modal popup for edit section details
  openEditSectionModel(editSectionModalTemplate: TemplateRef<any>, sectionId: any) {

    if (sectionId) {
      this.currentSelectedSectionId = sectionId;
      let page = this.formClass.pages.find(p => p.page_guid === this.currentSelectedPageId);
      let section = page.sections.find(s => s.section_guid === this.currentSelectedSectionId);

      if (section) {
        this.editSectionForm.setValue({
          sectionName: section.section_name,
          visibility: section.section_visibility
        })
        this.editSectionModalRef = this.modalService.show(editSectionModalTemplate, { backdrop: 'static', keyboard: false });
      }
    }

  }

  //edit section form submit
  onEditSectionSubmit() {
    if (this.editSectionForm.valid) {

      let page = this.formClass.pages.find(p => p.page_guid === this.currentSelectedPageId);
      let section = page.sections.find(s => s.section_guid === this.currentSelectedSectionId);
      section.section_name = this.editSectionForm.value.sectionName;
      section.section_visibility = this.editSectionForm.value.visibility;
      //this.formClass.pages.push(page);
      this.currentSelectedSectionId = section.section_guid;
      this.editSectionForm.reset();
      this.editSectionModalRef.hide();


    }
  }

  //Deleting section
  deleteSection(pageId: any, sectionId: any) {
    this.messageService.confirm(["Do you want to delete this section?"], 'Delete Section', 'DELETE', 'CANCEL').subscribe(userResponse => {
      if (userResponse) {
        let itemIndex = this.formClass.pages.find(p => p.page_guid === pageId)
          .sections.findIndex(s => s.section_guid === sectionId);

        this.formClass.pages.find(p => p.page_guid === pageId)
          .sections.splice(itemIndex, 1);
      }
      this.messageService.hideModal();
    })


  }

  //Adding section
  addSection(pageId: any) {
    let section = new SectionClass();
    section.section_guid = UUID.UUID();
    section.section_name = "Section 1";
    this.formClass.pages.find(p => p.page_guid === pageId).sections.push(section);
    this.currentSelectedSectionId = section.section_guid;
  }

  //#endregion  

  //#region **********Methods for component**********

  //component search
  onComponentSearch(componentName: string) {
    if (componentName) {
      this.searchedComponents = this.componentsList.ixcheckComponents[0].components.filter((c: any) => c.value.toLowerCase().indexOf(componentName.toLocaleLowerCase()) !== -1)
    }
    else {
      this.searchedComponents = this.componentsList.ixcheckComponents[0].components;
    }
  }

  //Get called when component is dropped inside gridster div
  onComponentDroped(componentDetails: any, componentSettingsModalTemplate: TemplateRef<any>) {
    //if page and section is available
    if (this.currentSelectedPageId && this.currentSelectedSectionId) {
      let component = {
        comp_guid: UUID.UUID(),
        comp_name: componentDetails.componentName,
        cols: 3,
        rows: 1,
        x: 0,
        y: 0,
        settings: componentDetails.settings,
        validations: componentDetails.validations,
        conditional: componentDetails.conditional,
        ai_parameters: componentDetails.ai_parameters,
        subComponents: componentDetails.subComponents,
        dataObject: {}
      };
      let page = this.formClass.pages.find(p => p.page_guid === this.currentSelectedPageId);
      page.sections.find(s => s.section_guid === this.currentSelectedSectionId).comps.push(component);
    }
  }

  //Opening component settings modal popup
  openComponentSettingsModal(pageId: any, sectionId: any, componentId: any, componentSettingsModalTemplate: TemplateRef<any>) {
    let component = this.formClass.pages.find(p => p.page_guid === pageId)
      .sections.find(s => s.section_guid === sectionId)
      .comps.find(c => c.comp_guid === componentId);
    this.addedSections = this.formClass.pages.find(p => p.page_guid === pageId).sections;
    this.addedComponents = this.formClass.pages.find(p => p.page_guid === pageId)
      .sections.find(s => s.section_guid === sectionId).comps;

    this.componentObject = component;

    this.editComponentSettingsModalRef = this.modalService.show(componentSettingsModalTemplate, { class: 'modal-lg', backdrop: 'static', keyboard: false });
  }

  //Getting outputs for component settings after submit
  getComponentSettings(data: any) {
    var componentList = this.formClass.pages.find(p => p.page_guid === this.currentSelectedPageId)
      .sections.find(s => s.section_guid === this.currentSelectedSectionId).comps;

    var selectedComponent = componentList.find(c => c.comp_guid === this.componentObject.comp_guid);

    if (selectedComponent) {
      //getting comopent index
      var index = componentList.indexOf(selectedComponent);

      //creating conditional object based on output      
      let conditionalObject;
      if (data.conditional && data.conditional.changeType) {
        conditionalObject = data.conditional
      }

      //updating component  
      //replacing object with new one as updating old one causing error.          
      let component = {
        comp_guid: selectedComponent.comp_guid,
        comp_name: selectedComponent.comp_name,
        cols: selectedComponent.cols,
        rows: selectedComponent.rows,
        x: selectedComponent.x,
        y: selectedComponent.y,
        validations: data.validations,
        settings: data.settings,
        ai_parameters: data.ai_parameters,
        subComponents: data.subComponents,
        conditional: conditionalObject,
        data_object: {}
      };

      componentList[index] = component;
      this.formClass.pages.find(p => p.page_guid === this.currentSelectedPageId)
        .sections.find(s => s.section_guid === this.currentSelectedSectionId).comps = componentList;
    }


    //this.componentObject = null;  
    this.editComponentSettingsModalRef.hide();
  }

  //Deleting added component inside gridster
  deleteComponent(pageId: any, sectionId: any, componentId: any) {
    this.messageService.confirm(["Do you want to delete this component?"], 'Delete Component', 'DELETE', 'CANCEL').subscribe(userResponse => {
      if (userResponse) {
        let componentIndex = this.formClass.pages.find(p => p.page_guid === pageId)
          .sections.find(s => s.section_guid === sectionId)
          .comps.findIndex(c => c.comp_guid === componentId);

        this.formClass.pages.find(p => p.page_guid === pageId)
          .sections.find(s => s.section_guid === sectionId)
          .comps.splice(componentIndex, 1);
      }
      this.messageService.hideModal();
    })
  }
  //#endregion

  //Saving template in db
  saveTemplate() {

    if (this.initialLayoutFormGroup.valid) {
      this.restService.ApiEndPointUrlOrKey = Registration.addLayout;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      let _httpParams = {
        "form": this.formClass
      }
      this.restService.HttpPostParams = _httpParams;
      this.restService.callApi().subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            this.router.navigateByUrl('/registration/layouts');
          }
          else {
            this.messageService.hideModal();
          }
        });
      }, errorResponse => {
        if (errorResponse.httpErrorResponse.data[0].attributes.message[0].includes('.')) {
          let errors = errorResponse.httpErrorResponse.data[0].attributes.message[0].split('.');
          errorResponse.httpErrorResponse.data[0].attributes.message = errors
        }

        this.messageService.alert(errorResponse.httpErrorResponse);
      }
      );
    }
    else {
      this.messageService.ok("Please provide required values.");
    }
  }
}
