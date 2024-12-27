/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleObjCpp
 *
 * We create an umbrella header (and corresponding implementation) here since
 * Cxx compilation in BUCK has a limitation: source-code producing genrule()s
 * must have a single output. More files => more genrule()s => slower builds.
 */

#import "RNSmsModuleSpec.h"


@implementation NativeSmsModuleSpecBase


- (void)setEventEmitterCallback:(EventEmitterCallbackWrapper *)eventEmitterCallbackWrapper
{
  _eventEmitterCallback = std::move(eventEmitterCallbackWrapper->_eventEmitterCallback);
}
@end

@implementation RCTCxxConvert (NativeSmsModule_GetSMSListFilters)
+ (RCTManagedPointer *)JS_NativeSmsModule_GetSMSListFilters:(id)json
{
  return facebook::react::managedPointer<JS::NativeSmsModule::GetSMSListFilters>(json);
}
@end
namespace facebook::react {
  
    static facebook::jsi::Value __hostFunction_NativeSmsModuleSpecJSI_getSMSList(facebook::jsi::Runtime& rt, TurboModule &turboModule, const facebook::jsi::Value* args, size_t count) {
      return static_cast<ObjCTurboModule&>(turboModule).invokeObjCMethod(rt, PromiseKind, "getSMSList", @selector(getSMSList:limit:filters:resolve:reject:), args, count);
    }

    static facebook::jsi::Value __hostFunction_NativeSmsModuleSpecJSI_startSmsListener(facebook::jsi::Runtime& rt, TurboModule &turboModule, const facebook::jsi::Value* args, size_t count) {
      return static_cast<ObjCTurboModule&>(turboModule).invokeObjCMethod(rt, VoidKind, "startSmsListener", @selector(startSmsListener), args, count);
    }

    static facebook::jsi::Value __hostFunction_NativeSmsModuleSpecJSI_stopSmsListener(facebook::jsi::Runtime& rt, TurboModule &turboModule, const facebook::jsi::Value* args, size_t count) {
      return static_cast<ObjCTurboModule&>(turboModule).invokeObjCMethod(rt, VoidKind, "stopSmsListener", @selector(stopSmsListener), args, count);
    }

    static facebook::jsi::Value __hostFunction_NativeSmsModuleSpecJSI_addListener(facebook::jsi::Runtime& rt, TurboModule &turboModule, const facebook::jsi::Value* args, size_t count) {
      return static_cast<ObjCTurboModule&>(turboModule).invokeObjCMethod(rt, VoidKind, "addListener", @selector(addListener:), args, count);
    }

    static facebook::jsi::Value __hostFunction_NativeSmsModuleSpecJSI_removeListeners(facebook::jsi::Runtime& rt, TurboModule &turboModule, const facebook::jsi::Value* args, size_t count) {
      return static_cast<ObjCTurboModule&>(turboModule).invokeObjCMethod(rt, VoidKind, "removeListeners", @selector(removeListeners:), args, count);
    }

  NativeSmsModuleSpecJSI::NativeSmsModuleSpecJSI(const ObjCTurboModule::InitParams &params)
    : ObjCTurboModule(params) {
      
        methodMap_["getSMSList"] = MethodMetadata {3, __hostFunction_NativeSmsModuleSpecJSI_getSMSList};
        setMethodArgConversionSelector(@"getSMSList", 2, @"JS_NativeSmsModule_GetSMSListFilters:");
        
        methodMap_["startSmsListener"] = MethodMetadata {0, __hostFunction_NativeSmsModuleSpecJSI_startSmsListener};
        
        
        methodMap_["stopSmsListener"] = MethodMetadata {0, __hostFunction_NativeSmsModuleSpecJSI_stopSmsListener};
        
        
        methodMap_["addListener"] = MethodMetadata {1, __hostFunction_NativeSmsModuleSpecJSI_addListener};
        
        
        methodMap_["removeListeners"] = MethodMetadata {1, __hostFunction_NativeSmsModuleSpecJSI_removeListeners};
        
  }
} // namespace facebook::react