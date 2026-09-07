import React, { useReducer } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormState {
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  successMessage: string;
}

type FormAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'START_SUBMIT' }
  | { type: 'SUBMIT_SUCCESS'; payload: string }
  | { type: 'SUBMIT_FAILURE'; payload: string }
  | { type: 'RESET' };

const initialState: FormState = {
  email: '',
  password: '',
  error: '',
  isSubmitting: false,
  successMessage: '',
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload, error: '', successMessage: '' };

    case 'SET_PASSWORD':
      return { ...state, password: action.payload, error: '', successMessage: '' };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isSubmitting: false };

    case 'START_SUBMIT':
      return { ...state, isSubmitting: true, error: '', successMessage: '' };

    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, successMessage: action.payload, error: '' };

    case 'SUBMIT_FAILURE':
      return { ...state, isSubmitting: false, error: action.payload };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

const Bai4UseReducer = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleLogin = () => {
    // 1. Kiểm tra bỏ trống
    if (!state.email.trim() || !state.password.trim()) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Vui lòng nhập đầy đủ email và mật khẩu.',
      });
      return;
    }

    // 1. Mở rộng: Kiểm tra email có chứa ký tự @
    if (!state.email.includes('@')) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Email không hợp lệ (phải chứa ký tự @).',
      });
      return;
    }

    // 2. Mở rộng: Yêu cầu mật khẩu có ít nhất 6 ký tự
    if (state.password.length < 6) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Mật khẩu phải có ít nhất 6 ký tự.',
      });
      return;
    }

    // 3. Mở rộng: Bắt đầu quá trình đăng nhập (isSubmitting = true)
    dispatch({ type: 'START_SUBMIT' });

    // Giả lập gọi API đăng nhập sau 1.5 giây
    setTimeout(() => {
      dispatch({
        type: 'SUBMIT_SUCCESS',
        payload: `Đăng nhập thành công với email: ${state.email}`,
      });
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài 4: useReducer (Đăng nhập)</Text>

      {/* Input Email */}
      <TextInput
        style={styles.input}
        value={state.email}
        onChangeText={text => dispatch({ type: 'SET_EMAIL', payload: text })}
        placeholder="Nhập địa chỉ email..."
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!state.isSubmitting}
      />

      {/* Input Password */}
      <TextInput
        style={styles.input}
        value={state.password}
        onChangeText={text => dispatch({ type: 'SET_PASSWORD', payload: text })}
        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
        placeholderTextColor="#999"
        secureTextEntry
        editable={!state.isSubmitting}
      />

      {/* Thông báo lỗi */}
      {state.error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      ) : null}

      {/* Thông báo thành công */}
      {state.successMessage ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✅ {state.successMessage}</Text>
        </View>
      ) : null}

      {/* Nút Đăng nhập */}
      <TouchableOpacity
        style={[styles.loginButton, state.isSubmitting && styles.disabledButton]}
        onPress={handleLogin}
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.buttonText}>Đang đăng nhập...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>

      {/* Nút Đặt lại */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => dispatch({ type: 'RESET' })}
        disabled={state.isSubmitting}
      >
        <Text style={styles.resetButtonText}>Đặt lại</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  errorBox: {
    padding: 10,
    backgroundColor: '#fff2f0',
    borderWidth: 1,
    borderColor: '#ffccc7',
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 13,
    fontWeight: '500',
  },
  successBox: {
    padding: 10,
    backgroundColor: '#f6ffed',
    borderWidth: 1,
    borderColor: '#b7eb8f',
    borderRadius: 8,
    marginBottom: 12,
  },
  successText: {
    color: '#52c41a',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    backgroundColor: '#f0f2f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  resetButtonText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default Bai4UseReducer;
