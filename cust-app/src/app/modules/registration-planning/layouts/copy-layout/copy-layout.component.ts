import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { PageClass } from 'src/app/shared/classes/registration/page.class';
import { TabsetComponent, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormClass, FromSubmitClass, FormClassList, LayoutDetails } from 'src/app/shared/classes/registration/form.class';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service.js';
import { Registration } from '../../../../shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from '../../../../shared/models/app.models';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GridsterConfig, GridType } from 'angular-gridster2';
import IxcheckComponents from '../../../../../assets/config/appmodulesandroutes.json';
import { UUID } from 'angular2-uuid';
import { SectionClass } from 'src/app/shared/classes/registration/section.class';


@Component({
  selector: 'app-copy-layout',
  templateUrl: './copy-layout.component.html',
  styleUrls: ['./copy-layout.component.scss']
})
export class CopyLayoutComponent implements OnInit {

  private componentsList: any = {};
  layoutName: string = "";
  registrationList: any=[];
  layoutTypeList: any=[];
  //Tabs
  @ViewChild('pagesTabs', { static: false }) pageTabs: TabsetComponent;
  @ViewChild('settingTabs', { static: false }) settingTabs: TabsetComponent;
  @ViewChild('filterOpen',{ static: false }) filterOpen: ElementRef<HTMLElement>;

  //modal pop up references  
  private addPageModalRef: BsModalRef;
  private editPageModalRef: BsModalRef;
  private addSectionModalRef: BsModalRef;
  private editSectionModalRef: BsModalRef;
  private editComponentSettingsModalRef: BsModalRef;

  //form groups
  layoutDetails: LayoutDetails;
  public initialLayoutFormGroup: FormGroup;
  templateForm: FormGroup = new FormGroup({});
  private addPageForm: FormGroup;
  private editPageForm: FormGroup;
  private addSectionForm: FormGroup;
  private editSectionForm: FormGroup;
  private componentSettingsForm: FormGroup;
  //
  private currentSelectedPageId: string;
  private currentSelectedSectionId: string;
  private componentObject: any;
  private addedComponents: any = [];
  private searchedComponents: any = [];
  public success_response: any;


