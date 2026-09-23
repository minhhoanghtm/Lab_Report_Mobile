import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export interface CategoryChipsProps {
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  alignContentMode?: 'flex-start' | 'stretch';
}

const DEFAULT_CATEGORIES = [
  'Văn học',
  'Kinh tế',
  'Thiếu nhi',
  'Kỹ năng sống',
  'Truyện tranh',
  'Ngoại ngữ',
  'Lịch sử',
  'Khoa học - Công nghệ',
  'Tâm lý học',
];

/**
 * Bài tập: Danh sách danh mục dạng chip (Category Chips)
 * 
 * Yêu cầu kỹ thuật:
 * • Container: flexDirection: 'row', flexWrap: 'wrap', gap: 8.
 * • Mỗi chip: paddingHorizontal, paddingVertical, borderRadius lớn (dạng pill), border 1px màu indigo.
 * • So sánh khi có alignContent: 'flex-start' và khi không có — quan sát cách các dòng xếp.
 * • Gợi ý: width của mỗi chip nên để 'auto' theo nội dung, không set cố định.
 */
export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories = DEFAULT_CATEGORIES,
  selectedCategory: controlledSelected,
  onSelectCategory,
  alignContentMode = 'flex-start',
}) => {
  const [internalSelected, setInternalSelected] = useState<string>('Văn học');
  const activeCategory = controlledSelected ?? internalSelected;

  const handlePress = (item: string) => {
    setInternalSelected(item);
    onSelectCategory?.(item);
  };

  return (
    <View
      style={[
        styles.container,
        // alignContentMode ? { alignContent: alignContentMode } : {},
      ]}
    >
      {categories.map((item) => {
        const isSelected = item === activeCategory;
        return (
          <TouchableOpacity
            key={item}
            activeOpacity={0.7}
            onPress={() => handlePress(item)}
            style={[
              styles.chip,
              isSelected && styles.chipActive,
            ]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // Container theo Yêu cầu kỹ thuật
  // ==========================================
  container: {
    flexDirection: 'row', // Xếp ngang
    flexWrap: 'wrap', // Tự động xuống dòng khi tràn màn hình
    gap: 8, // Khoảng cách giữa các chip (ngang và dọc)
    padding: 16,
  },

  // ==========================================
  // Mỗi Chip theo Yêu cầu kỹ thuật
  // ==========================================
  chip: {
    paddingHorizontal: 16, // Padding ngang
    paddingVertical: 8, // Padding dọc
    borderRadius: 24, // Bo tròn lớn (dạng viên thuốc / pill)
    borderWidth: 1, // Border 1px
    borderColor: '#3B82F6', // Màu xanh / indigo theo đề bài
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start', // width auto theo nội dung, không set cố định
    justifyContent: 'center',
    alignItems: 'center',
  },

  chipActive: {
    backgroundColor: '#1A237E', // Màu Navy / Indigo khi chọn
    borderColor: '#1A237E',
  },

  chipText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },

  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default CategoryChips;
