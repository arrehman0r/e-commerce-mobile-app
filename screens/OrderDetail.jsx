import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { COLORS } from '../theme';
import { formatPrice } from '../utils/cartUtils';

const OrderDetail = ({ route }) => {
  const { orderDetails } = route.params;

  // Handle both response structures
  const order = orderDetails?.type === 'order' 
    ? orderDetails?.order   // Order success response
    : orderDetails?.order || orderDetails;  // Customer profile order or direct order object

  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineMedium" style={styles.emptyText}>
          Order details not found
        </Text>
      </View>
    );
  }

  const getStatusColor = (status, payment_status, fulfillment_status) => {
    if (fulfillment_status === 'delivered') return COLORS.SUCCESS;
    if (payment_status === 'captured') return COLORS.SUCCESS;
    if (status === 'pending') return COLORS.WARNING;
    if (status === 'cancelled') return COLORS.ERROR;
    return COLORS.INFO;
  };

  const getStatusLabel = (status, payment_status, fulfillment_status) => {
    if (fulfillment_status === 'delivered') return 'Delivered';
    if (payment_status === 'captured') return 'Paid';
    if (payment_status === 'authorized') return 'Payment Pending';
    if (status === 'pending') return 'Processing';
    if (status === 'cancelled') return 'Cancelled';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Safe extraction of address data
  const shippingAddress = order.shipping_address || {};
  const fullShippingAddress = [
    shippingAddress.first_name,
    shippingAddress.address_1,
    shippingAddress.city,
    shippingAddress.province,
    shippingAddress.country_code?.toUpperCase()
  ].filter(Boolean).join(', ');

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.orderTitle}>
              Order #{order.display_id}
            </Text>
            <Text
              variant="labelLarge"
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(
                    order.status,
                    order.payment_status,
                    order.fulfillment_status
                  ),
                },
              ]}
            >
              {getStatusLabel(
                order.status,
                order.payment_status,
                order.fulfillment_status
              )}
            </Text>
          </View>

          <Text variant="bodySmall" style={styles.date}>
            {new Date(order.created_at).toLocaleString()}
          </Text>

          <Divider style={styles.divider} />

          {/* Customer Details */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Customer Details
            </Text>
            {order.email && (
              <Text variant="bodyLarge" style={styles.customerInfo}>
                Email: {order.email}
              </Text>
            )}
            {shippingAddress?.phone && (
              <Text variant="bodyLarge" style={styles.customerInfo}>
                Phone: {shippingAddress.phone}
              </Text>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Shipping Address */}
          {fullShippingAddress && (
            <>
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Shipping Address
                </Text>
                <Text variant="bodyLarge" style={styles.address}>
                  {fullShippingAddress}
                </Text>
              </View>
              <Divider style={styles.divider} />
            </>
          )}

          {/* Order Items */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Order Items
            </Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text variant="titleMedium" style={styles.itemTitle}>
                    {item.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.itemQuantity}>
                    Quantity: {item.quantity}
                  </Text>
                  <Text variant="labelLarge" style={styles.itemPrice}>
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </Text>
                  <Text variant="labelLarge" style={styles.totalPrice}>
                    {formatPrice(item.unit_price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Divider style={styles.divider} />

          {/* Order Summary */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Order Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Subtotal</Text>
              <Text variant="bodyLarge">
                {formatPrice(order.subtotal)}
              </Text>
            </View>
            {order.tax_total > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyLarge">Tax</Text>
                <Text variant="bodyLarge">
                  {formatPrice(order.tax_total)}
                </Text>
              </View>
            )}
            {order.shipping_total > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyLarge">Shipping</Text>
                <Text variant="bodyLarge">
                  {formatPrice(order.shipping_total)}
                </Text>
              </View>
            )}
            <Divider style={styles.totalDivider} />
            <View style={styles.summaryRow}>
              <Text variant="titleLarge" style={styles.totalText}>
                Total
              </Text>
              <Text variant="titleLarge" style={styles.totalAmount}>
                {formatPrice(order.total)}
              </Text>
            </View>
          </View>
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
  card: {
    margin: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTitle: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.TEXT_PRIMARY,
  },
  date: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Poppins_500Medium',
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  customerInfo: {
    fontFamily: 'Poppins_400Regular',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  address: {
    fontFamily: 'Poppins_400Regular',
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: COLORS.DIVIDER,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontFamily: 'Poppins_500Medium',
    color: COLORS.TEXT_PRIMARY,
  },
  itemQuantity: {
    fontFamily: 'Poppins_400Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  itemPrice: {
    fontFamily: 'Poppins_500Medium',
    color: COLORS.TEXT_SECONDARY,
  },
  totalPrice: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.PRIMARY,
    textAlign: 'right',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalDivider: {
    marginVertical: 8,
    backgroundColor: COLORS.DIVIDER,
  },
  totalText: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.TEXT_PRIMARY,
  },
  totalAmount: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.PRIMARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: 'Poppins_500Medium',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default OrderDetail;