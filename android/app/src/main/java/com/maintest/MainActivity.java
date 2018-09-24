package com.maintest;

// import android.os.Bundle;
// import org.devio.rn.splashscreen.SplashScreen;

//import com.facebook.react.ReactActivity;
import com.reactnativenavigation.controllers.SplashActivity;
import android.content.Intent;

public class MainActivity extends SplashActivity {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    // @Override
    // protected void onCreate(Bundle savedInstanceState) {
    // SplashScreen.show(this); // here
    // super.onCreate(savedInstanceState);
    // }

}
