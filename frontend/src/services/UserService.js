import { RestService } from './RestService';
import { Subject } from 'rxjs';
import { BaseService } from './BaseService';

export class UserService extends BaseService {
    static registerUser(userInfo) {
        let responseSubject = new Subject();
        RestService.put("register", userInfo).subscribe(resp => {
            
            responseSubject.next(resp);
        });

        return responseSubject;
    }

    static activateUser(userInfo) {
        let responseSubject = new Subject();
        RestService.post("activate", userInfo).subscribe(resp => {
            responseSubject.next(resp);
        });

        return responseSubject;
    }

    static updatePassword(userInfo) {
        let responseSubject = new Subject();
        RestService.post("users/updatePassword", userInfo).subscribe(resp => {
          responseSubject.next(resp);
        });
    
        return responseSubject;
      } 
      static updatePasswordRequest(userInfo) {
        let responseSubject = new Subject();
        RestService.post("users/updatePasswordRequest", userInfo).subscribe(resp => {
          responseSubject.next(resp);
        });
    
        return responseSubject;
      } 
      static updatePasswordCodeVerify(codeInfo) {
        let responseSubject = new Subject();
        RestService.post("users/updatePasswordCodeVerify", codeInfo).subscribe(resp => {
            responseSubject.next(resp);
        });

        return responseSubject;
     }
      

}