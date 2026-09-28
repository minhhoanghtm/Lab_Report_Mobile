import { Tabs } from "expo-router";

import CustomTabBar from "../../components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Danh mục",
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Tài khoản",
        }}
      />
    </Tabs>
  );
}