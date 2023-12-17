import {StyleSheet} from 'react-native';
import {black, mainColor, text, white} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: black,
  },
  storeInformation: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  storeName: {
    textTransform: 'capitalize',
    fontSize: 25,
    color: 'white',
    fontWeight: '600',
  },
  followWrap: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
    paddingTop: 10,
  },
  followers: {
    color: mainColor,
    fontWeight: '500',
  },
  followBtn: {
    padding: 5,
    borderRadius: 3,
    elevation: 5,
  },
  followBtnText: {
    fontWeight: '600',
    color: 'white',
  },

  textNoFollow: {textAlign: 'center', fontWeight: '600'},

  // details
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 10,
  },
  name: {
    textAlign: 'center',
    fontSize: 22,
    color: white,
    fontWeight: '600',
  },
  bio: {textAlign: 'center', fontStyle: 'italic', color: text},

  // products
  products: {
    flex: 1,
  },
  productTitle: {
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  list: {
    padding: 20,
  },
});
