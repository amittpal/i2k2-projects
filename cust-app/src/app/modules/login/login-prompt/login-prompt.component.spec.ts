import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { LoginPromptComponent } from './login-prompt.component';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxIxcheckLoadingSpinnerService } from 'ngx-ixcheck-loading-spinner-lib';
import { GlobalRestService } from '../../../services/rest/global-rest.service'

class MockRouter{
  navigateByUrl(url: string){
    return url;
  }
}

// class MockAuthService{
//   login(): void{}
// }

fdescribe('Login Component', () => {
  let component: LoginPromptComponent;
  let fixture: ComponentFixture<LoginPromptComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let httpTestingController: HttpTestingController;
  let service: GlobalRestService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPromptComponent ],

      /** Import all dependencies ---- this component has. */
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule, RouterTestingModule,
        ModalModule.forRoot()   
     ],

     /** providers ---- all inject services ---- this compont has. */
     providers: [
       {
         provide: Router,
         useClass: MockRouter
        },
        // { provide: AuthService, useClass: MockAuthService },
        NgxIxcheckLoadingSpinnerService,
        GlobalRestService
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(LoginPromptComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement.query(By.css('form'));
      el = de.nativeElement;
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
     // We inject our service (which imports the HttpClient) and the Test Controller
     httpTestingController = TestBed.get(HttpTestingController);
     service = TestBed.get(GlobalRestService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(service).toBeTruthy();
  });

  // Test Cases
  it('Case 1: Form should be invalid', async(() => {
    component.loginFormGroup.controls['username'].setValue('');
    component.loginFormGroup.controls['password'].setValue('');
    expect(component.loginFormGroup.valid).toBeFalsy();
  }));

  it('Case 2: Form should be invalid', async(() => {
    component.loginFormGroup.controls['username'].setValue('xyz');
    component.loginFormGroup.controls['password'].setValue('');
    expect(component.loginFormGroup.valid).toBeFalsy();
  }));

  it('Case 3: Form should be valid', async(() => {
    component.loginFormGroup.controls['username'].setValue('xyz');
    component.loginFormGroup.controls['password'].setValue('abcd');
    expect(component.loginFormGroup.valid).toBeTruthy();
  }));

  it('Case 4: should call auth login method', async(() => {
    let loginElement: DebugElement;  
    loginElement = fixture.debugElement.query(By.css('button'));

    // to set values
    let username = component.loginFormGroup.controls['username'].setValue('user');
    let password = component.loginFormGroup.controls['password'].setValue('123');
 
    // test--- event.stopPropagation, event.preventDefault
    let element: HTMLElement = fixture.debugElement.query(By.css('button')).nativeElement;
    const event = new MouseEvent('click'); 
    spyOn(event, 'preventDefault'); 
    element.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
    //
    loginElement.triggerEventHandler('click', null);    
   
    expect(component.errMessage).toEqual('');
    expect(component.loginFormGroup.controls.username.value).toBe('user');
    expect(component.loginFormGroup.controls.password.value).toBe('123');
    //expect(loginSpy).toHaveBeenCalledTimes(0); // check that service is called once
   
    //------ Testing HttpClient request
    let setting = component["appSettingsJson"]//---- for access private properties
    let restparams = component["restPrams"];
    restparams["httpPostParams"] =  { Username : username, Password : password }; 
    
    service.callApi(restparams).subscribe();
    const req = httpTestingController.match((request => {
      return request.url.match(setting.token.url) && request.method === 'POST';
    }));
    expect(req.length).toEqual(2);
    expect(req[0].request.url).toEqual(setting.token.url);
    expect(req[1].request.url).toEqual(setting.token.url);
    expect(component.errMessage).toEqual('');
    expect(localStorage).toBeDefined();
    expect(localStorage.clear()).toBeUndefined();
    httpTestingController.verify();   
  }));

  afterAll(() => {
    if(httpTestingController) {
      httpTestingController.verify();
    }
    if(fixture) { 
      fixture.destroy(); 
    }
  });
});
