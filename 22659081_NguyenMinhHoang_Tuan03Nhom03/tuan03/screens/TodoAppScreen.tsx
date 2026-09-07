import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ThemeColors,
  ThemeProvider,
  useAppTheme,
} from '../contexts/ThemeContext';

// Bước 1: Cấu trúc dữ liệu của công việc
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// Bước 2: Tạo reducer quản lý danh sách công việc
type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'CLEAR_COMPLETED' };

const initialTodos: Todo[] = [
  { id: '1', title: 'Học React Native cơ bản', completed: true },
  { id: '2', title: 'Thực hành các React Hooks', completed: false },
  { id: '3', title: 'Xây dựng ứng dụng Todo App hoàn chỉnh', completed: false },
];

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD_TODO': {
      const trimmedTitle = action.payload.trim();
      if (!trimmedTitle) return state;
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: trimmedTitle,
        completed: false,
      };
      return [newTodo, ...state];
    }
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    case 'CLEAR_COMPLETED':
      return state.filter(todo => !todo.completed);
    default:
      return state;
  }
}

// Component TodoItem được tối ưu bằng React.memo
interface TodoItemProps {
  item: Todo;
  colors: ThemeColors;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = memo(function TodoItem({
  item,
  colors,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <View
      style={[
        styles.todoItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => onToggle(item.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: item.completed ? colors.success : colors.subText },
            item.completed && { backgroundColor: colors.success },
          ]}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[
            styles.todoTitle,
            { color: item.completed ? colors.completedText : colors.text },
            item.completed && styles.completedTitle,
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.danger }]}
        onPress={() => onDelete(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

// Component nội dung chính của Todo App
const TodoContent = () => {
  // Bước 4: useContext - sử dụng chủ đề sáng/tối
  const { isDarkMode, toggleTheme, colors } = useAppTheme();

  // Bước 2: useReducer - quản lý danh sách công việc
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  // Bước 3: useState - quản lý ô nhập công việc và từ khóa tìm kiếm
  const [inputText, setInputText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  // Bước 7: useEffect - theo dõi số lượng công việc khi danh sách thay đổi
  useEffect(() => {
    console.log(`[useEffect] Danh sách hiện có ${todos.length} công việc`);
  }, [todos.length]);

  // Bước 6: useCallback - các hàm xử lý truyền xuống component con
  const handleToggle = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }, []);

  const handleDelete = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);

  const handleAddTodo = useCallback(() => {
    if (inputText.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputText });
      setInputText('');
    }
  }, [inputText]);

  // Bước 5: useMemo - lọc danh sách công việc theo từ khóa và trạng thái
  const filteredTodos = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return todos.filter(todo => {
      const matchKeyword = todo.title.toLowerCase().includes(keyword);
      if (!matchKeyword) return false;

      if (filterStatus === 'active') return !todo.completed;
      if (filterStatus === 'completed') return todo.completed;
      return true;
    });
  }, [todos, searchKeyword, filterStatus]);

  // Bước 5: useMemo - tính số lượng công việc chưa hoàn thành
  const incompleteCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Header & Toggle Dark Mode */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.appTitle, { color: colors.text }]}>
            Quản lý công việc
          </Text>
          <Text style={[styles.badgeText, { color: colors.subText }]}>
            Còn{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>
              {incompleteCount}
            </Text>{' '}
            việc chưa xong
          </Text>
        </View>

        <View style={styles.themeToggleRow}>
          <Text style={[styles.themeLabel, { color: colors.subText }]}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#90caf9' }}
          />
        </View>
      </View>

      {/* Form thêm công việc */}
      <View style={styles.addRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập công việc mới..."
          placeholderTextColor={colors.subText}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddTodo}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Ô tìm kiếm */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          placeholder="🔍 Tìm kiếm công việc..."
          placeholderTextColor={colors.subText}
        />
      </View>

      {/* Bộ lọc trạng thái chia đều 3 cột */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor:
                filterStatus === 'all' ? colors.primary : isDarkMode ? '#2c2c2c' : '#f0f2f5',
            },
          ]}
          onPress={() => setFilterStatus('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterStatus === 'all' ? '#fff' : colors.subText },
            ]}
          >
            Tất cả ({todos.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor:
                filterStatus === 'active' ? colors.primary : isDarkMode ? '#2c2c2c' : '#f0f2f5',
            },
          ]}
          onPress={() => setFilterStatus('active')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterStatus === 'active' ? '#fff' : colors.subText },
            ]}
          >
            Chưa làm ({incompleteCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor:
                filterStatus === 'completed' ? colors.primary : isDarkMode ? '#2c2c2c' : '#f0f2f5',
            },
          ]}
          onPress={() => setFilterStatus('completed')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterStatus === 'completed' ? '#fff' : colors.subText },
            ]}
          >
            Đã xong ({todos.length - incompleteCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách công việc */}
      <FlatList
        data={filteredTodos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            colors={colors}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.subText }]}>
              {searchKeyword.trim()
                ? 'Không tìm thấy công việc phù hợp'
                : 'Chưa có công việc nào trong danh sách'}
            </Text>
          </View>
        }
        style={styles.list}
        scrollEnabled={false}
      />
    </View>
  );
};

// Component bao ngoài cung cấp ThemeProvider
const TodoAppScreen = () => {
  return (
    <ThemeProvider>
      <TodoContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 8,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  badgeText: {
    fontSize: 12,
    marginTop: 3,
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  themeLabel: {
    fontSize: 15,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  addButton: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  searchWrapper: {
    marginBottom: 12,
  },
  searchInput: {
    height: 38,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    marginVertical: 2,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  todoTitle: {
    fontSize: 14,
    flex: 1,
    lineHeight: 19,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});

export default TodoAppScreen;

