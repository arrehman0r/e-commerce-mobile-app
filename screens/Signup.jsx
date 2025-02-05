import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { COLORS } from '../theme';
import { fontConfig } from '../theme';
import { getRegistrationToken, registerUser } from '../services/api';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/actions/toast';
import { validateConfirmPassword, validateEmail, validateFullName, validatePassword, validatePhone } from '../utils/formUtils';

export default function Signup({ navigation }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
    confirmPassword: true,
  });

  const [loading, setLoading] = useState(false);


  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate field as user types
    let errorMessage = '';
    switch (field) {
      case 'fullName':
        errorMessage = validateFullName(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'phone':
        errorMessage = validatePhone(value);
        break;
        case 'password':
          errorMessage = validatePassword(value);
          // Also validate confirm password when password changes
          if (formData.confirmPassword) {
            const confirmError = validateConfirmPassword(value, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
          }
          break;
      case 'confirmPassword':
        errorMessage = validateConfirmPassword(value, formData.password );
        break;
    }

    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  };

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData?.password, formData.confirmPassword),
    };

    setErrors(newErrors);

    // Return true if no errors (all error messages are empty strings)
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      dispatch(showToast('Please fix the errors in the form'));
      return;
    }

    setLoading(true);
    const { email, fullName, phone, password } = formData;
    try {
      const registerTokenBody = {
        email: email,
        password: password
      };
      const registerTokenRes = await getRegistrationToken(registerTokenBody, dispatch);
      const token = registerTokenRes?.token;

      const registerBody = {
        email: email,
        first_name: fullName,
        last_name: "",
        phone: phone
      };

      const registerResponse = await registerUser(registerBody, token);
      if (registerResponse?.customer?.id) {
        console.log('Signup:', registerResponse);
        dispatch(showToast("Registration done successfully!!"));
        navigation.navigate("Login");
      }
    } catch (error) {
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      dispatch(showToast(errorMessage));
      console.error('Signup error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, fontConfig.displaySmall]}>
            Create Account
          </Text>

          <TextInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(value) => updateFormData('fullName', value)}
            mode="outlined"
            style={styles.input}
            outlineColor={errors.fullName ? COLORS.ERROR : COLORS.BORDER}
            activeOutlineColor={errors.fullName ? COLORS.ERROR : COLORS.PRIMARY}
            error={!!errors.fullName}
          />
          {errors.fullName ? (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          ) : null}

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor={errors.email ? COLORS.ERROR : COLORS.BORDER}
            activeOutlineColor={errors.email ? COLORS.ERROR : COLORS.PRIMARY}
            error={!!errors.email}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => {
              // Only allow digits
              const numericValue = value.replace(/[^0-9]/g, '');
              if (numericValue.length <= 13) {
                updateFormData('phone', numericValue);
              }
            }}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor={errors.phone ? COLORS.ERROR : COLORS.BORDER}
            activeOutlineColor={errors.phone ? COLORS.ERROR : COLORS.PRIMARY}
            error={!!errors.phone}
          />
          {errors.phone ? (
            <Text style={styles.errorText}>{errors.phone}</Text>
          ) : null}

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            mode="outlined"
            secureTextEntry={secureTextEntry.password}
            right={
              <TextInput.Icon
                icon={secureTextEntry.password ? 'eye' : 'eye-off'}
                onPress={() => setSecureTextEntry(prev => ({
                  ...prev,
                  password: !prev.password
                }))}
              />
            }
            style={styles.input}
            outlineColor={errors.password ? COLORS.ERROR : COLORS.BORDER}
            activeOutlineColor={errors.password ? COLORS.ERROR : COLORS.PRIMARY}
            error={!!errors.password}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            mode="outlined"
            secureTextEntry={secureTextEntry.confirmPassword}
            right={
              <TextInput.Icon
                icon={secureTextEntry.confirmPassword ? 'eye' : 'eye-off'}
                onPress={() => setSecureTextEntry(prev => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword
                }))}
              />
            }
            style={styles.input}
            outlineColor={errors.confirmPassword ? COLORS.ERROR : COLORS.BORDER}
            activeOutlineColor={errors.confirmPassword ? COLORS.ERROR : COLORS.PRIMARY}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleSignup}
            style={styles.button}
            loading={loading}
            buttonColor={COLORS.PRIMARY}
            disabled={loading || Object.values(errors).some(error => error !== '')}
          >
            Sign Up
          </Button>

          <View style={styles.loginContainer}>
            <Text style={[fontConfig.bodyMedium, styles.loginText]}>
              Already have an account?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              textColor={COLORS.PRIMARY}
            >
              Login
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: COLORS.TEXT_SECONDARY,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 8,
  }
});