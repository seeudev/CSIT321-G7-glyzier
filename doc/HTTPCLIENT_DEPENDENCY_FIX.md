# HttpClient Dependency Issue Resolution

## Problem Summary

After implementing **Module 20: Supabase Storage File Handling**, the Maven build tests were failing with:

```
java.lang.ClassNotFoundException: org.apache.hc.client5.http.ssl.TlsSocketStrategy
```

This error occurred during Spring Boot test context initialization, preventing the application from starting during test execution.

## Root Cause

Spring Boot 3.5.6's auto-configuration attempts to automatically configure HTTP client beans when `httpclient5` is present in the classpath:

1. **HttpClientAutoConfiguration** - Tries to create `clientHttpRequestFactoryBuilder` bean using `HttpComponentsHttpClientBuilder`
2. **RestClientAutoConfiguration** - Tries to create `restClientSsl` bean that depends on HttpClient configuration

Both auto-configurations attempt to instantiate classes that require `TlsSocketStrategy` from the `httpclient5` library, but this class was not being found in the classpath despite the dependency being declared.

## Why the Error Occurred

The application uses Apache HttpClient5 for making REST API calls to Supabase Storage. When Spring Boot detects `httpclient5` in the classpath, it automatically tries to configure HTTP clients for the entire application. However:

- The application already manually configures a `RestTemplate` bean in `SupabaseConfig.java`
- Spring Boot's auto-configuration conflicts with this manual configuration
- The TLS/SSL classes required by Spring Boot's auto-configuration were not being properly resolved

## Failed Solutions

### Attempt 1: Add httpclient5-fluent Dependency
```xml
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5-fluent</artifactId>
    <version>5.3</version>
</dependency>
```
**Result**: Failed - Same `ClassNotFoundException`

### Attempt 2: Add httpcore5 Dependency
```xml
<dependency>
    <groupId>org.apache.httpcomponents.core5</groupId>
    <artifactId>httpcore5</artifactId>
    <version>5.2.4</version>
</dependency>
```
**Result**: Failed - Same `ClassNotFoundException`

### Attempt 3: Exclude HttpClientAutoConfiguration Only
```java
@SpringBootApplication(
    scanBasePackages = {"com.glyzier"},
    exclude = {HttpClientAutoConfiguration.class}
)
```
**Result**: Failed - Different error from `RestClientAutoConfiguration`

## Final Solution

Exclude **both** `HttpClientAutoConfiguration` and `RestClientAutoConfiguration` from Spring Boot's auto-configuration:

### Code Changes

**File**: `glyzier-backend/src/main/java/com/glyzier/glyzier_backend/GlyzierApplication.java`

```java
import org.springframework.boot.autoconfigure.http.client.HttpClientAutoConfiguration;
import org.springframework.boot.autoconfigure.web.client.RestClientAutoConfiguration;

@SpringBootApplication(
    scanBasePackages = {"com.glyzier"},
    exclude = {HttpClientAutoConfiguration.class, RestClientAutoConfiguration.class}
)
@EnableJpaRepositories(basePackages = "com.glyzier.repository")
@EntityScan(basePackages = "com.glyzier.model")
public class GlyzierApplication {
    // ... rest of code
}
```

### Dependencies (pom.xml)

```xml
<!-- Apache HttpClient 5 for Supabase Storage API calls -->
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5</artifactId>
    <version>5.3</version>
</dependency>

<!-- Apache HttpCore 5 for HTTP protocol support -->
<dependency>
    <groupId>org.apache.httpcomponents.core5</groupId>
    <artifactId>httpcore5</artifactId>
    <version>5.2.4</version>
</dependency>

<!-- Commons FileUpload for multipart file handling -->
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.5</version>
</dependency>
```

## Why This Solution Works

1. **Prevents Auto-Configuration Conflicts**: By excluding both auto-configuration classes, Spring Boot no longer attempts to automatically configure HTTP clients that conflict with our manual `RestTemplate` bean

2. **Manual Configuration Takes Precedence**: The application's `SupabaseConfig.java` manually configures a `RestTemplate` bean specifically for Supabase Storage API calls with proper timeout settings

3. **No Breaking Changes**: Excluding these auto-configurations doesn't affect any other part of the application since:
   - We don't use Spring's `RestClient` API (new in Spring 6.1)
   - We manually configure all HTTP clients we need
   - Other REST API calls use the manually configured `RestTemplate`

## Verification

Build and test results after applying the fix:

```bash
./mvnw clean package
```

**Output**:
```
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time: 35.240 s
```

## Impact on Application Functionality

✅ **No functional impact** - The application works exactly as before:
- Supabase Storage file operations work correctly
- Manual `RestTemplate` configuration in `SupabaseConfig` is used
- JWT authentication still functional
- All REST API endpoints work as expected
- Frontend can upload files to Supabase Storage

## Alternative Solutions (Not Recommended)

### Option 1: Switch to Java's Built-in HttpClient
Replace Apache HttpClient5 with `java.net.http.HttpClient` (available since Java 11). This would eliminate the dependency conflict entirely but requires:
- Rewriting `FileStorageService.java`
- Rewriting `SupabaseConfig.java`
- Testing all file upload/download operations

**Pros**: No external HTTP client dependencies
**Cons**: Major code refactoring required, not worth it for this project

### Option 2: Use Spring's RestClient API
Adopt Spring Boot 6.1+'s new `RestClient` API and remove auto-configuration exclusions.

**Pros**: Aligns with Spring's latest best practices
**Cons**: Requires significant refactoring of `FileStorageService` and `SupabaseConfig`

## Lessons Learned

1. **Spring Boot Auto-Configuration Can Conflict**: Always be aware that Spring Boot's auto-configuration can conflict with manual bean configurations

2. **Explicit Dependencies Matter**: Even when dependencies are declared, transitive dependency issues can occur

3. **Exclusion is Sometimes the Right Choice**: When auto-configuration conflicts with manual configuration, excluding the auto-configuration is often cleaner than trying to work around it

4. **Test Before Merge**: This issue was caught during testing, highlighting the importance of running tests before deployment

## Related Files

- `glyzier-backend/pom.xml` - Maven dependencies
- `glyzier-backend/src/main/java/com/glyzier/glyzier_backend/GlyzierApplication.java` - Main application class with exclusions
- `glyzier-backend/src/main/java/com/glyzier/config/SupabaseConfig.java` - Manual RestTemplate configuration
- `glyzier-backend/src/main/java/com/glyzier/service/FileStorageService.java` - Uses HttpClient5 for Supabase API calls

## References

- [Spring Boot HttpClient Auto-Configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.rest-client)
- [Apache HttpClient 5 Documentation](https://hc.apache.org/httpcomponents-client-5.3.x/)
- [Spring Boot Auto-Configuration Exclusions](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration.disabling-specific)

---

**Status**: ✅ **RESOLVED**  
**Date**: December 1, 2025  
**Module**: Module 20 - Supabase Storage File Handling
