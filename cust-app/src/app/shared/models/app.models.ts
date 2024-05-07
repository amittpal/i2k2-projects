
export enum HandelError {
    ShowAndReturn = 1 ,
    ShowAndKill = 2,
    HideAndReturn = 3 ,
    HideAndKill = 4
}

export enum RestMethods {
    Get = "GET" ,
    Post = "POST",
    Delete = "DELETE",
    Patch = "PATCH",
    Put = "PUT",
    BadTest = "BAD"
}

export class RestApiParams
{
    private urlKeyData: any  ;
    private apiEndPointUrlorKey: string;
    private apiEndPointMehod: string;
    //private apiEndPointKey: string;
    private currentRoute: string;
    private showLoadingSpinner: boolean;
    private alertAndErrorAction : number;
    private httpPostParams : any;
    constructor() {
        //default values
        this.apiEndPointUrlorKey = "";
        this.ApiEndPointMehod = RestMethods.Get;
        //this.apiEndPointKey = "";
        this.currentRoute = "";
        this.showLoadingSpinner = true;
        this.alertAndErrorAction = HandelError.ShowAndReturn;
        this.httpPostParams = {};
        this.urlKeyData = {}
    }
    
    get ApiEndPointUrlOrKey(): string {
        return this.apiEndPointUrlorKey;
    }
    set ApiEndPointUrlOrKey(_apiEndPointUrlorKey: string) {
        this.apiEndPointUrlorKey = _apiEndPointUrlorKey;
    }

    get ApiEndPointMehod(): string {
        return this.apiEndPointMehod;
    }
    set ApiEndPointMehod(_apiEndPointMehod: string) {
        this.apiEndPointMehod = _apiEndPointMehod;
    }

    // get ApiEndPointKey(): string {
    //     return this.apiEndPointKey;
    // }
    // set ApiEndPointKey(_apiEndPointKey: string) {
    //     this.apiEndPointKey = _apiEndPointKey;
    // }

    get CurrentRoute(): string {
        return this.currentRoute;
    }
    set CurrentRoute(_currentRoute: string) {
        this.currentRoute = _currentRoute;
    }

    get ShowLoadingSpinner(): boolean {
        return this.showLoadingSpinner;
    }
    set ShowLoadingSpinner(_showLoadingSpinner: boolean) {
        this.showLoadingSpinner = _showLoadingSpinner;
    }

    get AlertAndErrorAction(): HandelError {
        return this.alertAndErrorAction;
    }
    set AlertAndErrorAction(_alertAndErrorAction: HandelError) {
        this.alertAndErrorAction = _alertAndErrorAction;
    }

    get HttpPostParams(): any {
        return this.httpPostParams;
    }
    set HttpPostParams(_httpPostParms: any) {
        this.httpPostParams = _httpPostParms;
    }

    get UrlKeyData(): any {
        return this.urlKeyData;
    }
    set UrlKeyData(_urlKeyData: any) {
        this.urlKeyData = _urlKeyData;
    }
}
