import { async, ComponentFixture, TestBed, inject, fakeAsync, tick, flush } from '@angular/core/testing';
import { PlanExamsListComponent } from './plan-exams-list.component';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HttpEvent, HttpEventType, HttpClient, HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxIxcheckLoadingSpinnerService } from 'ngx-ixcheck-loading-spinner-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AlertComponent, BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckMessageLibModule } from 'ngx-ixcheck-message-lib';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { PlanExamsFilterComponent } from '../plan-exams-filter/plan-exams-filter.component';
import { Router } from '@angular/router';


fdescribe('PlanExamsListComponent', () => {
  let component: PlanExamsListComponent;
  let fixture: ComponentFixture<PlanExamsListComponent>;
  let api: GlobalRestService;
  let router: Router;

  const mockApiService = {
    callApi: () => { }
  };

  const mockRouter = {
    navigate: () => { }
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [PlanExamsListComponent, PlanExamsFilterComponent],
        imports: [
          AngularSvgIconModule,
          MenuToggleModule,
          FilterToggleModule,
          FormsModule,
          ReactiveFormsModule,
          NgxIxcheckTableLibModule,
          NgxIxcheckBubbleLibModule,
          NgxIxcheckTableOuterPaginationLibModule,
          ModalModule.forRoot(),
          HttpClientModule,
          RouterTestingModule,
          NgxIxcheckMessageLibModule
        ],
        providers: [
          NgxIxcheckLoadingSpinnerService,
          { provide: GlobalRestService, useValue: mockApiService },
          { provide: Router, useValue: mockRouter }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanExamsListComponent);
    component = fixture.componentInstance;
    api = fixture.debugElement.injector.get(GlobalRestService);
    router = fixture.debugElement.injector.get(Router);
    component.appRoutes={"exam":[]};
  });

  describe('initial display', () => {   
    it('makes a call to api.getHackers', () => {
      spyOn(api, 'callApi').and.returnValue({subscribe:()=>{}});
      fixture.detectChanges();
      expect(api.callApi).toHaveBeenCalled();    
    });
   
    it('sets initial data (using async)', async(() => {     
      spyOn(api, 'callApi').and.returnValue({subscribe:()=>{mockHackers}});
      fixture.detectChanges();          
      component.getData();
      fixture.whenStable()
        .then(() => {                   
          //expect(component.items).toEqual(mockHackers);
          console.log(component.items);
        });
    }));

  });
});



export const mockHackers = [
  {
    "exam_id": 138,
    "id": "144",
    "guid": "48ca4ab7-75ae-11ea-aa60-fa163efd7a87",
    "exam_number": "Test/",
    "code": "RA-8",
    "name": "RA-8",
    "exam_type": "Entrance",
    "primary_language": "English",
    "duration": "2.00 Hour",
    "status": "1",
    "status_text": "Active",
    "status_css_tag": "badge-success",
    "plan_status_guid": "eb5eb7f1-36c6-11ea-a071-0242ac110013",
    "plan_status_text": "Setup Finalized",
    "plan_status_css_tag": "badge-info"
  }
]
/************************************************************** */

// fdescribe('PlanExamsListComponent', () => {
//   let component: PlanExamsListComponent;
//   let fixture: ComponentFixture<PlanExamsListComponent>;  
//   let debugElement: DebugElement;
//   beforeEach(
//     () => {
//     TestBed.configureTestingModule({
//       declarations: [PlanExamsListComponent,PlanExamsFilterComponent],
//       imports:[ 
//         AngularSvgIconModule,
//         MenuToggleModule,
//         FilterToggleModule,
//         FormsModule,
//         ReactiveFormsModule,
//         NgxIxcheckTableLibModule,
//         NgxIxcheckBubbleLibModule,
//         NgxIxcheckTableOuterPaginationLibModule,
//         ModalModule.forRoot(),
//         HttpClientModule,
//         RouterTestingModule  ,
//         NgxIxcheckMessageLibModule      
//       ],
//       providers:[NgxIxcheckLoadingSpinnerService]      
//     })
//     .compileComponents();
//       fixture = TestBed.createComponent(PlanExamsListComponent);
//       debugElement = fixture.debugElement;
//   })


//   it('should bind exam data', fakeAsync(() => {            
//     let val = debugElement.query(By.css('label')).nativeElement.innerText;
//     expect(val).toEqual('Exam List');
//   }));  
// });

/*********************************************************************************** */
////testing list service
// describe("GlobalRestService", () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         RouterTestingModule,
//         RouterTestingModule,
//         ModalModule.forRoot(),
//         NgxIxcheckMessageLibModule
//       ],
//       providers: [
//         GlobalRestService,
//         NgxIxcheckLoadingSpinnerService,
//         {
//           provide: Router,
//           useValue: {
//             url: '/exam'
//           }
//         }
//       ]
//     })
//   });

//   it('Exam Planning: get plan exam list',
//     inject(
//       [HttpTestingController, GlobalRestService],
//       (httpMock: HttpTestingController, restService: GlobalRestService) => {
//         const mockUsers = [
//           { name: 'Bob', website: 'www.yessss.com' },
//           { name: 'Juliette', website: 'nope.com' }
//         ];

//         let searchFilter =
//           { "exam_filter": { "exam_setup": {}, "paging": { "total_rows": 0, "returned_rows": 0, "direction": 0, "order_dir": "", "page_size": 10, "sort_by": "", "offset": 0, "last_offset": 0, "last_seen_id_max": 0, "last_seen_id_min": 0 }, "cols": [] } }
//         restService.ApiEndPointUrlOrKey = Exam.getExamList;
//         restService.HttpPostParams = searchFilter;
//         restService.callApi().subscribe((event: HttpEvent<any>) => {
//           switch (event.type) {
//             case HttpEventType.Response:
//               expect(event.body).toEqual(mockUsers)
//           }
//         });

//         const mockReq = httpMock.expectOne("https://dev.api.exam.ixcheck.io/api/v1/exam/list");
//         expect(mockReq.cancelled).toBeFalsy();
//         expect(mockReq.request.responseType).toEqual('json');
//         mockReq.flush(mockUsers);
//         httpMock.verify();
//       }
//     ))
// })

