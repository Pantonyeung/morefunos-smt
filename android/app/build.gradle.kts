plugins {
    id("com.android.application")
}

val releasePublicKeyB64 = providers.gradleProperty("morefunReleasePublicKeyB64").orElse("").get()
val releaseHosts = providers.gradleProperty("morefunReleaseHosts").orElse("raw.githubusercontent.com").get()
val releaseManifestUrl = providers.gradleProperty("morefunReleaseManifestUrl")
    .orElse("https://raw.githubusercontent.com/Pantonyeung/morefunos-smt/runtime-stable/releases/stable-envelope.json")
    .get()

val apkOtaPublicKeyB64 = providers.gradleProperty("morefunApkOtaPublicKeyB64").orElse("").get()
val apkOtaHosts = providers.gradleProperty("morefunApkOtaHosts").orElse("raw.githubusercontent.com").get()
val apkOtaManifestUrl = providers.gradleProperty("morefunApkOtaManifestUrl")
    .orElse("https://raw.githubusercontent.com/Pantonyeung/morefunos-smt/apk-ota-stable/releases/stable-apk-envelope.json")
    .get()

fun buildConfigString(value: String): String = "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\""

android {
    namespace = "hk.morefun.smt"
    compileSdk = 36

    defaultConfig {
        applicationId = "hk.morefun.smt"
        minSdk = 23
        targetSdk = 36
        versionCode = 3
        versionName = "0.3.0-foundation"
    }

    buildFeatures {
        buildConfig = true
    }

    buildTypes {
        debug {
            buildConfigField("String", "BRIDGE_VERSION", "\"1.2.0\"")
            buildConfigField("String", "WEB_BUNDLE_VERSION", "\"foundation-local-v3\"")
            buildConfigField("String", "RELEASE_PUBLIC_KEY_B64", buildConfigString(releasePublicKeyB64))
            buildConfigField("String", "RELEASE_HOSTS", buildConfigString(releaseHosts))
            buildConfigField("String", "RELEASE_MANIFEST_URL", buildConfigString(releaseManifestUrl))
            buildConfigField("String", "APK_OTA_PUBLIC_KEY_B64", buildConfigString(apkOtaPublicKeyB64))
            buildConfigField("String", "APK_OTA_HOSTS", buildConfigString(apkOtaHosts))
            buildConfigField("String", "APK_OTA_MANIFEST_URL", buildConfigString(apkOtaManifestUrl))
        }
        release {
            isMinifyEnabled = false
            buildConfigField("String", "BRIDGE_VERSION", "\"1.2.0\"")
            buildConfigField("String", "WEB_BUNDLE_VERSION", "\"foundation-local-v3\"")
            buildConfigField("String", "RELEASE_PUBLIC_KEY_B64", buildConfigString(releasePublicKeyB64))
            buildConfigField("String", "RELEASE_HOSTS", buildConfigString(releaseHosts))
            buildConfigField("String", "RELEASE_MANIFEST_URL", buildConfigString(releaseManifestUrl))
            buildConfigField("String", "APK_OTA_PUBLIC_KEY_B64", buildConfigString(apkOtaPublicKeyB64))
            buildConfigField("String", "APK_OTA_HOSTS", buildConfigString(apkOtaHosts))
            buildConfigField("String", "APK_OTA_MANIFEST_URL", buildConfigString(apkOtaManifestUrl))
        }
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.15.0")
}
