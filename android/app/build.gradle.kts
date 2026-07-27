plugins {
    id("com.android.application")
}

android {
    namespace = "hk.morefun.smt"
    compileSdk = 36

    defaultConfig {
        applicationId = "hk.morefun.smt"
        minSdk = 23
        targetSdk = 36
        versionCode = 1
        versionName = "0.1.0-foundation"
    }

    buildFeatures {
        buildConfig = true
    }

    buildTypes {
        debug {
            buildConfigField("String", "BRIDGE_VERSION", "\"1.0.0\"")
            buildConfigField("String", "WEB_BUNDLE_VERSION", "\"foundation-local-v1\"")
        }
        release {
            isMinifyEnabled = false
            buildConfigField("String", "BRIDGE_VERSION", "\"1.0.0\"")
            buildConfigField("String", "WEB_BUNDLE_VERSION", "\"foundation-local-v1\"")
        }
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.15.0")
}
