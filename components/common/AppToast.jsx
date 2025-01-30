import React from 'react';
import { SafeAreaView } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { HIDE_TOAST } from '../../store/actions/types';
import { COLORS } from '../../theme';

const AppToast = () => {
    const dispatch = useDispatch();
    const { visible, message } = useSelector((state) => state.toast);

    const onDismissSnackBar = () => dispatch({ type: HIDE_TOAST });

    return (<SafeAreaView>

        <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            style={{ backgroundColor: COLORS.PRIMARY }}
            action={{
                label: 'Close',
                onPress: () => {
                    onDismissSnackBar()
                },
                textColor: 'white',
            }}
        >
            {message}
        </Snackbar>
    </SafeAreaView>)
};

export default AppToast;
