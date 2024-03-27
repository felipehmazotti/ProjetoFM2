//
//  AddressTableViewCell.m
//  ChooseLocation
//
//  Created by Sekorm on 16/8/26.
//  Copyright © 2016年 HY. All rights reserved.
//

#import "AddressTableViewCell.h"
#import "ProvinceModel.h"

@interface AddressTableViewCell ()
@property (nonatomic) UILabel *addressLabel;
@property (nonatomic,strong) UIImageView *selectFlag;
@end
@implementation AddressTableViewCell

-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier{
    if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
        self.addressLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 11, 150, 20)];
        self.selectFlag = [[UIImageView alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.addressLabel.frame), 17, 20, 20)];
        NSData * data = [[NSData alloc] initWithBase64EncodedString:[self getImageStr] options:(NSDataBase64DecodingIgnoreUnknownCharacters)];
        self.selectFlag.image = [UIImage imageWithData:data];
        [self addSubview:self.addressLabel];
        [self addSubview:self.selectFlag];
        
    }
    return self;
}


- (void)setItem:(ProvinceModel *)item{
    
    _item = item;
    _addressLabel.text = item.areaName;
    _addressLabel.textColor = item.isSelected ? [UIColor orangeColor] : [UIColor blackColor] ;
    _selectFlag.hidden = !item.isSelected;
}
-(NSString *)getImageStr{
  return @"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";
}

@end
