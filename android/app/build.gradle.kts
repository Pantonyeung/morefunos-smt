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
        }
        release {
            isMinifyEnabled = false
            buildConfigField("String", "BRIDGE_VERSION", "\"1.1.0\"")
            buildConfigField("String", "WEB_BUNDLE_VERSION", "\"foundation-local-v2\"")
        }
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.15.0")
}
