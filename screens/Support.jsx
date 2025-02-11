// screens/Support.js
import React from 'react';
import { View, StyleSheet, Linking, ScrollView } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { COLORS } from '../theme';

const Support = () => {
    const contactInfo = {
        phone: '+923224906361', // Replace with your actual phone number
        email: 'support@quantumforce.dev', // Replace with your actual email
        operatingHours: '9:00 AM - 6:00 PM',
        responseTime: '24 hours'
    };

    const handleCall = () => {
        Linking.openURL(`tel:${contactInfo.phone}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${contactInfo.email}`);
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.headerCard}>
                <Card.Content>
                    <Text variant="headlineMedium" style={styles.title}>
                        How can we help you?
                    </Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        Our support team is here to assist you
                    </Text>
                </Card.Content>
            </Card>

            <Card style={styles.contactCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Contact Us
                    </Text>

                    <View style={styles.contactItem}>
                        <Text variant="bodyLarge" style={styles.label}>
                            Phone Support
                        </Text>
                        <Text variant="bodyMedium" style={styles.info}>
                            {contactInfo.phone}
                        </Text>
                        <Button
                            mode="contained"
                            icon="phone"
                            onPress={handleCall}
                            style={styles.button}
                        >
                            Call Us
                        </Button>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.contactItem}>
                        <Text variant="bodyLarge" style={styles.label}>
                            Email Support
                        </Text>
                        <Text variant="bodyMedium" style={styles.info}>
                            {contactInfo.email}
                        </Text>
                        <Button
                            mode="contained"
                            icon="email"
                            onPress={handleEmail}
                            style={styles.button}
                        >
                            Send Email
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.infoCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Support Hours
                    </Text>
                    <Text variant="bodyMedium" style={styles.info}>
                        Operating Hours: {contactInfo.operatingHours}
                    </Text>
                    <Text variant="bodyMedium" style={styles.info}>
                        Average Response Time: {contactInfo.responseTime}
                    </Text>
                </Card.Content>
            </Card>

            <Card style={styles.faqCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Common Questions
                    </Text>
                    <Text variant="bodyMedium" style={styles.faqText}>
                        For frequently asked questions and self-help resources,
                        please visit our Help Center or reach out to our support team.
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    headerCard: {
        margin: 16,
        backgroundColor: COLORS.PRIMARY,
    },
    title: {
        color: COLORS.TEXT_WHITE,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.TEXT_WHITE,
        fontFamily: 'Poppins_400Regular',
        opacity: 0.9,
    },
    contactCard: {
        margin: 16,
        marginTop: 0,
        backgroundColor: COLORS.CARD_BACKGROUND,
    },
    infoCard: {
        margin: 16,
        marginTop: 0,
        backgroundColor: COLORS.CARD_BACKGROUND,
    },
    faqCard: {
        margin: 16,
        marginTop: 0,
        marginBottom: 32,
        backgroundColor: COLORS.CARD_BACKGROUND,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 16,
    },
    contactItem: {
        marginBottom: 16,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 4,
    },
    info: {
        fontFamily: 'Poppins_400Regular',
        color: COLORS.TEXT_SECONDARY,
        marginBottom: 12,
    },
    button: {
        backgroundColor: COLORS.PRIMARY,
    },
    divider: {
        backgroundColor: COLORS.DIVIDER,
        marginVertical: 16,
    },
    faqText: {
        fontFamily: 'Poppins_400Regular',
        color: COLORS.TEXT_SECONDARY,
    },
});

export default Support;