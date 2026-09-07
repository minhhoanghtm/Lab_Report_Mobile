import { Text, View } from 'react-native';

export const InfoRow = ({ info, style }) => {
  return (
    <View>
      <Text style={style}>{info}</Text>
    </View>
  );
};