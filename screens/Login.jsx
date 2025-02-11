// screens/auth/Login.js
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { COLORS } from '../theme';
import { fontConfig } from '../theme';
import { getUserProfile, userLogin } from '../services/api';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../store/actions/user';
import { showToast } from '../store/actions/toast';

export default function Login({ route, navigation }) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const { fromCart } = route.params || {};
  console.log("from cart is ", !!fromCart)
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Add your login logic here
      console.log('Login:', { email, password });
      const body = {
        email, password
      }
      const res = await userLogin(body, dispatch)
      const token = res?.token
      dispatch(setToken(token))
      const userProfile = await getUserProfile(token)
      dispatch(setUser(userProfile?.customer))
      dispatch(showToast("Login Success!!"))
      navigation.navigate("Home")

      console.log("res of login is ", userProfile?.customer)

    } catch (error) {
      console.error('Login error:', error?.code);
      dispatch(showToast(error?.code || "Login failed"))

    } finally {
      setLoading(false);
    }
  };
  const handleGuestLogin = () => {
    // You can add any guest-specific logic here
    dispatch(setUser(null));
    dispatch(setToken(null));
    navigation.navigate("Cart");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={[styles.title, fontConfig.displaySmall]}>
          Welcome Back!
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          outlineColor={COLORS.BORDER}
          activeOutlineColor={COLORS.PRIMARY}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          style={styles.input}
          outlineColor={COLORS.BORDER}
          activeOutlineColor={COLORS.PRIMARY}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          buttonColor={COLORS.PRIMARY}
        >
          Login
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('ForgotPassword')}
          textColor={COLORS.PRIMARY}
        >
          Forgot Password?
        </Button>

        <View style={styles.signupContainer}>
          <Text style={[fontConfig.bodyMedium, styles.signupText]}>
            Don't have an account?
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Signup')}
            textColor={COLORS.PRIMARY}
          >
            Sign Up
          </Button>
        </View>
        {!!fromCart &&
          <View style={styles.guestContainer}>
            <Button
              mode="text"
              onPress={handleGuestLogin}
              textColor={COLORS.ERROR}
              style={styles.guestButton}
            >
              Continue as Guest
            </Button>
          </View>}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: COLORS.TEXT_PRIMARY,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.BACKGROUND,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: COLORS.TEXT_SECONDARY,
  },
  guestContainer: {
    marginTop: 28,
    alignItems: 'center',
  },
  guestButton: {
    marginTop: 8,
  },
});