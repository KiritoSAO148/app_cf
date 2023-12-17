import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {memo, useState} from 'react';
import {OrderItemType, OrderStatus, PayMethod} from '../../types/orderType';
import OrderProductItem from './components/OrderProductItem';
import moment from 'moment';
import {styles} from './styles';
import {Divider} from '@rneui/themed';
import {moneyFormat} from '../../utils/handlers/moneyFormat';
import {mainColor} from '../../constants/colors';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {orderActions} from '../../actions/orderActions';
import {RootState} from '../../redux/store';

const OrderItem = memo((order: OrderItemType) => {
  const [isLoading, setIsLoading] = useState(false);
  const getColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pending:
        return 'orange';
      case OrderStatus.refuse:
        return 'red';
      default:
        return mainColor;
    }
  };

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);

  const handleAccess = async () => {
    setIsLoading(true);
    dispatch(
      orderActions.submitStatusOrder({
        userId: user!._id as string,
        orderId: order._id as string,
        status: OrderStatus.done,
      }),
    )
      .unwrap()
      .finally(() => setIsLoading(false));
  };

  const handleRefure = async () => {
    setIsLoading(true);
    dispatch(
      orderActions.submitStatusOrder({
        userId: user!._id as string,
        orderId: order._id as string,
        status: OrderStatus.refuse,
      }),
    )
      .unwrap()
      .finally(() => setIsLoading(false));
  };

  const color = getColor(order.status);
  return (
    <View style={{...styles.orderItem, shadowColor: color}}>
      <Text style={styles.orderTime}>
        {moment(order.createdAt).format('LLLL')}
      </Text>
      <View style={styles.productList}>
        <FlatList
          data={order.products}
          renderItem={({item}) => <OrderProductItem {...item} />}
        />
      </View>

      <Divider />

      {order.voucherUsed.discount > 0 && (
        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoText}>Voucher đã sử dụng:</Text>
          <Text style={styles.orderInfoPrice}>{order.voucherUsed.voucher}</Text>
        </View>
      )}
      {order.voucherUsed.discount > 0 && (
        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoText}>Giảm giá voucher:</Text>
          <Text style={styles.orderInfoPrice}>
            -{order.voucherUsed.discount}%
          </Text>
        </View>
      )}
      <View style={styles.orderInfo}>
        <Text style={styles.orderInfoText}>Tổng số tiền:</Text>
        <Text style={styles.orderInfoPrice}>
          {moneyFormat(order.totalPrice)}
        </Text>
      </View>
      <View style={styles.orderInfo}>
        <Text style={styles.orderInfoText}>Phương thức thanh toán:</Text>
        <Text style={styles.orderInfoPrice}>
          {order.pay.method === PayMethod.payNow
            ? 'Thanh toán trực tuyến'
            : 'Thanh toán khi nhận hàng'}
        </Text>
      </View>

      <View>
        <Divider />

        {order.status === OrderStatus.pending && (
          <View>
            <Text style={{...styles.text, color}}>
              {order.pay.method === PayMethod.payNow
                ? 'Người bán đang chuẩn bị hàng'
                : 'Đang chờ xác nhận'}
            </Text>
            <TouchableOpacity style={styles.btnPending} onPress={handleRefure}>
              <Text style={styles.btnTextPending}>Hủy đơn hàng</Text>
            </TouchableOpacity>
          </View>
        )}
        {order.status === OrderStatus.access &&
          (isLoading ? (
            <ActivityIndicator />
          ) : (
            <View>
              <Text style={{...styles.text, color}}>Đang giao hàng</Text>
              <TouchableOpacity onPress={handleAccess} style={styles.btnAccess}>
                <Text style={styles.accessText}>Đã nhận được hàng</Text>
              </TouchableOpacity>
            </View>
          ))}
        {order.status === OrderStatus.refuse && (
          <View>
            <Text style={{...styles.text, color}}>Đã hủy</Text>
            <View style={styles.formRefure}>
              <Text>Lí do:</Text>
              <Text style={styles.textRefure}>{order.message}</Text>
            </View>
          </View>
        )}
        {order.status === OrderStatus.done && (
          <Text style={{...styles.text, color}}>Hoàn tất</Text>
        )}
      </View>
    </View>
  );
});

export default OrderItem;
