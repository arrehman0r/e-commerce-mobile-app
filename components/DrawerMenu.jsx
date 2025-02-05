import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Drawer, Portal, Modal, IconButton, Avatar, Text, Button } from 'react-native-paper';
import { COLORS } from '../theme'; 
import { fontConfig } from '../theme/fonts';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../store/actions/user';

export default function ProfileDrawer({ visible, onDismiss }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [active, setActive] = React.useState('');
  const user = useSelector((state) => state.user.user);

  const navigateAndClose = (screen) => {
    onDismiss();
    setActive(screen);
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    onDismiss();
  };

  const handleLogin = () => {
    onDismiss();
    navigation.navigate('Login');
  };

  const renderGuestView = () => (
    <View style={styles.guestContainer}>
      <Avatar.Icon
        size={80}
        icon="account-outline"
        style={{ backgroundColor: COLORS.SECONDARY }}
      />
      <Text style={[styles.guestTitle, fontConfig.titleLarge]}>
        Welcome, Guest
      </Text>
      <Text style={[styles.guestSubtitle, fontConfig.bodyMedium]}>
        Sign in to access your profile
      </Text>
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
        labelStyle={[fontConfig.labelLarge]}
      >
        Sign In
      </Button>
    </View>
  );

  const renderUserView = () => (
    <>
      <View style={styles.userInfoSection}>
        <Avatar.Icon
          size={80}
          icon="account"
          style={{ backgroundColor: COLORS.PRIMARY }}
        />
        <Text style={[styles.title, fontConfig.titleLarge]}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={[styles.caption, fontConfig.bodySmall]}>
          {user?.email}
        </Text>
      </View>

      <Drawer.Section>
        <Drawer.Item
          icon="account"
          label="My Profile"
          active={active === 'Profile'}
          onPress={() => navigateAndClose('Profile')}
        />
        <Drawer.Item
          icon="history"
          label="Order History"
          active={active === 'OrderHistory'}
          onPress={() => navigateAndClose('OrderHistory')}
        />
        <Drawer.Item
          icon="map-marker"
          label="Delivery Addresses"
          active={active === 'Addresses'}
          onPress={() => navigateAndClose('Addresses')}
        />
        <Drawer.Item
          icon="heart"
          label="Favorites"
          active={active === 'Favorites'}
          onPress={() => navigateAndClose('Favorites')}
        />
        <Drawer.Item
          icon="bell"
          label="Notifications"
          active={active === 'Notifications'}
          onPress={() => navigateAndClose('Notifications')}
        />
        <Drawer.Item
          icon="cog"
          label="Settings"
          active={active === 'Settings'}
          onPress={() => navigateAndClose('Settings')}
        />
      </Drawer.Section>

      <Drawer.Section>
        <Drawer.Item
          icon="help-circle"
          label="Help & Support"
          active={active === 'Support'}
          onPress={() => navigateAndClose('Support')}
        />
        <Drawer.Item
          icon="logout"
          label="Sign Out"
          onPress={handleLogout}
        />
      </Drawer.Section>
    </>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <IconButton
              icon="close"
              size={24}
              iconColor={COLORS.TEXT_PRIMARY}
              onPress={onDismiss}
              style={styles.closeButton}
            />
          </View>

          {user?.id ? renderUserView() : renderGuestView()}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.BACKGROUND,
    width: '80%',
    maxWidth: 300,
    height: '100%',
    marginLeft: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingRight: 8,
  },
  closeButton: {
    margin: 0,
  },
  userInfoSection: {
    padding: 20,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  caption: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  guestContainer: {
    padding: 20,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    alignItems: 'center',
  },
  guestTitle: {
    marginTop: 10,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  guestSubtitle: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: COLORS.PRIMARY,
    width: '80%',
  },
});