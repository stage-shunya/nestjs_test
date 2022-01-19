/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { Empty } from './google/protobuf/empty';

export const protobufPackage = 'announcement';

export interface AddAnnouncementRequest {
  id: string;
  title: string;
  announcementTypeId: string;
  startDate: string;
  endDate: string;
  contentText: string;
  bannerUri: string;
  isPushed: boolean;
  userGroup: string[];
}

export interface AnnouncementData {
  id: string;
  title: string;
  publisherId: string;
  announcementTypeId: string;
  startDate: string;
  endDate: string;
  contentText: string;
  bannerUri: string;
}

export interface AnnouncementListData {
  announcements: AnnouncementData[];
  fromResult: number;
  toResult: number;
  totalCount: number;
}

export interface AnnouncementTypeData {
  id: string;
  type: string;
}

export interface AnnouncementTypeListData {
  announcementTypes: AnnouncementTypeData[];
}

export const ANNOUNCEMENT_PACKAGE_NAME = 'announcement';

export interface AnnouncementServiceClient {
  findAllAnnouncements(
    request: Empty,
    metadata?: Metadata,
  ): Observable<AnnouncementListData>;

  findAnnouncementType(
    request: Empty,
    metadata?: Metadata,
  ): Observable<AnnouncementTypeListData>;

  addAnnouncement(
    request: AddAnnouncementRequest,
    metadata?: Metadata,
  ): Observable<AnnouncementData>;
}

export interface AnnouncementServiceController {
  findAllAnnouncements(
    request: Empty,
    metadata?: Metadata,
  ):
    | Promise<AnnouncementListData>
    | Observable<AnnouncementListData>
    | AnnouncementListData;

  findAnnouncementType(
    request: Empty,
    metadata?: Metadata,
  ):
    | Promise<AnnouncementTypeListData>
    | Observable<AnnouncementTypeListData>
    | AnnouncementTypeListData;

  addAnnouncement(
    request: AddAnnouncementRequest,
    metadata?: Metadata,
  ):
    | Promise<AnnouncementData>
    | Observable<AnnouncementData>
    | AnnouncementData;
}

export function AnnouncementServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'findAllAnnouncements',
      'findAnnouncementType',
      'addAnnouncement',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('AnnouncementService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('AnnouncementService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const ANNOUNCEMENT_SERVICE_NAME = 'AnnouncementService';

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array,
  ): Promise<Uint8Array>;
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
