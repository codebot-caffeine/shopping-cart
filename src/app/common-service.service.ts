import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(public toastr: ToastrService) { }

  showSuccess(message:any) {
    this.toastr.success(message, 'Success', {
      timeOut: 3000,
    });
  }
  showError(message:any) {
    this.toastr.error(message, 'Error', {
      timeOut: 3000,
    });
  }
  showInfo(message:any) {
    this.toastr.info(message, 'Note', {
      timeOut: 3000,
    });
  }
  showWarning(message:any) {
    this.toastr.warning(message, '', {
      timeOut: 3000,
    });
  }

}
