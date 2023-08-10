import { View, Text, Share, StyleSheet, Pressable, Platform } from 'react-native'
import React from 'react'
import { black, greenPrimary, offWhite, paleGreen, white } from '../constants/Color'
import { pixelSizeHorizontal, widthPixel } from '../commonComponents/ResponsiveScreen'
import Translate from '../translation/Translate'
import FastImage from 'react-native-fast-image'
import { ShareBoxImg } from '../constants/Images'
import { ANDROID_APP_LINK, IOS_APP_LINK } from '../constants/ConstantKey'
import { FontSize, MEDIUM, SEMIBOLD } from '../constants/Fonts'
import Modal from "react-native-modal";


const InvitePopUp = ({isInviteVisible, toggleInvite,referralcode}) => {

     // Action Methods
  const btnShareTap = () => {
      var message = `Check this out amazing app ${Translate.t('app_name')}, Download & join to this app. Here's my code ${JSON.stringify(referralcode)} just enter it when you register the app and you got referral points. \n\n Download app now: https://krifix.app.link?referral_code=${referralcode}` 
    const result = Share.share({
      title: Translate.t('app_name'),
      message: message,
      // url: Platform.OS == 'ios' ? IOS_APP_LINK : ANDROID_APP_LINK
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType               
      } else {
        // shared
      }
    }
    else if (result.action === Share.dismissedAction) {
      // dismissed            
    }
  }



  return (
    <Modal isVisible={isInviteVisible} onBackdropPress={() => toggleInvite()}
    onBackButtonPress={() => toggleInvite()}>
    <View style={{ backgroundColor: offWhite, borderRadius: widthPixel(15), padding: pixelSizeHorizontal(25) }}>

      <Text style={styles.textModalTitle}>
        {Translate.t("refer_your_friends_and_earn")}
      </Text>

      <FastImage
        source={ShareBoxImg}
        style={{ width: "100%", height: widthPixel(150), marginVertical: pixelSizeHorizontal(20) }}
        resizeMode={'contain'}
      />

      <View style={{ backgroundColor: paleGreen, padding: pixelSizeHorizontal(10), borderRadius: widthPixel(50) }}>
        <Text style={[styles.textModalTitle, { color: black }]}>{referralcode}</Text>
      </View>


      <Text style={styles.textDesc}>
        {global.referMessage}
        {/* {Translate.t("refer_desc")} */}
      </Text>

      <Pressable
        onPress={() => btnShareTap()}
        style={[styles.btnShareStyle]}>
        <Text style={styles.btnShareText} >{Translate.t("share")}</Text>

      </Pressable>

    </View>
  </Modal>
  )
}


const styles = StyleSheet.create({
    textModalTitle: {
        fontSize: FontSize.FS_27,
        color: greenPrimary,
        fontFamily: SEMIBOLD,
        textAlign: 'center'
      },
      textDesc: {
        fontSize: FontSize.FS_14,
        color: black,
        fontFamily: MEDIUM,
        marginTop: pixelSizeHorizontal(20)
      },
      btnShareStyle: {
        backgroundColor: black,
        padding: pixelSizeHorizontal(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: widthPixel(8),
        marginTop: pixelSizeHorizontal(30)
      },
      btnShareText: {
        fontFamily: SEMIBOLD,
        color: white,
        fontSize: FontSize.FS_22,
        textTransform: 'uppercase',
      },
})

export default InvitePopUp