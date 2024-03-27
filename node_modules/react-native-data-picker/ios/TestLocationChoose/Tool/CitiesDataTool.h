//
//  CitiesDataTool.h
//  ChooseLocation
//
//  Created by Sekorm on 16/10/25.
//  Copyright © 2016年 HY. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CitiesDataTool : NSObject
+ (instancetype)sharedManager;
-(void)requestGetData:(NSString *)locationStr;
-(NSArray *)QqueryAllRecordWithProviceID:(NSString *)ID;
-(NSArray *)QqueryAllRecordWithCityID:(NSString *)ID;
-(NSArray *)QqueryAllRecordWithTownID:(NSString *)ID;
-(NSArray *)QqueryAllRecordWithStreetID:(NSString *)ID;
- (NSString *)queryAllRecordWithAreaCode:(NSString *) areaCode;
@end
