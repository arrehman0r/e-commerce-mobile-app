import React from 'react';
import { SafeAreaView } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { HIDE_TOAST } from '../store/actions/types';

const AppToast = () => {
    const dispatch = useDispatch();
    const { visible, message } = useSelector((state) => state.toast);

    const onDismissSnackBar = () => dispatch({ type: HIDE_TOAST });

    return (<SafeAreaView>

        <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
                label: 'Close',
                onPress: () => {
                    // Do something
                },
            }}
        >
            {message}
        </Snackbar>
    </SafeAreaView>)
};

export default AppToast;
