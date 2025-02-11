import React from 'react';
import { View, StyleSheet, Image, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { COLORS } from '../theme';
import { formatPrice } from '../utils/cartUtils';
import { useCustomerOrders } from '../services/queries';

const OrderHistory = ({ navigation }) => {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useCustomerOrders();

  const orders = data?.pages.flatMap(page => page.orders) || [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator animating={true} color={COLORS.PRIMARY} size="large" />
      </View>
    );
  };

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

  const renderItem = ({ item: order }) => (
    <Card key={order.id} style={styles.orderCard} mode="elevated">
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text variant="titleMedium" style={styles.orderNumber}>
              Order #{order.display_id}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
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

        <Divider style={styles.divider} />

        <View style={styles.itemsContainer}>
          {order.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index < order.items.length - 1 && styles.itemBorder,
              ]}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text variant="titleSmall" style={styles.itemTitle}>
                  {item.title}
                </Text>
                <Text variant="bodySmall" style={styles.itemQuantity}>
                  Qty: {item.quantity} × {formatPrice(item.unit_price)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <Text variant="titleMedium">Total</Text>
            <Text variant="titleMedium" style={styles.totalAmount}>
              {formatPrice(order.total)}
            </Text>
          </View>
          {/* <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('OrderDetail', { orderDetails: { order } })
            }
            style={styles.viewButton}
          >
            View Details
          </Button> */}
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={COLORS.PRIMARY} size="large" />
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineMedium" style={styles.emptyText}>
          No orders found
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.shopButton}
        >
          Start Shopping
        </Button>
      </View>
    );
  }

  return (
    <FlashList
      data={orders}
      renderItem={renderItem}
      estimatedItemSize={300}
      contentContainerStyle={styles.container}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.PRIMARY]} tintColor={COLORS.PRIMARY} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
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
    marginBottom: 16,
  },
  shopButton: {
    minWidth: 200,
  },
  orderCard: {
    marginBottom: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.TEXT_PRIMARY,
  },
  date: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Poppins_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Poppins_500Medium',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: COLORS.DIVIDER,
  },
  itemsContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontFamily: 'Poppins_500Medium',
    color: COLORS.TEXT_PRIMARY,
  },
  itemQuantity: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Poppins_400Regular',
  },
  footer: {
    marginTop: 8,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalAmount: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins_600SemiBold',
  },
  viewButton: {
    marginTop: 8,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default OrderHistory;