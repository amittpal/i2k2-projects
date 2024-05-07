import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from '../../../services/rest/global-rest.service';
import { HandelError, ProfileEdit } from '../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';


@Component({
  selector: 'app-userprofile-edit',
  templateUrl: './userprofile-edit.component.html',
  styleUrls: ['./userprofile-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  public editOrgsUserFormGroup: FormGroup;
  public orgId;

  userId;
  public dataUserType;
  orginalData;

  dataPermissions;
  dataAddedPermissions;
  originalPermissionsData: Array<any>;
  originalAdeddPermissions: Array<any>;
  resetPermissionsUnassigned;
  searchUserModal;
  searchAddedUserModal;
  resetPermissions;
  public filterModel: FilterModel = new FilterModel();
  public userTypeId: any;
  private appRoutes: any = {};

  constructor(private route: ActivatedRoute, private restService: GlobalRestService, private authService: AuthService,
    private configService: AppsettingsConfService, private messageService: MessageService, private router: Router,
    private primaryHeader: PrimaryHeaderService,
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    this.custID = this.authService.getUserGUId();
    this.initilizeAutorFields();
    this.getDepartment();
    this.getDesignation();
    this.getHighestQualification();
    this.getSubjects();
    this.getLanguages();
    this.getIdentityTypeList()

    this.custID = this.authService.getUserGUId();
    this.orgId = this.authService.getUserOrgId();
    //setting page title
    this.primaryHeader.pageTitle.next("Profile Edit");
    this.dataPermissions = [];///
    this.dataAddedPermissions = [];
    this.originalAdeddPermissions = [];
    this.editOrgsUserFormGroup = new FormGroup({
      user_name: new FormControl({ value: '', disabled: true }),
      email: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]),
      user_type_id: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      user_type: new FormControl('', Validators.required),
      app_id: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      id: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      middle_name: new FormControl('', Validators.required),
      phone_number: new FormControl(''),
      title: new FormControl('', Validators.required),
      org_name: new FormControl('')
    });
    this.orgId = this.authService.getUserOrgId();
    this.route.params.subscribe((params: Params) => {
      this.getData(this.orgId, this.authService.getUserWorkerId());
    });
  }

  private getParams() {
    let params = this.editOrgsUserFormGroup.value;
    params['user_id'] = this.userId;
    params['unassign_permissions'] = this.originalPermissionsData;
    params['assign_permissions'] = this.originalAdeddPermissions;

    return params;

  }

  onformSubmit() {
    if (this.editOrgsUserFormGroup.valid === false) {
      let form = document.getElementById('editOrgsUserForm');
      form.classList.add('was-validated');
    } else if (this.editOrgsUserFormGroup.valid === true) {
      let params = this.getParams();
      // call api code here...      
      if (Object.keys(this.appRoutes).length !== 0) {
        var keyData = [
          {
            "name": "orgId",
            "value": this.orgId
          },
          {
            "name": "userId",
            "value": this.userId
          }
        ];
        this.restService.ApiEndPointUrlOrKey = ProfileEdit.saveEditedOrgsUser;
        params['access_token'] = localStorage.getItem('crmaccessToken')
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi(keyData)
          .subscribe(successResponse => {
            this.messageService.okRedirectModal(successResponse, 'SUCCESS', 'Go to List').subscribe(result => {
              if (result == true) { // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(['main']);
              }
              else { // NO/CANCEL = false
                this.messageService.hideModal();
              }
            });
          }, errorResponse => {
          }
          );
      }
    }
  }


  initializeFields(result) {
    this.userTypeId = result.user_type_id
    this.editOrgsUserFormGroup = new FormGroup({
      user_name: new FormControl(result.user_name, Validators.required),
      email: new FormControl(result.email, Validators.required),
      phone_number: new FormControl(result.phone_number,),
      mobile: new FormControl(result.mobile, [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]),
      user_type_id: new FormControl(result.user_type_id, Validators.required),
      status: new FormControl(result.status, Validators.required),
      user_type: new FormControl(result.user_type, Validators.required),
      app_id: new FormControl(result.app_id, Validators.required),
      first_name: new FormControl(result.first_name, Validators.required),
      id: new FormControl(result.id, Validators.required),
      last_name: new FormControl(result.last_name, Validators.required),
      middle_name: new FormControl(result.middle_name, Validators.required),
      title: new FormControl(result.title, Validators.required),
      org_name: new FormControl(result.org_name)
    });
    this.userId = result.id;
  }
  initializePermissions(result) {
    if (result.unassign_permission_groups != undefined) {
      this.dataPermissions = result.unassign_permission_groups;
      this.originalPermissionsData = Object.assign([], this.dataPermissions);
    }
    if (result.assign_permission_groups != undefined) {
      this.dataAddedPermissions = result.assign_permission_groups;
      this.originalAdeddPermissions = Object.assign([], this.dataAddedPermissions);
    }
  }

  getData(orgID, userID) {
    var keyData = [
      {
        "name": "userId",
        "value": this.authService.getUserUId()
      }
    ];

    this.restService.ApiEndPointUrlOrKey = ProfileEdit.getUserDataByUserId;
    this.restService.HttpPostParams = {

      "user_id": this.authService.getUserUId(),
      "id": this.authService.getUserUId(),
      "access_token": localStorage.getItem('crmaccessToken')
    }

    this.restService.callApi(keyData).subscribe(successResponse => {
      this.initializeFields(successResponse.customer_users[0]);
      this.initializePermissions(successResponse);
      this.setInitilizeAutorFields(successResponse.author_details, successResponse.customer_users[0]);


    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  filterData() {
    let data1 = this.filterModel.appName ? this.filterModel.appName.toLowerCase() : '';;
    let data2 = this.filterModel.groupName ? this.filterModel.groupName.toLowerCase() : '';
    if (data1 && data2) {
      this.dataAddedPermissions = this.originalAdeddPermissions.filter(it => it.app_name.toLowerCase().includes(data1) && it.group_name.toLowerCase().includes(data2));
    } else if (data1 && !data2) {
      this.dataAddedPermissions = this.originalAdeddPermissions.filter(it => it.app_name.toLowerCase().includes(data1));
    } else if (!data1 && data2) {
      this.dataAddedPermissions = this.originalAdeddPermissions.filter(it => it.group_name.toLowerCase().includes(data2));
    } else {
      this.dataAddedPermissions = this.originalAdeddPermissions;
    }
  }
  // allow only numbers
  public checkInput(event) {
    var ctrlCode = (event.ctrlKey) ? event.ctrlKey : event.metaKey;  // get key cross-browser
    var charCode = (event.which) ? event.which : event.keyCode;      // get key cross-browser

    if ( // Allow: home, end, left, right, down, up
      (charCode >= 35 && charCode <= 40)
      // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
      || (charCode == 65 || charCode == 86 || charCode == 67) && (ctrlCode === true)) {
      return true;
    }
    if (charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      return true
    }
  }
  ngOnDestroy() {
  }
  // ***  Author Details  *************************************///

  public addVendorFormGroup: FormGroup;
  public imageBase64: any;
  public custID: any;
  public vendorDetails: any;
  public updateAuthorDetailsForm: FormGroup;
  public authorId;
  // Auther Details Var
  public departmentData: any = [];
  public designationData: any = [];
  public qualificationData: any = [];
  public subjectData: any = [];
  public languageData: any = [];
  public organizationData: any = [];
  public identityTypeList: any = [];
  public img_source;

  initilizeAutorFields() {
    this.updateAuthorDetailsForm = new FormGroup({
      code: new FormControl('', Validators.required),
      title: new FormControl('Mr', Validators.required),
      name: new FormControl('', Validators.required),
      organization_id: new FormControl('', Validators.required),
      department_guid: new FormControl('', Validators.required),
      designation_guid: new FormControl('', Validators.required),
      highest_qualification_guid: new FormControl('', Validators.required),
      subject_guid: new FormControl('', Validators.required),
      experience: new FormControl('', Validators.required),
      language_guid: new FormControl('', Validators.required),
      identity_Type_guid: new FormControl('', Validators.required),
      identity_number: new FormControl(''),
      mobile_number: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{9}')]),
      alternate_mobile_number: new FormControl('', [Validators.pattern('[6-9][0-9]{9}')]),
      rating: new FormControl('', Validators.required),
      email: new FormControl(''),
      id: new FormControl(''),
      photo: new FormControl(''),
      user_id: new FormControl(''),
      author_details_guid: new FormControl(''),
      status: new FormControl(),
      address_id: new FormControl(),
      auth_org_name: new FormControl()
    });
  }
  setInitilizeAutorFields(result, customer_users) {
    if (result) {
      this.img_source = result.photo
      this.authorId = result.id;
      this.updateAuthorDetailsForm = new FormGroup({
        address_id: new FormControl(result.address_id, Validators.required),
        author_details_guid: new FormControl(customer_users.user_guid),
        code: new FormControl(result.code, Validators.required),
        title: new FormControl(result.title, Validators.required),
        name: new FormControl(result.name, Validators.required),
        organization_id: new FormControl(result.organization_id, Validators.required),
        department_guid: new FormControl(result.department_guid, Validators.required),
        designation_guid: new FormControl(result.designation_guid, Validators.required),
        highest_qualification_guid: new FormControl(result.highest_qualification_guid, Validators.required),
        subject_guid: new FormControl(result.subject_guid, Validators.required),
        experience: new FormControl(result.experience, Validators.required),
        language_guid: new FormControl(result.language_guid, Validators.required),
        identity_Type_guid: new FormControl(result.identity_Type_guid, Validators.required),
        identity_number: new FormControl(result.identity_number),
        mobile_number: new FormControl(result.mobile_number, [Validators.required, Validators.pattern('[6-9][0-9]{9}')]),
        alternate_mobile_number: new FormControl(result.alternate_mobile_number, [Validators.pattern('[6-9][0-9]{9}')]),
        rating: new FormControl(result.rating, Validators.required),
        email: new FormControl(result.email),
        id: new FormControl(result.id),
        photo: new FormControl(result.photo),
        user_id: new FormControl(result.user_id),
        status: new FormControl(result.status),
        auth_org_name: new FormControl(customer_users.org_name)
      });
    } else {
      this.updateAuthorDetailsForm = new FormGroup({
        address_id: new FormControl(customer_users.address_id),
        code: new FormControl('', Validators.required),
        title: new FormControl('Mr', Validators.required),
        name: new FormControl('', Validators.required),
        department_guid: new FormControl('', Validators.required),
        designation_guid: new FormControl('', Validators.required),
        highest_qualification_guid: new FormControl('', Validators.required),
        subject_guid: new FormControl('', Validators.required),
        experience: new FormControl('', Validators.required),
        language_guid: new FormControl('', Validators.required),
        identity_Type_guid: new FormControl('', Validators.required),
        identity_number: new FormControl(''),
        mobile_number: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{9}')]),
        alternate_mobile_number: new FormControl('', [Validators.pattern('[6-9][0-9]{9}')]),
        rating: new FormControl('', Validators.required),
        id: new FormControl(''),
        photo: new FormControl(''),
        author_details_guid: new FormControl(customer_users.user_guid),
        status: new FormControl('1'),
        organization_id: new FormControl(customer_users.default_org, Validators.required),
        email: new FormControl(customer_users.email),
        user_id: new FormControl(customer_users.id),
        auth_org_name: new FormControl()

      });
    }
  }

  multiLangComp(c1: any, c2: any): any {
    return c1 && c2 ? c1.language_guid === c2.language_guid : c1 === c2;
  }

  multisubjectComp(c1: any, c2: any): any {
    return c1 && c2 ? c1.subject_guid === c2.subject_guid : c1 === c2;
  }

  getDepartment() {
    this.restService.ApiEndPointUrlOrKey = ProfileEdit.getDepartmrntList;
    debugger
    this.restService.HttpPostParams = {
      "user_id": this.authService.getUserUId(),
      "id": this.authService.getUserUId(),
      "access_token": localStorage.getItem('crmaccessToken')
    };
    this.restService.callApi().subscribe(successResponse => {
      this.departmentData = successResponse.department;
    }, errorResponse => {
      console.error('ERROR', errorResponse.message[0]);
    });
  }

  getDesignation() {
   
    this.restService.ApiEndPointUrlOrKey = ProfileEdit.getDesignationList;
    this.restService.HttpPostParams = {
      "user_id": this.authService.getUserUId(),
      "id": this.authService.getUserUId(),
      "access_token": localStorage.getItem('crmaccessToken')
    };
    this.restService.callApi().subscribe(successResponse => {
      this.designationData = successResponse.designation;
    }, errorResponse => {
      console.error('ERROR', errorResponse.message[0]);
    });
  }
  getHighestQualification() {
   
    this.restService.ApiEndPointUrlOrKey = ProfileEdit.getHighestQualification;
    this.restService.HttpPostParams = {
      "user_id":this.authService.getUserUId(),
      "id": this.authService.getUserUId(),
      "access_token": localStorage.getItem('crmaccessToken')
    };
    this.restService.callApi().subscribe(successResponse => {
      this.qualificationData = successResponse.highest_qualification;
    }, errorResponse => {

      console.error('ERROR', errorResponse.message[0]);
    });
  }

  getSubjects() {
   
    this.restService.ApiEndPointUrlOrKey = ProfileEdit.getSubjectList;
    this.restService.HttpPostParams = {
      "user_id": this.authService.getUserUId(),
      "id": this.authService.getUserUId(),
      "access_token": localStorage.getItem('crmaccessToken')
    };
    this.restService.callApi().subscribe(successResponse => {
      this.subjectData = successResponse.subjects;
    }, errorResponse => {
      console.error('ERROR', errorResponse.message[0])

    });
  }
  getLanguages() {
   
    this.restService.ApiEndPointUrlOrKey = ProfileEdit.getLanguageList;
    this.restService.HttpPostParams = {
      "user_id": this.authService.getUserUId(),
      "id": this.authService.getUserUId(),
      "access_token": localStorage.getItem('crmaccessToken')
    };
    this.restService.callApi().subscribe(successResponse => {
      this.languageData = successResponse.languages;
    }, errorResponse => {
      console.error('ERROR', errorResponse.message[0]);

    })
  }
  getIdentityTypeList() {
   
    this.restService.ApiEndPointUrlOrKey = ProfileEdit.getIdentityType;
    this.restService.HttpPostParams = {
      "user_id": this.authService.getUserUId(),
      "id": this.authService.getUserUId(),
      "access_token": localStorage.getItem('crmaccessToken')
    };
    this.restService.callApi().subscribe(successResponse => {
      this.identityTypeList = successResponse.identity_type;
    }, errorResponse => {
      console.error('ERROR', errorResponse.message[0]);
    });
  }
  onUserChange(event: any) {
    var userType = event.target.options[event.target.options.selectedIndex].text

  }
  changeListener($event): void {
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imageBase64 = myReader.result;
      this.img_source = myReader.result;
    }
    myReader.readAsDataURL(file);
  }
  private getAuthorParams() {

    let language_guid: any = [];
    let languages = this.updateAuthorDetailsForm.controls.language_guid.value;
    for (let i = 0; i < languages.count; i++) {
      language_guid.push(languages[i]
      );

    }

    let subject_guid: any = [];
    let subjects = this.updateAuthorDetailsForm.controls.subject_guid.value;
    for (let i = 0; i < subjects.count; i++) {
      subject_guid.push(subjects[i]
      );
    }

    let params = {
      "id": this.updateAuthorDetailsForm.controls.id.value,
      "author_details_guid": this.updateAuthorDetailsForm.controls.author_details_guid.value,
      "address_id": this.updateAuthorDetailsForm.controls.address_id.value,
      "phone_number": "",
      "user_id": this.updateAuthorDetailsForm.controls.user_id.value,
      "code": this.updateAuthorDetailsForm.controls.code.value,
      "title": this.updateAuthorDetailsForm.controls.title.value,
      "name": this.updateAuthorDetailsForm.controls.name.value,
      "language_guid": language_guid,
      "organization_id": this.updateAuthorDetailsForm.controls.organization_id.value,
      "subject_guid": subject_guid,
      "department_guid": this.updateAuthorDetailsForm.controls.department_guid.value,
      "designation_guid": this.updateAuthorDetailsForm.controls.designation_guid.value,
      "highest_qualification_guid": this.updateAuthorDetailsForm.controls.highest_qualification_guid.value,
      "identity_Type_guid": this.updateAuthorDetailsForm.controls.identity_Type_guid.value,
      "identity_number": this.updateAuthorDetailsForm.controls.identity_number.value,
      "mobile_number": this.updateAuthorDetailsForm.controls.mobile_number.value,
      "alternate_mobile_number": this.updateAuthorDetailsForm.controls.alternate_mobile_number.value,
      "email": this.updateAuthorDetailsForm.controls.email.value,
      "rating": this.updateAuthorDetailsForm.controls.rating.value,
      "experience": this.updateAuthorDetailsForm.controls.experience.value,
      "photo": this.img_source,
      "status": this.updateAuthorDetailsForm.controls.status.value,

      // "photo": this.img_source
    }
    return params;

  }
}


export class FilterModel {
  groupName: String;
  appName: String;
}