  //gridster configration
  private gridsterConfigration: GridsterConfig = {
    pushItems: true,
    minCols: 12,    
    maxCols: 12,    
    //minRows: 6,   
    mobileBreakpoint: 750, 
    setGridSize: true,
    gridType: GridType.VerticalFixed,
    fixedRowHeight:80,  
    resizable: {
      enabled: true
    },
    draggable: {
      enabled: true
    }
  };
  constructor(
    private modalService: BsModalService,
    private messageService: MessageService,
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.getTemplateDetails(params['id']);
    }, error => {
      console.error('Error: ', error);
    });
    this.getRegistrationList();
    this.getLayoutTypeList();
    this.setUpPageForms();
    this.setUpSectionForms();
  }

  public filterClick() {
    let el: HTMLElement = this.filterOpen.nativeElement;
    el.click();
  }
  public getRegistrationList()
  {
    this.restService.ApiEndPointUrlOrKey = Registration.getRegistrationTypeList;    
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
    this.restService.callApi()
      .subscribe(sucessResponse => {  
        if(sucessResponse.registrations)
        {
          this.registrationList=sucessResponse.registrations;
        }        
      }, errorResponse => {
        if (errorResponse !== undefined) {          
        }
      });
  }
  public getLayoutTypeList()
  {
    this.restService.ApiEndPointUrlOrKey = Registration.getLayoutTypeList;    
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
    this.restService.callApi()
      .subscribe(sucessResponse => {  
        this.layoutTypeList=sucessResponse.layout_type;                
      }, errorResponse => {
        if (errorResponse !== undefined) {          
        }
      });
  }
  //Getting template details by id
  getTemplateDetails(id) {
    var keyData = [
      {
        "name": "layoutId",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registration.viewLayout;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {       
        this.layoutDetails = sucessResponse;                
        this.layoutName=this.layoutDetails.layout.name;
        this.initializeLayoutFormValues();
        if(this.layoutDetails.layout.pages.length>0)
        {          
          //setting initial selected page and section
          this.currentSelectedPageId=this.layoutDetails.layout.pages[0].page_guid;
          this.currentSelectedSectionId=this.layoutDetails.layout.pages[0].sections[0].section_guid;
        }                        
        //initializing components list  
        this.componentsList = IxcheckComponents;
        //setting default value
        this.searchedComponents = this.componentsList.ixcheckComponents[0].components;       
      }, errorResponse => {
        //this.messageService.ok('No data available...');
      });
  }
  //initializing layout form values
  initializeLayoutFormValues()
  {
     //setting initial form controls
     this.initialLayoutFormGroup = new FormGroup({
      layoutCode: new FormControl('', [Validators.required]),
      layoutName: new FormControl('', [Validators.required]),
      //layoutRegType: new FormControl(this.layoutDetails.layout.layout_registrations_guid,[Validators.required]),
      layoutRegType: new FormControl('',[Validators.required]),
      layoutType: new FormControl(this.layoutDetails.layout.layout_type_guid,[Validators.required]),
     // sectionGroupName: new FormControl(this.layoutDetails.layout.layout_exam_type,[Validators.required])
    })
  } 
  
   onInitialLayoutFormSubmit() {
    if (this.initialLayoutFormGroup.valid) {      
      //initializting layout object        
      let selectedRegistration=this.registrationList.find(e=>e.guid === this.initialLayoutFormGroup.get('layoutRegType').value);
      let selectedLayoutType=this.layoutTypeList.find(e=>e.layout_type_guid === this.initialLayoutFormGroup.get('layoutType').value);
         
      this.layoutDetails.layout.name = this.initialLayoutFormGroup.get('layoutName').value;
      this.layoutDetails.layout.layout_code = this.initialLayoutFormGroup.get('layoutCode').value;    
      this.layoutDetails.layout.layout_registration_guid = selectedRegistration.guid;
      //this.layoutDetails.layout.layout_exam_type = selectedExamType.code;
      //this.layoutDetails.layout.layout_exam_type_guid = selectedExamType.exam_type_guid;
      this.layoutDetails.layout.layout_type = selectedLayoutType.code;
      this.layoutDetails.layout.layout_type_guid = selectedLayoutType.layout_type_guid;
    }

  }

  //#region **********Methods for page**********

  //initializing page add & edit forms  
  setUpPageForms() {
   
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
    this.addPageModalRef = this.modalService.show(newPageModalTemplate);
  }

  //Adding new page
  onAddNewPageSubmit() {
    if (this.addPageForm.valid) {
      //setting page modal
      let page = new PageClass();
      page.page_guid = UUID.UUID(),
        page.page_name = this.addPageForm.value.pageName;
        this.layoutDetails.layout.pages.push(page);
      this.currentSelectedPageId = page.page_guid;
      this.addPageForm.reset();
      this.addPageModalRef.hide();
    }

  }

  //opening modal for edit page details
  openEditPageModel(editPageModalTemplate: TemplateRef<any>) {    
    if (this.currentSelectedPageId) {
      let page = this.layoutDetails.layout.pages.find(p => p.page_guid === this.currentSelectedPageId);
      if (page) {
        this.editPageForm.setValue({
          pageName: page.page_name
        })
        this.editPageModalRef = this.modalService.show(editPageModalTemplate);
      }
    }
  }

  //edit page form submit
  onEditPageSubmit() {
    if (this.editPageForm.valid) {
      let page = this.layoutDetails.layout.pages.find(p => p.page_guid === this.currentSelectedPageId);
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
          let itemIndex = this.layoutDetails.layout.pages.findIndex(p => p.page_guid === pageId);
          this.layoutDetails.layout.pages.splice(itemIndex, 1);
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
    this.addSectionModalRef = this.modalService.show(newSectionModalTemplate);
  }

  //Adding new section
  onAddNewSectionSubmit() {

    if (this.addSectionForm.valid) {
      //setting section modal
      let section = new SectionClass();
      section.section_guid = UUID.UUID();
      section.section_name = this.addSectionForm.value.sectionName;
      section.section_visibility=this.addSectionForm.value.visibility;
      this.layoutDetails.layout.pages.find(p => p.page_guid === this.currentSelectedPageId).sections.push(section);
      this.currentSelectedSectionId = section.section_guid;      
      this.addSectionForm.reset();
      this.addSectionForm.patchValue({
        sectionName:'',
        visibility:1
      });

      this.addSectionModalRef.hide();
    }

  }

  //Opening modal popup for edit section details
  openEditSectionModel(editSectionModalTemplate: TemplateRef<any>) {

    if (this.currentSelectedSectionId) {
      let page = this.layoutDetails.layout.pages.find(p => p.page_guid === this.currentSelectedPageId);
      let section = page.sections.find(s => s.section_guid === this.currentSelectedSectionId);

      if (section) {
        this.editSectionForm.setValue({
          sectionName: section.section_name,
          visibility:section.section_visibility
        })
        this.editSectionModalRef = this.modalService.show(editSectionModalTemplate);
      }
    }

  }

  //edit section form submit
  onEditSectionSubmit() {
    if (this.editSectionForm.valid) {

      let page = this.layoutDetails.layout.pages.find(p => p.page_guid === this.currentSelectedPageId);
      let section = page.sections.find(s => s.section_guid === this.currentSelectedSectionId);
      section.section_name = this.editSectionForm.value.sectionName;
      section.section_visibility=this.editSectionForm.value.visibility;
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
        let itemIndex = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
          .sections.findIndex(s => s.section_guid === sectionId);

          this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
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
    this.layoutDetails.layout.pages.find(p => p.page_guid === pageId).sections.push(section);
    this.currentSelectedSectionId = section.section_guid;
  }

  //#endregion  

  //#region **********Methods for component**********

  //component search
  onComponentSearch(componentName: string) {
    if (componentName) {
      this.searchedComponents = this.componentsList.ixcheckComponents[0].components.filter((c: any) => c.value.toLowerCase().indexOf(componentName) !== -1)
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
        subComponents: componentDetails.subComponents,
        dataObject: {}
      };
      let page = this.layoutDetails.layout.pages.find(p => p.page_guid === this.currentSelectedPageId);
      page.sections.find(s => s.section_guid === this.currentSelectedSectionId).comps.push(component);
    }
  }

  //Opening component settings modal popup
  openComponentSettingsModal(pageId: any, sectionId: any, componentId: any, componentSettingsModalTemplate: TemplateRef<any>) {    
    let component = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
      .sections.find(s => s.section_guid === sectionId)
      .comps.find(c => c.comp_guid === componentId);

    this.addedComponents = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
      .sections.find(s => s.section_guid === sectionId).comps;

    this.componentObject = component;

    this.editComponentSettingsModalRef = this.modalService.show(componentSettingsModalTemplate);
  }

  //Getting outputs for component settings after submit
  getComponentSettings(data: any) {
    var componentList = this.layoutDetails.layout.pages.find(p => p.page_guid === this.currentSelectedPageId)
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
        conditional: conditionalObject,
        subComponents: data.subComponents,
        data_object: {}
      };

      componentList[index] = component;
      this.layoutDetails.layout.pages.find(p => p.page_guid === this.currentSelectedPageId)
        .sections.find(s => s.section_guid === this.currentSelectedSectionId).comps = componentList;
    }


    //this.componentObject = null;  
    this.editComponentSettingsModalRef.hide();
  }

  //Deleting added component inside gridster
  deleteComponent(pageId: any, sectionId: any, componentId: any) {
    this.messageService.confirm(["Do you want to delete this component?"], 'Delete Component', 'DELETE', 'CANCEL').subscribe(userResponse => {
      if (userResponse) {
        let componentIndex = this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
          .sections.find(s => s.section_guid === sectionId)
          .comps.findIndex(c => c.comp_guid === componentId);

          this.layoutDetails.layout.pages.find(p => p.page_guid === pageId)
          .sections.find(s => s.section_guid === sectionId)
          .comps.splice(componentIndex, 1);
      }
      this.messageService.hideModal();
    })
  }
  //#endregion


  //saving template changes in db 
  saveTemplateChanges()
  {  
    if (this.initialLayoutFormGroup.valid) {  
      this.onInitialLayoutFormSubmit();  
      this.restService.ApiEndPointUrlOrKey = Registration.addLayout;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;  
      let _httpParams = {
        "form":this.layoutDetails.layout
      }
      this.restService.HttpPostParams = _httpParams;
      this.restService.callApi().subscribe(sucessResponse => {
        //this.messageService.notify(sucessResponse);
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
          if (result == true) {
            this.router.navigateByUrl("/registration/layouts");
            this.messageService.hideModal();
          }
          else {
            this.messageService.hideModal();
          }
        });
        
        this.ngOnInit();       
      }, errorResponse => {
        if(errorResponse.httpErrorResponse.data[0].attributes.message[0].includes('.'))
        {
        let errors=errorResponse.httpErrorResponse.data[0].attributes.message[0].split('.');
        errorResponse.httpErrorResponse.data[0].attributes.message=errors
        }
        
        this.messageService.alert(errorResponse.httpErrorResponse);
      }
      );
     }
     else
     {
      document.getElementById('initialLayoutForm').classList.add("was-validated");            
      this.messageService.ok("Please provide required values.");  
     }     
   
  }

// ngAfterViewInit()
//  {
//   this.filterClick();
//  }

}
