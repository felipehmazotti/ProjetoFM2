//
//  ViewController.m
//  ChooseLocation
//
//  Created by Sekorm on 16/8/22.
//  Copyright © 2016年 HY. All rights reserved.
//

#import "ViewController.h"
#import "ChooseLocationView.h"
#import "CitiesDataTool.h"
#import "RCTLog.h"
#import <objc/runtime.h>
#import "ProvinceModel.h"
#import "EventEmitterManager.h"

@interface ViewController ()<NSURLSessionDelegate,UIGestureRecognizerDelegate>
@property (nonatomic,strong) ChooseLocationView *chooseLocationView;
@property (nonatomic,strong) UIView  *cover;
@property (weak, nonatomic) IBOutlet UILabel *addresslabel;
@end

@implementation ViewController
RCT_EXPORT_MODULE(NativeDataPicker);

-(instancetype)init{
    if (self) {
        self = [super init];
        [self viewDidLoad];
        
    }
    return self;
}

RCT_EXPORT_METHOD(init:(NSString *)info area:(NSString *)areaStr){
    RCTLog(@"%@",info);
    if (info) {
    [[CitiesDataTool sharedManager] requestGetData:info]; 
    }

    if (areaStr) {
        self.chooseLocationView.areaCode = areaStr;
    }
    
    
    
}
RCT_EXPORT_METHOD(destroy){
    self.chooseLocationView = nil;
    self.cover = nil;
    
}

RCT_EXPORT_METHOD(show){
//    dispatch_async(dispatch_get_main_queue(), ^{
//        
//    });
    //这里获取主线程程, 不然崩溃
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:0.25 animations:^{
            self.view.transform =CGAffineTransformMakeScale(0.95, 0.95);
        }];
        self.cover.hidden = !self.cover.hidden;
        self.chooseLocationView.hidden = self.cover.hidden;
        
        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        [window addSubview:self.cover];
    });
    
    
}

- (void)viewDidLoad {
   // [[CitiesDataTool sharedManager] requestGetData];
    //[self.view addSubview:self.cover];
  
//    self.chooseLocationView.address = @"广东省 广州市 越秀区";
//    
//    self.addresslabel.text = @"广东省 广州市 越秀区";
   
}


- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer{
    
    CGPoint point = [gestureRecognizer locationInView:gestureRecognizer.view];
    if (CGRectContainsPoint(_chooseLocationView.frame, point)){
        return NO;
    }
    return YES;
}


- (void)tapCover:(UITapGestureRecognizer *)tap{
    __weak typeof (self) weakSelf = self;
    [UIView animateWithDuration:0.25 animations:^{
        weakSelf.addresslabel.text = weakSelf.chooseLocationView.address;
        weakSelf.view.transform = CGAffineTransformIdentity;
        weakSelf.cover.hidden = YES;
        
    }];
}



- (ChooseLocationView *)chooseLocationView{
    
    if (!_chooseLocationView) {
       _chooseLocationView = [[ChooseLocationView alloc]initWithFrame:CGRectMake(0, [UIScreen mainScreen].bounds.size.height - 350, [UIScreen mainScreen].bounds.size.width, 350)];
      
    }
    return _chooseLocationView;
}

- (UIView *)cover{

    if (!_cover) {
        _cover = [[UIView alloc]initWithFrame:[UIScreen mainScreen].bounds];
        _cover.backgroundColor = [UIColor colorWithWhite:0 alpha:0.2];
        [_cover addSubview:self.chooseLocationView];
        __weak typeof (self) weakSelf = self;
        _chooseLocationView.chooseFinish = ^{
            [UIView animateWithDuration:0.25 animations:^{
                weakSelf.addresslabel.text = weakSelf.chooseLocationView.address;
               
                //把回传信息回传
                NSMutableArray *arr = [[NSMutableArray alloc] init];
                NSArray *dicArr = @[@"provinceModel",@"cityModel",@"TownModel"];
                for (NSInteger i = 0; i < weakSelf.chooseLocationView.totalDict.allKeys.count; i ++) {
                    NSDictionary *dict = [weakSelf.chooseLocationView.totalDict objectForKey:dicArr[i]];
                    [arr addObject:dict];
                }
                NSLog(@"回传数组:%@",arr);
                
                NSError *parseError = nil;
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:arr options:NSJSONWritingPrettyPrinted error:&parseError];
                NSString *str =  [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                NSLog(@"%@",str);
                //初始化事件转发器类 回传json数据
                EventEmitterManager *event = [[EventEmitterManager alloc] init];
                [event postNotificationEvent:str];
                weakSelf.view.transform = CGAffineTransformIdentity;
                weakSelf.cover.hidden = YES;
                

                
            }];
        };
        UITapGestureRecognizer * tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(tapCover:)];
        [_cover addGestureRecognizer:tap];
        tap.delegate = self;
        _cover.hidden = YES;
    }
    return _cover;
}





@end
