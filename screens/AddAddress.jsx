import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText } from 'react-native-paper';
import { COLORS } from '../theme';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/actions/toast';
import { validatePhone } from '../utils/formUtils';
import { setLoading } from '../store/actions/loader';
import { addUserAddress } from '../services/api';

const AddAddress = ({ navigation }) => {
    const dispatch = useDispatch();


    const [form, setForm] = useState({
        address_name: '',
        first_name: '',
        last_name: '',
        address_1: '',
        address_2: '',
        city: '',
        province: '',
        country_code: '',
        postal_code: '',
        phone: '',
        is_default_shipping: false,
        is_default_billing: false,
        errors: {}
    });



    const updateForm = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value,
            errors: {
                ...prev.errors,
                [key]: null
            }
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!form.address_name?.trim()) {
            errors.address_name = 'Address name is required';
        }

        if (!form.first_name?.trim()) {
            errors.first_name = 'First name is required';
        }

        if (!form.address_1?.trim()) {
            errors.address_1 = 'Address is required';
        }

        if (!form.city?.trim()) {
            errors.city = 'City is required';
        }

        if (!form.country_code?.trim()) {
            errors.country_code = 'Country code is required';
        }

        if (form.phone) {
            const phoneError = validatePhone(form.phone);
            if (phoneError) errors.phone = phoneError;
        }

        setForm(prev => ({ ...prev, errors }));
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            dispatch(showToast('Please fill all required fields'));
            return;
        }

        dispatch(setLoading(true))
        const { errors, ...cleanData } = form;

        const addressData = {
            ...cleanData,
            country_code: cleanData.country_code.toLowerCase(),
        };

        try {
            const response = await addUserAddress(addressData);
            if (response) {
                dispatch(showToast('Address added successfully'));
                navigation.goBack();
            }
        } catch (error) {
            console.log("error in adding address", error);
            dispatch(showToast(error?.message || 'Failed to add address'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput
                    label="Address Name"
                    value={form.address_name}
                    onChangeText={(text) => updateForm('address_name', text)}
                    style={styles.input}
                    mode="outlined"
                    error={!!form.errors.address_name}
                />
                <HelperText type="error" visible={!!form.errors.address_name}>
                    {form.errors.address_name}
                </HelperText>

                <TextInput
                    label="First Name"
                    value={form.first_name}
                    onChangeText={(text) => updateForm('first_name', text)}
                    style={styles.input}
                    mode="outlined"
                    error={!!form.errors.first_name}
                />
                <HelperText type="error" visible={!!form.errors.first_name}>
                    {form.errors.first_name}
                </HelperText>

                <TextInput
                    label="Last Name"
                    value={form.last_name}
                    onChangeText={(text) => updateForm('last_name', text)}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Address Line 1"
                    value={form.address_1}
                    onChangeText={(text) => updateForm('address_1', text)}
                    style={styles.input}
                    mode="outlined"
                    error={!!form.errors.address_1}
                    multiline
                />
                <HelperText type="error" visible={!!form.errors.address_1}>
                    {form.errors.address_1}
                </HelperText>

                <TextInput
                    label="Address Line 2 (Optional)"
                    value={form.address_2}
                    onChangeText={(text) => updateForm('address_2', text)}
                    style={styles.input}
                    mode="outlined"
                    multiline
                />

                <TextInput
                    label="City"
                    value={form.city}
                    onChangeText={(text) => updateForm('city', text)}
                    style={styles.input}
                    mode="outlined"
                    error={!!form.errors.city}
                />
                <HelperText type="error" visible={!!form.errors.city}>
                    {form.errors.city}
                </HelperText>

                <TextInput
                    label="Province/State"
                    value={form.province}
                    onChangeText={(text) => updateForm('province', text)}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Country Code"
                    value={form.country_code}
                    onChangeText={(text) => updateForm('country_code', text.toUpperCase())}
                    style={styles.input}
                    mode="outlined"
                    error={!!form.errors.country_code}
                    maxLength={2}
                    autoCapitalize="characters"
                />
                <HelperText type="error" visible={!!form.errors.country_code}>
                    {form.errors.country_code}
                </HelperText>

                <TextInput
                    label="Postal Code"
                    value={form.postal_code}
                    onChangeText={(text) => updateForm('postal_code', text)}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Phone"
                    value={form.phone}
                    onChangeText={(text) => updateForm('phone', text)}
                    style={styles.input}
                    mode="outlined"
                    error={!!form.errors.phone}
                    keyboardType="phone-pad"
                />
                <HelperText type="error" visible={!!form.errors.phone}>
                    {form.errors.phone}
                </HelperText>

                <View style={styles.switchContainer}>
                    <View style={styles.switchRow}>
                        <Text variant="bodyLarge" style={styles.switchLabel}>
                            Set as Default Shipping Address
                        </Text>
                        <Switch
                            value={form.is_default_shipping}
                            onValueChange={(value) => updateForm('is_default_shipping', value)}
                            color={COLORS.PRIMARY}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text variant="bodyLarge" style={styles.switchLabel}>
                            Set as Default Billing Address
                        </Text>
                        <Switch
                            value={form.is_default_billing}
                            onValueChange={(value) => updateForm('is_default_billing', value)}
                            color={COLORS.PRIMARY}
                        />
                    </View>
                </View>

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}

                >
                    Save Address
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    input: {
        marginBottom: 4,
        backgroundColor: COLORS.BACKGROUND,
    },
    switchContainer: {
        marginTop: 16,
        marginBottom: 24,
        backgroundColor: COLORS.SURFACE_LIGHT,
        borderRadius: 8,
        padding: 16,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLabel: {
        flex: 1,
        marginRight: 16,
        color: COLORS.TEXT_PRIMARY,
        fontFamily: 'Poppins_400Regular',
    },
    submitButton: {
        marginTop: 8,
        paddingVertical: 6,
    },
});

export default AddAddress;