import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {Picker} from '@react-native-picker/picker';
import {ItemOptions, Price, Time} from '../../../types/SelectType';
import {Icon} from '@rneui/themed';
import {mainColor} from '../../../constants/colors';

const time: Array<ItemOptions> = [
  {
    title: 'Tùy chọn: Tất cả',
    value: Time.all,
  },
  {
    title: 'Mới nhất',
    value: Time.new,
  },
  {
    title: 'Mua nhiều nhất',
    value: Time.sellest,
  },
];

const price: Array<ItemOptions> = [
  {
    title: 'Giá: Tất cả',
    value: Price.all,
  },
  {
    title: 'Từ thất đến cao',
    value: Price.up,
  },
  {
    title: 'Từ cao đến thấp',
    value: Price.down,
  },
];

interface Props {
  timeOptions: string;
  priceOptions: string;
  setTimeOptions: (timeOptions: string) => void;
  setpriceOptions: (priceOptions: string) => void;
  changeView: boolean;
  setChangeView: (changeView: boolean) => void;
}
export const SelectMenu = memo((props: Props) => {
  const {
    timeOptions = time[0],
    priceOptions = price[0],
    setTimeOptions,
    setpriceOptions,
    changeView,
    setChangeView,
  } = props;
  return (
    <View style={styles.container}>
      <View style={styles.optionItem}>
        <Picker
          selectedValue={timeOptions}
          onValueChange={itemValue => setTimeOptions(itemValue as string)}>
          {time.map(data => (
            <Picker.Item
              style={{color: 'white'}}
              key={data.value}
              label={data.title}
              value={data.value}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.optionItem}>
        <Picker
          selectedValue={priceOptions}
          style={{color: 'white'}}
          onValueChange={itemValue => setpriceOptions(itemValue as string)}>
          {price.map(data => (
            <Picker.Item
              style={{color: '#000'}}
              key={data.value}
              label={data.title}
              value={data.value}
            />
          ))}
        </Picker>
      </View>
      <TouchableOpacity onPress={() => setChangeView(!changeView)}>
        {props.changeView ? (
          <Icon name="grid-view" color={mainColor} />
        ) : (
          <Icon name="view-list" color={mainColor} />
        )}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    color: 'white',
  },

  optionItem: {
    width: '45%',
    color: '#000',
  },
});
