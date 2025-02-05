// components/common/DrawerButton.js
import React from 'react';
import { IconButton } from 'react-native-paper';
import { COLORS } from '../../theme'; 
import ProfileDrawer from '../DrawerMenu'; 

export default function DrawerButton() {
  const [visible, setVisible] = React.useState(false);

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  return (
    <>
      <IconButton
        icon="menu"
        iconColor={COLORS.TEXT_WHITE}
        size={24}
        onPress={showDrawer}
      />
      <ProfileDrawer
        visible={visible}
        onDismiss={hideDrawer}
      />
    </>
  );
}