import {
  ApiException,
  throwException,
  AuthSignInRequest,
  ErrorMessageModel,
  JwtTokenResponse,
  UpdateUserPreferencesCommand,
  LocalizationsResponse,
  SiteSettingsResponse,
  UserResponse
} from "@amarty/models";
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v14.2.0.0 (NJsonSchema v11.1.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

export const API_BASE_URL_Dictionaries = new InjectionToken<string>('API_BASE_URL_Dictionaries');

@Injectable({
    providedIn: 'root'
})
export class DictionaryApiClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL_Dictionaries) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ?? "";
    }

    localization_DictionaryVersion(): Observable<SiteSettingsResponse> {
        let url_ = this.baseUrl + "/api/Localization/version";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processLocalization_DictionaryVersion(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processLocalization_DictionaryVersion(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<SiteSettingsResponse>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SiteSettingsResponse>;
        }));
    }

    protected processLocalization_DictionaryVersion(response: HttpResponseBase): Observable<SiteSettingsResponse> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result400: any = null;
            let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result400 = ErrorMessageModel.fromJS(resultData400);
            return throwException("A server side error occurred.", status, _responseText, _headers, result400);
            }));
        } else if (status === 401) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result401: any = null;
            let resultData401 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result401 = ErrorMessageModel.fromJS(resultData401);
            return throwException("A server side error occurred.", status, _responseText, _headers, result401);
            }));
        } else if (status === 403) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result403: any = null;
            let resultData403 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result403 = ErrorMessageModel.fromJS(resultData403);
            return throwException("A server side error occurred.", status, _responseText, _headers, result403);
            }));
        } else if (status === 404) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result404: any = null;
            let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result404 = ErrorMessageModel.fromJS(resultData404);
            return throwException("A server side error occurred.", status, _responseText, _headers, result404);
            }));
        } else if (status === 409) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result409: any = null;
            let resultData409 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result409 = ErrorMessageModel.fromJS(resultData409);
            return throwException("A server side error occurred.", status, _responseText, _headers, result409);
            }));
        } else if (status === 417) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result417: any = null;
            let resultData417 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result417 = ErrorMessageModel.fromJS(resultData417);
            return throwException("A server side error occurred.", status, _responseText, _headers, result417);
            }));
        } else if (status === 500) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result500: any = null;
            let resultData500 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result500 = ErrorMessageModel.fromJS(resultData500);
            return throwException("A server side error occurred.", status, _responseText, _headers, result500);
            }));
        } else if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = SiteSettingsResponse.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }
}



function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = new FileReader();
            reader.onload = event => {
                observer.next((event.target as any).result);
                observer.complete();
            };
            reader.readAsText(blob);
        }
    });
}
