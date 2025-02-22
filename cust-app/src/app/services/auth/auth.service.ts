import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { IParseToken } from '../../shared/interfaces/parse-token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) { }

  // Authenticate access token
  public isAuthenticated(): boolean {
    if (localStorage.getItem('accessToken') && this.tokenNotExpired()) {
      return true;
    } else {
      return false;
    }
  }

  //Clear token remove user from local storage to log user out
  public logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    this.router.navigate(['/login']);
  }

  //JWT Token Functions
  private urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }
    return this.b64DecodeUnicode(output);
  }
  private b64decode(str: string): string {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output: string = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }

    for (
      // initialize result and counters
      let bc: number = 0, bs: any, buffer: any, idx: number = 0;
      // get next character
      buffer = str.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  }

  private b64DecodeUnicode(str: any) {
    return decodeURIComponent(Array.prototype.map.call(this.b64decode(str), (c: any) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  private decodeToken(token: string): any {
    if (token !== '' && token !== null) { //---- added for test 
      let parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must have 3 parts');
      }
      let decoded = this.urlBase64Decode(parts[1]);
      if (!decoded) {
        throw new Error('Cannot decode the token');
      }
      return JSON.parse(decoded);
    }
  }

  private getTokenExpirationDate(token: string): Date {
    let decoded: any;
    decoded = this.decodeToken(token);
    if (!decoded.hasOwnProperty('exp')) {
      return null;
    }
    let date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  private isTokenExpired(token: string, offsetSeconds?: number): boolean {
    let date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;

    if (date == null) {
      return false;
    }
    // Token expired?
    return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
  }
  private tokenNotExpired(): boolean {
    const token = localStorage.getItem('accessToken');

    return (token != null && !this.isTokenExpired(token));
  }

  /**
   * Decode access token
   */
  getDecodedAccessToken(): IParseToken {
    const parsedToken: IParseToken = this.decodeToken(localStorage.getItem('accessToken'));
    return parsedToken;
  }

  /** Get worker_id from token */
  getUserWorkerId(): any {
    const parsedToken: IParseToken = this.getDecodedAccessToken();
    if (parsedToken) {  //----- add for test
      return parsedToken.wid;
    }
  }

  // Getting orgid from token
  getUserOrgId(): string {
    const parsedToken: IParseToken = this.getDecodedAccessToken();
    return parsedToken.oid;
  }

  getUserGUId(): string {
    const parsedToken: IParseToken = this.getDecodedAccessToken();
    return parsedToken.cid;
  }
  getUserUId(): string {
    const parsedToken: IParseToken = this.getDecodedAccessToken();
    return parsedToken.uid;
  }
  updateHeaders() {
    //this.restService.updateHeaders();
  }

}
