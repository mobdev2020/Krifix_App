import React, { useEffect } from 'react';

/*  Redux Files  */
import store from './src/redux/store/store'
import { Provider } from 'react-redux'
import AppNavigator from './src/navigations/AppNavigator';
import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import { storeData } from './src/commonComponents/AsyncManager';
import { FCM_TOKEN, REFFERAL_KEY } from './src/constants/ConstantKey';
import { DisplayMessage } from './src/commonComponents/AlertManager';
import { navigate } from './src/navigations/RootNavigation';
import branch from 'react-native-branch';
import * as Sentry from "@sentry/react-native";

const App = () => {

   global.referMessage = ""
  useEffect(() => {
    try {
      aFunctionThatMightFail();
    } catch (err) {
      console.log("catch")
      Sentry.captureException(err);
    }
    Sentry.nativeCrash();
    Sentry.init({
      dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
      debug: true,
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

    if (Platform.OS == 'ios') {
      requestUserPermission();
    } else {
      getFcmToken()
    }

    /** Use when Tap on Notification & app is in backgroud state to foreground */
    messaging().onNotificationOpenedApp(remoteMessage => {

      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
        'Data Is ',
        remoteMessage.data,
      );

      let data = remoteMessage.data

      setTimeout(() => {
        navigate("Notification");
      }, 3000);

    })

    /** Use when Tap on Notification & app is in Kill state to foreground */
    messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
            'Data Is ',
            remoteMessage.data,
          );
          let data = remoteMessage.data
          setTimeout(() => {
            navigate("Notification");
          }, 3000);
        }
      });

    /** Use when app is in foreground state & display a notification*/
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("A new FCM message arrived!" + JSON.stringify(remoteMessage));

      let notification = remoteMessage.notification

      DisplayMessage({
        title: notification.title,
        description: notification.body,
        type: 'success',
        onPress: () => {

          let data = remoteMessage.data
          navigate("Notification")
        }
      })

    });
    return unsubscribe;

  }, []);


  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {

      console.log('Authorization status:', authStatus);

      getFcmToken()

    } else {
      await messaging().requestPermission({
        sound: true,
        alert: true,
        badge: true,
        announcement: true,
      });
    }
  }


  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {

      console.log("Your Firebase Token is:", fcmToken);
      storeData(FCM_TOKEN, fcmToken)

    } else {
      console.log("Failed", "No token received");
    }
  }

  branch.subscribe({
		onOpenStart: ({ uri, cachedInitialEvent }) => {
			// cachedInitialEvent is true if the event was received by the
			// native layer before JS loaded.
			console.log('Branch will open ' + uri);
		},
		onOpenComplete: async({ error, params, uri }) => {
			if (error) {
				console.error('Error from Branch opening uri ' + uri, "Params : " + JSON.stringify(params)+" Error  : "+error);
				return;
			}

			console.log('Branch opened ' + uri, "Params : " + JSON.stringify(params));

			// if (!params['+clicked_branch_link']) return

			let lastParams = await branch.getLatestReferringParams() // params from last open
			let installParams = await branch.getFirstReferringParams() // params from original install


			console.log("lastParams : "+JSON.stringify(lastParams))
			console.log("installParams : "+JSON.stringify(installParams))


			if(lastParams.hasOwnProperty('referral_code')){

				console.log("Refferal Code available : "+lastParams.referral_code)
				storeData(REFFERAL_KEY,lastParams.referral_code)

			}

			if(installParams.hasOwnProperty('referral_code')){

				console.log("Refferal Code available : "+installParams.referral_code)
				// storeData(REFFERAL_KEY,installParams.referral_code)

			}

			// For Getting an params from link for referal earn program
			/* var url = params["+non_branch_link"]

			var regex = /[?&]([^=#]+)=([^&#]*)/g,
				params = {},
				match;
			while (match = regex.exec(url)) {
				params[match[1]] = match[2];
			}
			console.log("Params : "+JSON.stringify(params))
			

			if(Object.keys(params).length != 0){

				console.log("Params : "+JSON.stringify(params))

				if(params.hasOwnProperty('referral_code')){

					console.log("Refferal Code available : "+params.referral_code)
					storeData(REFFERAL_KEY,params.referral_code)

				}else{

				}
			} */

		},
	  })

  return (
    <Provider store={store}>
      <AppNavigator  />
    </Provider>
  );
}

// export default App;
export default Sentry.wrap(App);
