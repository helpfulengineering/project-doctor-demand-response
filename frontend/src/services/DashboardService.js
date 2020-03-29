import { RestService } from './RestService';
import { Subject } from 'rxjs';
import { BaseService } from './BaseService';
import { AuthenticationService } from './AuthenticationService';

export class DashboardService extends BaseService {
    static getDashboardData() {
        let responseSubject = new Subject();
        if(AuthenticationService.isAuthenticated()) {
            RestService.get("dashboard/stats", DashboardService.getUserContext().id).subscribe(resp => {
            
                responseSubject.next(resp);
            });
        }
        else {
            setTimeout(() => {
                responseSubject.next({status: false});
            }, 1000);
        }
        return responseSubject;
    }
}