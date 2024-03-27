//
//  EventEmitterManager.m
//  TestLocationChoose
//
//  Created by wz on 2017/8/8.
//  Copyright © 2017年 wz. All rights reserved.
//

#import "EventEmitterManager.h"
#import <React/RCTEventDispatcher.h>
#import <RCTLog.h>
NSString *const OnAddressSelectedListener  = @"onPickerEvent";
@implementation EventEmitterManager

RCT_EXPORT_MODULE();
static EventEmitterManager *shareInstance = nil;
+ (EventEmitterManager *)sharedManager
{
    @synchronized (self) {
        if (shareInstance == nil) {
            shareInstance = [[self alloc] init];
        }
    }
    return shareInstance;
}
+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    @synchronized (self) {
        if (shareInstance == nil) {
            shareInstance = [super allocWithZone:zone];
        }
    }
    return shareInstance;
}

- (id)copy
{
    return shareInstance;
}

- (id)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}

-(void)postNotificationEvent:(NSString *)jsonStr{
    NSLog(@"%@",jsonStr);
[self sendEventWithName:OnAddressSelectedListener body:jsonStr];
    
}

- (NSDictionary<NSString *, NSString *> *)constantsToExport {
    return @{ @"EventEmitterManagerEvent": OnAddressSelectedListener,
              };
}

- (NSArray<NSString *> *)supportedEvents {
    return @[OnAddressSelectedListener,];
}
@end
