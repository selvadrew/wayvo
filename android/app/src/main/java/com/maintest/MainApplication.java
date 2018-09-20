package com.maintest;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
//import com.reactnativenavigation.NavigationReactPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativenavigation.NavigationApplication;

import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

//stack overflow line below - for onCreate 
import com.reactnativenavigation.controllers.ActivityCallbacks;
import android.content.Intent;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(new VectorIconsPackage(), new FBSDKPackage(mCallbackManager),
        new RNFirebasePackage(), new RNFirebaseMessagingPackage(), new RNFirebaseAnalyticsPackage(),
        new RNFirebaseNotificationsPackage());
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }

  @Override
  public void onCreate() {
    super.onCreate();
     //SoLoader.init(this, /* native exopackage */ false); // not sure//////

    setActivityCallbacks(new ActivityCallbacks() {

      @Override
      public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
      }
    });

    FacebookSdk.sdkInitialize(getApplicationContext());

    // If you want to use AppEventsLogger to log events.
    // AppEventsLogger.activateApp(this);
  }

}
