plugins {
    id("com.android.application")
}

val releasePublicKeyB64 = providers.gradleProperty("morefunReleasePublicKeyB64").orElse("").get()
val releaseHosts = providers.gradleProperty("morefunReleaseHosts").orElse("").get()
fun buildConfigString(value: String): String = "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\""

android {
    namespace = "hk.morefun.smt"
    compileSdk = 36

    defaultConfig {
        applicationId = "hk.morefun.smt"
        minSdk = 23
        targetSdk = 36
        versionCode = 2
        versionName = "0.2.0-foundation"
    }

    buildFeatures {
        buildConfig = true
    }

    buildTypes {
        debug {
            buildConfigField("String", "BRIDGE_VERSION", "\"1.1.0\"")
            buildConfigField("String", "WEB_BUNDLE_VERSION", "\"foundation-local-v2\"")
            buildConfigField("String", "RELEASE_PUBLIC_KEY_B64", buildConfigString(releasePublicKeyB64))
            buildConfigField("String", "RELEASE_HOSTS", buildConfigString(releaseHosts))
        }
        release {
            isMinifyEnabled = false
            buildConfigField("String", "BRIDGE_VERSION", "\"1.1.0\"")
            buildConfigField("String", "WEB_BUNDLE_VERSION", "\"foundation-local-v2\"")
            buildConfigField("String", "RELEASE_PUBLIC_KEY_B64", buildConfigString(releasePublicKeyB64))
            buildConfigField("String", "RELEASE_HOSTS", buildConfigString(releaseHosts))
        }
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.15.0")
}
