import { 
  StyleSheet, View, Alert, TextInput, TouchableOpacity, Text, 
  KeyboardAvoidingView, ActivityIndicator, Keyboard, TouchableWithoutFeedback, 
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import { AppColors } from "../../constants/AppColors";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../Config.env';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppScreens, RootStackParams } from '../../constants/AppScreens';
import { AppConstants } from '../../constants/AppConstants';
import { ArrowRight, Eye, GoogleLogo } from 'phosphor-react-native';
import { Checkbox } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';


type SignupScreenNavigationProp = StackNavigationProp<RootStackParams, AppScreens.SIGNUP>;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const firestoreDB = getFirestore(app);

WebBrowser.maybeCompleteAuthSession();


const SignupScreen = ({ navigation }: { navigation: SignupScreenNavigationProp }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSecureEntryVisible, setSecureEntryVisible] = useState(false);
  const [isCheckBoxSelect, setCheckBoxSelect] = useState(false);

  
 const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '606874159813-1uffm0q7fmg31dghgpmgcchg1c7fq3bq.apps.googleusercontent.com',
  });


  const handleSignup = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return
    }

     if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match.');
    return;
  }

  if (!isCheckBoxSelect) {
    Alert.alert('Error', 'You must agree to the terms & conditions.');
    return;
    }
    
    setLoading(true);

     try {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    const user = userCredential.user;

    await setDoc(doc(firestoreDB, 'users', user.uid), {
      userName,
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    });

    Alert.alert('Success', 'Account created successfully!');
       
    setUserName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCheckBoxSelect(false);
    navigation.navigate(AppScreens.DASHBOARD);
  } catch (error) {
    let errorMessage = 'Signup failed. Please try again.';
    if ((error as { code: string }).code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already in use.';
    } else {
      errorMessage = (error as Error).message;
    }
    Alert.alert('Signup Failed', errorMessage);
  } finally {
    setLoading(false);
  }
  }

  const handleGoogleSignup = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(firestoreDB, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(firestoreDB, 'users', user.uid), {
            userName: user.displayName || '',
            email: user.email,
            uid: user.uid,
            createdAt: new Date().toISOString(),
          });
        }

        Alert.alert('Success', 'Google Signup Successful!');
        navigation.navigate(AppScreens.DASHBOARD);
      } else {
        Alert.alert('Error', 'Google Signup Failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Google Signup Failed.');
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView>

        <View style={styles.container}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Create</Text>
            <Text style={[styles.headerText, styles.headerSpanText]}>Your Account</Text>
            <Text style={styles.headerText}>Now</Text>
          </View>

          <View style={styles.inputContainer}>
              <TextInput
              placeholder="UserName"
              placeholderTextColor={AppColors.textColor}
              value={userName}
              onChangeText={(text) => setUserName(text.trim())}
              style={styles.inputText}
            />
            
              <TextInput
              placeholder="Email"
              placeholderTextColor={AppColors.textColor}
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputText}
              />
            
            <View style={[styles.inputContainersIconi, styles.inputText]}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={AppColors.textColor}
              value={password}
              onChangeText={(text) => setPassword(text.trim())}
              secureTextEntry={!isSecureEntryVisible}
              style={{width: '90%', color: AppColors.textColor}}
              />
              <TouchableOpacity onPress={() => setSecureEntryVisible(prev => !prev)}>
                <Eye weight='duotone' size={23} color={AppColors.textColor} style={{zIndex: 1, right: 10}}/>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainersIconi, styles.inputText]}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={AppColors.textColor}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text.trim())}
              secureTextEntry={!isSecureEntryVisible}
              style={{width: '90%', color: AppColors.textColor}}
              />
              <TouchableOpacity onPress={() => setSecureEntryVisible(prev => !prev)}>
                <Eye weight='duotone' size={23} color={AppColors.textColor} style={{zIndex: 1, right: 10}}/>
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox status={isCheckBoxSelect? "checked" : "unchecked"} uncheckedColor={AppColors.inactive} color={AppColors.active} onPress={() =>setCheckBoxSelect(prev => !prev)}/>
              <Text style={styles.loginsignupText}>By checking you'll be agreeing our <Text style={{color: AppColors.active, fontWeight: "bold"}}>Terms & conditions</Text></Text>
            </View>
            <TouchableOpacity onPress={handleSignup} style={styles.loginButton} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={AppColors.active} />
              ) : (
                <Text style={styles.sendButtonText}>Signup</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoogleSignup} style={[styles.loginButton, styles.loginWithGoogle]}>
              <GoogleLogo size={23} color={AppColors.textColor} weight='duotone' />
              <Text style={[styles.sendButtonText, styles.loginWithGoogleText]}>Signup With Google</Text>
              <ArrowRight size={23} color={AppColors.textColor} weight='duotone' />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.nologinSignup}>
            <Text style={styles.loginsignupText}>
              Already have an account? <Text onPress={() => navigation.navigate(AppScreens.LOGIN)}> <Text style={styles.loginSignupSpanText}>Login</Text></Text>
            </Text>
          </TouchableOpacity>
        </View>
        
          </ScrollView>
          <StatusBar style='dark'/>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreen;



const styles = StyleSheet.create({
  container: {
    marginTop : '50%',
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    justifyContent: "flex-end",
    top: -40,
    right: 50,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 40,
    fontStyle: "italic",
    color: AppColors.inactive,
    textAlign: 'center',
  },
  headerSpanText: {
    fontSize: 50,
    color: AppColors.active,
  },
  inputContainer: {
    width: '90%',
  },
  inputContainersIconi: {
    flex: 1,
    flexDirection: "row",
    alignItems : "center"
  },
  inputText: {
    flex: 1,
    backgroundColor: AppColors.active,
    fontSize: AppConstants.fontSize,
    color: AppColors.textColor,
    borderRadius: AppConstants.borderRadius,
    paddingHorizontal: 15,
    marginBottom: 10,
    minHeight: 50,
    justifyContent: "space-between"
  },
  loginButton: {  
    minHeight: 50,
    backgroundColor: AppColors.backgroundColor,
    elevation: 5,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: AppConstants.borderRadius,
    borderColor: AppColors.accent,
  },
  sendButtonText: {
    fontSize: AppConstants.fontSize,
    color: AppColors.active,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  nologinSignup: {
    position: "absolute",
    bottom: -50,
  },
  loginsignupText: {
    fontSize: AppConstants.fontSize,
    color: AppColors.accent,
  },
  loginSignupSpanText: {
    color: AppColors.active,
    fontWeight: "bold"
  },
  forgetPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  forgetPasswordText: {
    fontSize: AppConstants.fontSize,
    color: AppColors.accent,
  },
  loginWithGoogle: {
    flexDirection: "row",
    gap: 10, 
    backgroundColor: AppColors.redbackgroundColor,
    borderWidth: 0.5,
    borderColor: AppColors.redColor
  },
  loginWithGoogleText: {
    color: AppColors.textColor
  }
});