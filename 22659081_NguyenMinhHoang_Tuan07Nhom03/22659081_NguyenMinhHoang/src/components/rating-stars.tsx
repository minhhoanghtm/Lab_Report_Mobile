import { Pressable, StyleSheet, Text, View } from 'react-native';

export type RatingStarsProps = {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};
export function RatingStars({ value, size = 22, onChange, disabled = false }: RatingStarsProps) {
  const rating = Number.isFinite(value) ? Math.min(5, Math.max(0, value)) : 0;
  const starSize = Number.isFinite(size) && size > 0 ? size : 22;
  return (
    <View style={styles.row} accessible={!onChange}
      accessibilityLabel={!onChange ? `${rating.toFixed(1)} trên 5 sao` : undefined}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(1, Math.max(0, rating - star + 1));
        const glyph = (
          <View style={{ width: starSize, height: starSize * 1.3 }} accessible={false}>
            <Text style={[styles.star, { fontSize: starSize, lineHeight: starSize * 1.3, color: '#94a3b8' }]}>★</Text>
            <View style={[styles.fill, { width: `${fill * 100}%` }]}>
              <Text style={[styles.star, { width: starSize, fontSize: starSize, lineHeight: starSize * 1.3, color: '#d97706' }]}>★</Text>
            </View>
          </View>
        );
        return onChange ? (
          <Pressable key={star} accessibilityRole="button" accessibilityLabel={`Chọn ${star} sao`}
            accessibilityState={{ selected: rating === star, disabled }}
            disabled={disabled} onPress={() => onChange(star)} style={styles.touch}>
            {glyph}
          </Pressable>
        ) : <View key={star}>{glyph}</View>;
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  star: { fontWeight: '400' },
  fill: { position: 'absolute', left: 0, top: 0, overflow: 'hidden', height: '100%' },
  touch: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});