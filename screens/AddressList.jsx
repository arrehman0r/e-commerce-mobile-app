import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton, FAB } from 'react-native-paper';
import { COLORS } from '../theme';
import { useUserAddresses } from '../services/queries';
import { deleteUserAddress } from '../services/api';
import { setLoading } from '../store/actions/loader';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/actions/toast';

const AddressList = ({ navigation }) => {
    const { data: addressData, isLoading, error, refetch, isRefetching } = useUserAddresses();
    const addresses = addressData?.addresses || [];
    const dispatch = useDispatch()

    const onRefresh = async () => {
        // Force refetch from server
        await refetch({ refetchType: 'all' });
    };


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color={COLORS.PRIMARY} size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="bodyLarge" style={styles.errorText}>
                    Failed to load addresses. Please try again.
                </Text>
                <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
                    Retry
                </Button>
            </View>
        );
    }

    const handleDeleteAddress = async (id) => {
        dispatch(setLoading(true));
        try {
            await deleteUserAddress(id);
            dispatch(showToast('Address deleted successfully'));
            refetch();
        } catch (error) {
            console.log("error in deleting address", error);
            dispatch(showToast(error?.message || 'Failed to delete address'));
        } finally {
            dispatch(setLoading(false));
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.PRIMARY]}
                        tintColor={COLORS.PRIMARY}
                    />
                }
            >
                {addresses.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Text variant="titleMedium" style={styles.emptyText}>
                            No addresses found
                        </Text>
                        <Text variant="bodyMedium" style={styles.subText}>
                            Add your first delivery address
                        </Text>
                    </View>
                ) : (
                    addresses.map((address) => (
                        <Card key={address.id} style={styles.addressCard} mode="elevated">
                            <Card.Content>
                                <View style={styles.headerRow}>
                                    <View style={styles.titleContainer}>
                                        <Text variant="titleMedium" style={styles.addressName}>
                                            {address.address_name || 'My Address'}
                                        </Text>
                                        {(address.is_default_shipping || address.is_default_billing) && (
                                            <Text variant="labelSmall" style={styles.defaultBadge}>
                                                Default
                                            </Text>
                                        )}
                                    </View>
                                    <IconButton
                                        icon="delete"
                                        size={20}
                                        onPress={() => handleDeleteAddress(address.id)}
                                    />
                                </View>

                                <View style={styles.infoRow}>
                                    <IconButton
                                        icon="map-marker"
                                        size={20}
                                        style={styles.iconButton}
                                        iconColor={COLORS.TEXT_SECONDARY}
                                    />
                                    <Text variant="bodyMedium" style={styles.addressText}>
                                        {[
                                            address.address_1,
                                            address.address_2,
                                            address.city,
                                            address.province,
                                            address.country_code.toUpperCase()
                                        ].filter(Boolean).join(', ')}
                                    </Text>
                                </View>

                                {address.phone && (
                                    <View style={styles.infoRow}>
                                        <IconButton
                                            icon="phone"
                                            size={20}
                                            style={styles.iconButton}
                                            iconColor={COLORS.TEXT_SECONDARY}
                                        />
                                        <Text variant="bodyMedium" style={styles.contactText}>
                                            {address.phone}
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.recipientRow}>
                                    <IconButton
                                        icon="account"
                                        size={20}
                                        style={styles.iconButton}
                                        iconColor={COLORS.TEXT_SECONDARY}
                                    />
                                    <Text variant="bodyMedium" style={styles.recipientText}>
                                        {[address.first_name, address.last_name].filter(Boolean).join(' ')}
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('AddAddress')}
                label="Add Address"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        color: COLORS.ERROR,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        minWidth: 120,
    },
    emptyText: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 8,
    },
    subText: {
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
    },
    addressCard: {
        marginBottom: 16,
        backgroundColor: COLORS.CARD_BACKGROUND,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressName: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
    },
    defaultBadge: {
        backgroundColor: COLORS.PRIMARY,
        color: COLORS.TEXT_WHITE,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        overflow: 'hidden',
        fontFamily: 'Poppins_500Medium',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    iconButton: {
        margin: 0,
        marginRight: 4,
    },
    addressText: {
        flex: 1,
        color: COLORS.TEXT_SECONDARY,
        fontFamily: 'Poppins_400Regular',
    },
    contactText: {
        color: COLORS.TEXT_SECONDARY,
        fontFamily: 'Poppins_400Regular',
    },
    recipientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    recipientText: {
        color: COLORS.TEXT_PRIMARY,
        fontFamily: 'Poppins_500Medium',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: COLORS.PRIMARY,
    },
});

export default AddressList;