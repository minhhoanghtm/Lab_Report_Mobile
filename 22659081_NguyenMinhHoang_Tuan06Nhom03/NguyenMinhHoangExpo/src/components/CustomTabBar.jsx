import { Pressable, Text, View } from "react-native";

const tabs = {
  index: {
    label: "Home",
    icon: "⌂",
  },
  categories: {
    label: "Danh mục",
    icon: "▦",
  },
  cart: {
    label: "Giỏ hàng",
    icon: "🛒",
  },
  account: {
    label: "Tài khoản",
    icon: "👤",
  },
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}) {
  return (
    <View className="border-t border-gray-200 bg-white px-2 py-2">
      <View className="flex-row">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const tab = tabs[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center"
            >
              <View
                className={`items-center rounded-xl px-3 py-2 ${
                  isFocused ? "bg-blue-50" : ""
                }`}
              >
                <Text
                  className={`text-xl ${
                    isFocused
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab.icon}
                </Text>

                <Text
                  className={`mt-1 text-xs ${
                    isFocused
                      ? "font-bold text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}