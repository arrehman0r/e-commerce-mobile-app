// screens/Profile.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Text, TextInput, Button, Divider } from 'react-native-paper';
import { COLORS } from '../theme';
import { fontConfig } from '../theme';
import { useSelector } from 'react-redux';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  const [formData, setFormData] = useState({
    fullName: user?.first_name,
    email: user?.email,
    phone: user?.phone,
    address: '123 Main St, City, Country',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Add your profile update logic here
      console.log('Updated profile:', formData);
      setEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon 
          size={100} 
          icon="account"
          style={{ backgroundColor: COLORS.PRIMARY }}
        />
        <Text style={[styles.name, fontConfig.headlineMedium]}>
          {formData.fullName}
        </Text>
        <Text style={[styles.email, fontConfig.bodyMedium]}>
          {formData.email}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, fontConfig.titleMedium]}>
            Personal Information
          </Text>
          <Divider style={styles.divider} />

          <TextInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
            mode="outlined"
            disabled={!editing}
            style={styles.input}
            outlineColor={COLORS.BORDER}
            activeOutlineColor={COLORS.PRIMARY}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            mode="outlined"
            disabled={!editing}
            keyboardType="email-address"
            style={styles.input}
            outlineColor={COLORS.BORDER}
            activeOutlineColor={COLORS.PRIMARY}
          />

          <TextInput
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            mode="outlined"
            disabled={!editing}
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor={COLORS.BORDER}
            activeOutlineColor={COLORS.PRIMARY}
          />

          {/* <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            mode="outlined"
            disabled={!editing}
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineColor={COLORS.BORDER}
            activeOutlineColor={COLORS.PRIMARY}
          /> */}

          {editing ? (
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => setEditing(false)}
                style={styles.button}
                textColor={COLORS.PRIMARY}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}
                loading={loading}
                buttonColor={COLORS.PRIMARY}
              >
                Save
              </Button>
            </View>
          ) : (
            <Button
              mode="contained"
              onPress={() => setEditing(true)}
              style={styles.editButton}
              buttonColor={COLORS.PRIMARY}
              disabled={true}
            >
              Edit Profile
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  name: {
    marginTop: 10,
    color: COLORS.TEXT_PRIMARY,
  },
  email: {
    color: COLORS.TEXT_SECONDARY,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
    backgroundColor: COLORS.DIVIDER,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.BACKGROUND,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    marginTop: 8,
  },
});