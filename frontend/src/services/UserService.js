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

}