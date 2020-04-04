import { BaseService } from "./BaseService";
import { RestService } from "./RestService";
import { Subject } from 'rxjs';
import axios from "axios";

export class AuthenticationService extends BaseService {
  
  static login(loginInfo) {
    let responseSubject = new Subject();
    RestService.post("users/login", loginInfo).subscribe(resp => {
      
      if(resp.user) {
        localStorage.setItem('access_token', 'Bearer ' + resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));
        AuthenticationService.getAppContext().token = localStorage.getItem('access_token');
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
      }
      
      responseSubject.next(resp);
    });

    return responseSubject;
  } 

  static logout() {
    AuthenticationService.getAppContext().token = {};
    axios.defaults.headers.common['Authorization'] = null;
    localStorage.removeItem('access_token');
  }

  
  static isAuthenticated() {
    if(localStorage.getItem('access_token') && 
        localStorage.getItem('access_token').startsWith('Bearer')) {
      return true;
    }

    return false;
  }
}