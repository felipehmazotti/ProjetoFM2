//
//  ProvinceModel.h
//  TestLocationChoose
//
//  Created by wz on 2017/8/7.
//  Copyright © 2017年 wz. All rights reserved.
//

#import "BaseModel.h"

@interface ProvinceModel : BaseModel
@property (nonatomic,copy) NSString * parentId;
@property (nonatomic,copy) NSString * areaId;
@property (nonatomic,copy) NSString * areaName;
@property (nonatomic,assign) BOOL  isSelected;
@end
