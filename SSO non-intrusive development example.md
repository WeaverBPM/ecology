# Single sign-on non-intrusive development example

> Through the interface interception function of `WeaverBoot IOC`, developer can configure the interception API address to perform interface pre-interception and post-interception operations<br>
> This is used to achieve single sign-on for ecology without intrusion, and is usually used to connect to third-party authentication schemes

### Preparation

- Scan range
```java
//com.**.Impl;com.**.impl
//Like below path, the system could scan the program
package com.api.cs.detailImp202004181935.service.impl;
//If the method in jar package, there should a prefix("_") in jar package naem like _xxx.jar
```

- Pre-dependency

Need install the latest e-code package

### 1. Intercept class configuration
The interception class needs to be annotated with the `@WeaSsoIocComponent` annotation, and the name can be written in the annotation, and the container will inject this class according to this name. By default, it will be injected according to the path of the class, as shown in the following example

```java
package com.api.cs.test20200529.service.impl;
@WeaSsoIocComponent("demoService") //if no name, then inject with full path
public class TestLogin {
}
```

### 2. SSO method usage
The pre-method is the operation that will be executed before the interface is executed

The specific configuration method is as follows:

```java
package com.api.cs.test20200529.service.impl;
import com.weaverboot.frame.ioc.anno.classAnno.WeaSsoIocComponent;
import com.weaverboot.frame.ioc.anno.methodAnno.WeaSsoIoc;
import com.weaverboot.frame.ioc.handler.replace.weaReplaceParam.impl.WeaSsoParam;
import com.weaverboot.tools.logTools.LogTools;
@WeaSsoIocComponent("demoService") //if no name, then inject with full path
public class TestLogin {
    //parameter weaSsoParam，field as request response paramMap
    @WeaSsoIoc(order = 1, description = "SSO login logical")
    public void sso1(WeaSsoParam weaSsoParam){
//        LogTools.info("sso1");
    }
}
```
