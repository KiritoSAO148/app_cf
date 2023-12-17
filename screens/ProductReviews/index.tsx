import {
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Badge, Header, Icon, LinearProgress} from '@rneui/themed';
import {styles} from './style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../routes';
import {mainColor} from '../../constants/colors';
import {Rating} from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import {dataRating, productReviews} from './data';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {RootState} from '../../redux/store';
import {UserImage} from '../../constants/images';
import {fullnameOfUser} from '../../types/userType';
import moment from 'moment';
import {CommentType} from '../../types/commentType';
import commentActions from '../../actions/commentActions';
import ProductSkeleton from './components/ProductSkeleton';
import {toastConfig} from '../../components/toastConfig';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductReviews'>;

export default function ProductReviews({route, navigation}: Props) {
  const {productName, averageStarRating, productId} = route.params;
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const [rate, setRate] = useState(5);
  const [loading, setLoading] = useState(true);
  const comments = useAppSelector(state => state.comment.comments);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    await dispatch(commentActions.getProductComments(productId)).then(() =>
      setLoading(false),
    );
  };

  useEffect(() => {
    fetchComments();
  }, [navigation]);

  const isLiked = (comment: CommentType) =>
    comment.reaction.some(react => react === user?._id);

  const isCommented = comments.some(comment => comment.auth._id === user?._id);

  const countRate = (rateNumber: number) => {
    return comments.filter(comment => comment.rate === rateNumber).length;
  };

  const handleRate = (e: number) => {
    setRate(e);
  };

  const textRate = useMemo(
    () => dataRating.find(data => data.value === rate),
    [rate],
  );

  const handleLike = (comment: CommentType) => {
    dispatch(
      commentActions.reactCommentActions({
        commentId: comment._id!,
        auth: user?._id!,
        reaction: isLiked(comment) ? 'Unlike' : 'Like',
      }),
    );
  };

  const handleSendComment = comment => {
    if (!user?._id) {
      return Toast.show({type: 'success', text1: 'Yêu cầu đăng nhập!'});
    }
    dispatch(
      commentActions.addComment({
        userId: user?._id!,
        productId,
        content: newComment,
        commentId: comment._id!,
        rate: +rate,
      }),
    );

    setNewComment('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        backgroundColor="transparent"
        barStyle="dark-content"
        leftComponent={
          <Icon
            name="arrow-back-ios"
            color={mainColor}
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={
          <Text style={styles.title}>
            {productName.length > 20
              ? productName.slice(0, 20) + '...'
              : productName}
          </Text>
        }
      />

      {loading ? (
        <View>
          <LinearProgress color={mainColor} />
          <ProductSkeleton />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.rateView}>
              <View style={styles.rateStar}>
                <LinearGradient
                  colors={[
                    '#fff',
                    '#EBF0C9',
                    '#C9DF9A',
                    '#9FCD72',
                    '#71BB4E',
                    '#60AB00',
                  ]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.rateAvgBox}>
                  <Text style={styles.rateAvgText}>{averageStarRating}</Text>
                  <Text style={styles.rateAvgSub}>/5</Text>
                </LinearGradient>
                <Rating
                  imageSize={18}
                  startingValue={averageStarRating}
                  readonly
                />
              </View>
              <View>
                {dataRating
                  .map((data, index) => (
                    <View key={index} style={styles.viewRateCount}>
                      <Text style={styles.viewRateCountText}>{data.label}</Text>
                      <Rating
                        imageSize={22}
                        startingValue={data.value}
                        readonly
                      />
                      <Text>{countRate(data.value)}</Text>
                    </View>
                  ))
                  .reverse()}
              </View>
            </View>

            {!user ? (
              <View style={styles.formReqLogin}>
                <Text style={styles.formText}>Đăng nhập để bình luận</Text>

                <View style={styles.formBtns}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.formBtnLogin}>
                    <Text style={styles.formBtnText}>Đăng nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.formBtnRegister}>
                    <Text style={styles.formBtnText}>Đăng ký</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              !isCommented && (
                <View style={styles.commnents}>
                  <Text style={styles.commentTitle}>Thêm đánh giá</Text>

                  <View style={styles.userView}>
                    <Image
                      style={styles.userAvatar}
                      source={user?.avatar ? {uri: user?.avatar!} : UserImage}
                    />

                    <View style={styles.viewComment}>
                      <View style={styles.userRate}>
                        <Text style={styles.nameOfUser}>
                          {fullnameOfUser(user?.fullname!)}
                        </Text>
                        <View style={styles.rate}>
                          <Rating
                            imageSize={22}
                            startingValue={5}
                            onStartRating={handleRate}
                          />
                          <Text>{textRate?.label}</Text>
                        </View>
                      </View>

                      <View style={styles.formInput}>
                        <TextInput
                          defaultValue={newComment}
                          multiline
                          placeholder="Viết bình luận..."
                          onChangeText={setNewComment}
                          numberOfLines={1}
                          style={{...styles.input, width: '50%'}}
                        />
                        <Icon
                          name="send"
                          color={mainColor}
                          onPress={handleSendComment}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.recommends}>
                    {productReviews.map((text, index) => (
                      <Text
                        onPress={() => setNewComment(text)}
                        style={styles.textRecommend}
                        key={index}>
                        {text}
                      </Text>
                    ))}
                  </View>
                </View>
              )
            )}

            {comments.length > 0 && (
              <ScrollView style={styles.listComments}>
                {comments.map(comment => (
                  <View key={comment._id}>
                    <View style={styles.userView}>
                      <Image
                        style={styles.userAvatar}
                        source={user?.avatar ? {uri: user?.avatar!} : UserImage}
                      />

                      <View style={styles.viewComment}>
                        <View style={styles.userLike}>
                          <View style={styles.userRate}>
                            <Text style={styles.nameOfUser}>
                              {fullnameOfUser(user?.fullname!)}
                            </Text>
                            <Text>
                              {moment(comment.updatedAt).endOf('day').fromNow()}
                            </Text>
                          </View>

                          <View>
                            <Icon
                              onPress={() => handleLike(comment)}
                              name={`thumb-up${
                                !isLiked(comment) ? '-off-alt' : ''
                              }`}
                              color={mainColor}
                              size={40}
                            />
                            <Badge
                              status="success"
                              value={comment.reaction.length}
                              containerStyle={{
                                position: 'absolute',
                                left: 30,
                              }}
                            />
                          </View>
                        </View>
                        <View style={styles.rate}>
                          <Rating
                            readonly
                            imageSize={22}
                            startingValue={comment.rate}
                          />
                          <Text>
                            {
                              dataRating.find(
                                data => data.value === comment.rate,
                              )?.label
                            }
                          </Text>
                        </View>

                        <Text>{comment.content}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
