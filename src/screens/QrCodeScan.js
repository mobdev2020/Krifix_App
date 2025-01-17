import { View, Text, TouchableOpacity, StyleSheet, Share, Pressable, FlatList, SectionList, Linking, Dimensions, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import HeaderView from '../commonComponents/HeaderView'
import Translate from '../translation/Translate'
import { pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../commonComponents/ResponsiveScreen'
import { black, greenPrimary, iceBlue, offWhite, paleGreen, white, warmGrey, disableColor } from '../constants/Color'
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../constants/Fonts'
import FastImage from 'react-native-fast-image'
import { AppLogoImg, CloseImg, CoinImg, CongratsImg, FlashImg, InviteImg, NotificationSq, RedeemImg, ScanImg, ScanImgBlack, ScanImgOutline, ShareBoxImg, WithdrawImg } from '../constants/Images'
import { ANDROID_APP_LINK, IOS_APP_LINK, SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants/ConstantKey'

import { goBack, navigate } from '../navigations/RootNavigation'
import InvitePopUp from './InvitePopUp'
import CongratulationsPopUp from './CongratulationsPopUp'
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { CameraKitCameraScreen, CameraScreen } from 'react-native-camera-kit';
import { Platform } from 'react-native'
import { PermissionsAndroid } from 'react-native'
import LoadingView from '../commonComponents/LoadingView'
import ApiManager from '../commonComponents/ApiManager'
import { ADD_REWARD, GET_REWARD } from '../constants/ApiUrl'
import AlertView from '../commonComponents/AlertView'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'


const QrCodeScan = () => {

    const refScan = useRef(null)
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    // const [isFlash, setIsFlash] = useState(RNCamera.Constants.FlashMode.off)

    const [qrvalue, setQrvalue] = useState('');
    const [opneScanner, setOpneScanner] = useState(false);
    const [point, setPoint] = useState();
    const [qrValue, setQrValue] = useState();
    const [AlertShow, setAlertShow] = useState(false)


    useEffect(() => {
        onOpneScanner()
    }, [])


    const onOpneScanner = () => {
        // To Start Scanning
        if (Platform.OS === 'android') {
            async function requestCameraPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: 'Camera Permission',
                            message: 'App needs permission for camera access to upload a profile picture',
                        },
                    );

                    console.log("Camera Permission : " + granted)

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        // If CAMERA Permission is granted
                        setQrvalue('');
                        setOpneScanner(true);

                    } else {
                        Dialog.show({
                            type: ALERT_TYPE.DANGER,
                            title: Translate.t('alert'),
                            textBody: "CAMERA permission denied",
                            button: 'Ok',
                          })
                    }
                } catch {
                    (err) => {
                        Dialog.show({
                            type: ALERT_TYPE.DANGER,
                            title: Translate.t('alert'),
                            textBody: "Camera permission err",
                            button: 'Ok',
                          })
                        console.warn(err);
                    }
                }
            }
            // Calling the camera permission function
            requestCameraPermission();
        } else {
            setQrvalue('');
            setOpneScanner(true);
        }
    };
    const Api_Add_Reward = (isLoad, data) => {
        console.log("data",data)
        setIsLoading(isLoad)
        ApiManager.post(ADD_REWARD, {
            unique_id: data,
        }).then((response) => {
            // console.log("Api_Add_Reward : ", response)
            setIsLoading(false)
            var data = response.data;
            if (data.status == true) {
                var user_data = data.point
                setPoint(user_data)
                toggleModal()
            } else {
                Dialog.show({   
                    type: ALERT_TYPE.WARNING,
                    title: Translate.t('warning'),
                    textBody: data.message,
                    button: 'Ok',
                    onPressButton: ()=> {
                        Dialog.hide();
                        setOpneScanner(true)
                       // console.log("ok presssed")
                    },

                  })
            }

        }).catch((err) => {
            setIsLoading(false)
            console.error("Api_Add_Reward Error ", err);
        })
    }

    const rewardManage = (data) => {
        let response = data.nativeEvent
       console.log("response : ", response)

       	// For Getting an params from link for referal earn program

		 var url = response.codeStringValue

			var regex = /[?&]([^=#]+)=([^&#]*)/g,
				params = {},
				match;
			while (match = regex.exec(url)) {
				params[match[1]] = match[2];
			}
			console.log("Params : "+JSON.stringify(params))
			

			if(Object.keys(params).length != 0){

				console.log("Params : "+JSON.stringify(params))

				if(params.hasOwnProperty('q')){
                    setQrValue(params.q)
                    Api_Add_Reward(true,params.q)
				}else{

				}
			}

    //    return
    //     setQrValue(response.codeStringValue)
    //     return
    //     Api_Add_Reward(true)
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    // const AlertActive = () => {
    //     setAlertShow(!AlertShow);
    // };
    // const toggleFlash = () => {
    // if(isFlash == 0){
    //     setIsFlash(RNCamera.Constants.FlashMode.torch)
    // }else{
    //     setIsFlash(RNCamera.Constants.FlashMode.off)
    // }
    // }

    return (
        <>
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'transparent' }}>

                {opneScanner ?
                    <View style={{ flex: 1 }}>

                        <CameraScreen
                            scanBarcode={true}
                            onReadCode={(event) => {
                                setOpneScanner(false)
                                rewardManage(event)
                            }}
                            showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
                            laserColor={greenPrimary} // (default red) optional, color of laser in scanner frame
                            frameColor={white} // (default white) optional, color of border of scanner frame
                        />
                    </View>
                    : null
                }


                <TouchableOpacity style={styles.headContainer} onPress={() => goBack()}>
                    <FastImage
                        style={styles.closeImage}
                        resizeMode="contain"
                        source={CloseImg}
                    />
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.scanBtn}
                    onPress={() => refScan.current.reactivate()}>
                    <FastImage
                        style={styles.image}
                        resizeMode="contain"
                        source={ScanImgBlack}
                    />
                    <Text style={styles.scanText}>{Translate.t("Scan_QR")} </Text>
                </TouchableOpacity> */}

            </View>
            <CongratulationsPopUp isWithDrawModel={false} Point={point}
                isInviteVisible={isModalVisible} toggleInvite={() => {
                    toggleModal()
                    goBack()
                }} />
            {/* <AlertView
                isAlertVisible={AlertShow}
                toggleAlert={() => AlertActive()}
                title={Translate.t('alert')}
                description={Translate.t('already_used')}
                type="error"
                successText="ok"
                onSucess={() => { setAlertShow(false), setOpneScanner(true) }}
            /> */}
            {isLoading && <LoadingView />}
        </>
    )
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
        backgroundColor: 'transparent'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },


    scanText: {
        fontFamily: SEMIBOLD,
        fontSize: FontSize.FS_25,
        color: black,
    },
    image: {
        height: 28,
        width: 28,
        marginRight: pixelSizeHorizontal(12)

    },
    scanBtn: {
        backgroundColor: white,
        width: SCREEN_WIDTH - 100,
        height: 60,
        position: "absolute",
        bottom: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 33,
        alignSelf: "center"
    },
    headContainer: {
        position: "absolute",
        left: 30,
        top: SCREEN_HEIGHT / 16
    },
    flashContainer: {
        position: "absolute",
        right: 30,
        top: SCREEN_HEIGHT / 16
    },
    closeImage: {
        height: 18,
        width: 18,
    },
    flashImage: {
        height: 22,
        width: 22,
    },

})

export default QrCodeScan