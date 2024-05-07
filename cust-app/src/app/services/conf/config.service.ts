import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ConfigService {

    // Global application configuration
    private initAppConfigJson: any = {
        "filter": {
          "show_open": 1
        }
    };
    private appConfig = new BehaviorSubject<any>(
      this.initAppConfigJson
    );
    getAppconfig = this.appConfig.asObservable();
    setAppconfig(_json: any) {

      this.appConfig.next(_json);
      
    }

    // Global application configuration
    private initAppMenuConfig: any = {
        "modules": {
        }
    };
    private appMenuConfig = new BehaviorSubject<any>(this.initAppMenuConfig);
    getAppMenuConfig = this.appMenuConfig.asObservable();
    setAppMenuConfig(_json: any) {
      this.appMenuConfig.next(_json);
    }
    
    constructor() { }

}
