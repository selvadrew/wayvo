package com.maintest;

import com.reactnativenavigation.controllers.SplashActivity;
import android.content.Intent;

import android.widget.LinearLayout;
import android.graphics.Color;

public class MainActivity extends SplashActivity {

    @Override
    public LinearLayout createSplashLayout() {
        LinearLayout view = new LinearLayout(this);
        view.setBackgroundColor(Color.parseColor("#039be5"));
        return view;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

}
