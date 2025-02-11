// NSExceptionAllowsInsecureHTTPLoads   BOOLEAN-YES
// react-native run-ios --simulator="iPhone X"
// react-native run-ios --simulator="iPhone SE"
//react-native run-ios --simulator="iPhone 6"
// react-native run-ios --simulator="iPhone 11" - for new xcode

// RELEASE SIMULATORS
// react-native run-android --variant=release
//react-native run-ios --configuration Release
// react-native run-ios --configuration Release --simulator="iPhone 6"
// react-native run-ios --simulator 'iPad Air 2'

// to generate the release APK
// $ cd android
// $ ./gradlew assembleRelease
// android/app/build/outputs/apk/release

// https://sheltered-escarpment-63295.herokuapp.com/

// 172.20.0.239 - stouffville
// 10.0.9.207 - sbux unionville
// 192.168.1.56 - home
// 10.20.79.132 - waterloo
// 192.168.0.16 - sunview

// export const HOST = "http://10.0.2.125:3000";
// export const HOST = "https://sheltered-escarpment-63295.herokuapp.com/";

export const HOST = "https://520f5f29.ngrok.io"


{/* 
// IOS RELEASE 
- change HOST 
- change wss url in PlanChat.js 
- change to release 
- info.plist remove localhost 
- increment build 


// ANDROID RELEASE
- change app/build.gradle version code and version name 
- to generate the release APK
// $ cd android
// $ ./gradlew assembleRelease
// see files in = android/app/build/outputs/apk/release


REDIS
- $ redis-server
- $ QUEUE=* rake resque:work
WSS 
-- new os- command can be run globally 
ngrok http 8080
    - $ cd downloads
- $ ./ngrok http 3000

RNN custom start cause of bug 
- $ react-native start -- --reset-cache

Remove node modules 
- $ rm -rf node_modules

Any time dependencies update you have to jetify again
npx jetify

*/}