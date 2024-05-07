import { BrowserModule } from "@angular/platform-browser";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

// Make angular load the routes as /#/ & not refesh the whole page
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

//GlobalRestService gets directly injected into components and services
//AppsettingsConfService, HttpClientModule and  NgxIxcheckLoadingSpinnerService gets injected into GlobalRestService
import { GlobalRestService } from "./services/rest/global-rest.service";
import { AppsettingsConfService } from "./services/conf/appsettings-conf/appsettings-conf.service";
import { HttpClientModule } from "@angular/common/http";
import {
  NgxIxcheckLoadingSpinnerModule,
  NgxIxcheckLoadingSpinnerService,
} from "ngx-ixcheck-loading-spinner-lib";
import { NgxIxcheckMessageLibModule } from "ngx-ixcheck-message-lib";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// Authguard is used in app-routing.module for route security
import { AuthGuard } from "./shared/gaurds/authgaurd/auth.gaurd";

// Primary entry layout & component
import { LayoutModule } from "./modules/layout/layout.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
// import { OnlyNumbersDirective } from "src/app/directives/only-numbers/only-numbers.directive";
import { ChartsModule, ThemeService } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxIxcheckLoadingSpinnerModule,
    AppRoutingModule,
    NgxIxcheckMessageLibModule,
    LayoutModule,
    BrowserAnimationsModule,
    ChartsModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy      
    },
    AuthGuard,
    GlobalRestService,
    AppsettingsConfService,
    NgxIxcheckLoadingSpinnerService,
    ThemeService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
