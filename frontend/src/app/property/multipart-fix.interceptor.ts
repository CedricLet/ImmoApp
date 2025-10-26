import { HttpInterceptorFn} from '@angular/common/http';

export const multipartFixInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.body instanceof FormData){
    // supprime explicitement tout header Content-Type qui traine
    let headers = req.headers;
    if (headers.has('Content-Type')){
      headers = headers.delete('Content-Type');
    }
    if (headers.has('content-type')){
      headers = headers.delete('content-type');
    }
    req = req.clone({headers});
  }
  return next(req);
}
