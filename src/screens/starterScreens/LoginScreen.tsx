import { 
  StyleSheet, View, Alert, TextInput, TouchableOpacity, Text, 
  KeyboardAvoidingView, ActivityIndicator, Keyboard, TouchableWithoutFeedback, 
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import { AppColors } from "../../constants/AppColors";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../Config.env';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppScreens, RootStackParams } from '../../constants/AppScreens';
import { AppConstants } from '../../constants/AppConstants';
import { ArrowRight, Eye, GoogleLogo } from 'phosphor-react-native';
import { StatusBar } from 'expo-status-bar';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParams, AppScreens.LOGIN>;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);


const LoginScreen = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSecureEntryVisible, setSecureEntryVisible] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      console.log('Logged in user:', userCredential.user);
      navigation.navigate(AppScreens.DASHBOARD);
    } catch (error) {
      let errorMessage = 'Invalid email or password.';
      if ((error as { code: string }).code === 'auth/user-not-found') {
        errorMessage = 'User not found with this email.';
      } else if ((error as { code: string }).code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else {
        errorMessage = (error as Error).message;
      }
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Hey,</Text>
            <Text style={[styles.headerText, styles.headerSpanText]}>Welcome</Text>
            <Text style={styles.headerText}>Back</Text>
          </View>

          <View style={styles.inputContainer}>
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
              style={{width: '90%'}}
              />
              <TouchableOpacity onPress={() => setSecureEntryVisible(prev => !prev)}>
               <Eye weight='duotone' size={23} color={AppColors.textColor} style={{zIndex: 1, right: 10}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.forgetPasswordContainer}>
              <Text style={styles.forgetPasswordText} onPress={() => navigation.navigate(AppScreens.FOGET_PASSWORD)}>Forget Password ? </Text>
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.loginButton} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={AppColors.active} />
              ) : (
                <Text style={styles.sendButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log('')} style={[styles.loginButton, styles.loginWithGoogle]}>
              <GoogleLogo size={23} color={AppColors.textColor} weight='duotone' />
              <Text style={[styles.sendButtonText, styles.loginWithGoogleText]}>Login With Google</Text>
              <ArrowRight size={23} color={AppColors.textColor} weight='duotone' />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.nologinSignup}>
            <Text style={styles.loginsignupText}>
              Don't have an account? <Text onPress={() => navigation.navigate(AppScreens.SIGNUP)}> <Text style={styles.loginSignupSpanText}>Register</Text></Text>
            </Text>
          </TouchableOpacity>
        </View>
        
        </ScrollView>
            <StatusBar style='dark'/>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;



const styles = StyleSheet.create({
  container: {
    marginTop: '50%',
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    justifyContent: "flex-end",
    top: -40,
    right: 80,
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