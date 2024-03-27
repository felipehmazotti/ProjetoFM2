//
//  EventEmitterManager.h
//  TestLocationChoose
//
//  Created by wz on 2017/8/8.
//  Copyright © 2017年 wz. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <RCTBridgeModule.h>
@interface EventEmitterManager : RCTEventEmitter<RCTBridgeModule>
-(void)postNotificationEvent:(NSString *)jsonStr;
@end
