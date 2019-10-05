import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator,
  createDrawerNavigator,
  createBottomTabNavigator
} from "react-navigation";

import WelcomeScreen from "./screens/AppSwitchNavigator/WelcomeScreen";
import LoadingScreen from "./screens/AppSwitchNavigator/LoadingScreen";
import Homescreen from "./screens/Homescreen";
import LoginScreen from "./screens/LoginScreen";
import SettingScreen from "./screens/SettingScreen";
import CustomDrawerComponent from "./screens/DrawerNavigator/CustomDrawerComponent";
import OngoingOrdersScreen from "./screens/HomeTabNavigator/OngoingOrdersScreen";
import OrderHistory from "./screens/HomeTabNavigator/OrderHistoryScreen";

import CustomActionButton from "./components/CustomActionButton";

// supplier
import SupplierWelcomeScreen from "./screens/AppSwitchNavigator/SupplierWelcomeScreen";
import SupplierLoginScreen from "./screens/SupplierLoginScreen";
import SupplierScreen from "./screens/HomeTabNavigator/SupplierScreen";
import SupplierOngoingScreen from "./screens/HomeTabNavigator/SupplierOngoingScreen";
import SupplierHistoryScreen from "./screens/HomeTabNavigator/SupplierHistoryScreen";
import SupplierLoadingScreen from "./screens/AppSwitchNavigator/SupplierLoadingScreen";

// delivery
import DeliveryWelcomeScreen from "./screens/AppSwitchNavigator/DeliveryWelcomeScreen";
import DeliveryLoginScreen from "./screens/DeliveryLoginScreen";
import DeliveryScreen from "./screens/HomeTabNavigator/DeliveryScreen";
import DeliveryLoadingScreen from "./screens/AppSwitchNavigator/DeliveryLoadingScreen";

import {
  Stitch,
  RemoteMongoClient,
  BSON
} from "mongodb-stitch-react-native-sdk";
import colors from "./assets/colors";
import { Ionicons } from "@expo/vector-icons";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config";
import { Button } from "native-base";

export default class App extends React.Component {
  constructor() {
    super();
    this.initializeFirebase();
    this.state = {
      userType: "home"
    };
    Stitch.initializeDefaultAppClient("procurnment_sw-thchk");
  }

  initializeFirebase = () => {
    firebase.initializeApp(firebaseConfig);
  };

  switchUser(index) {
    this.setState({ userType: index });
  }

  render() {
    if (this.state.userType === "home") {
      return (
        <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
          <View
            style={{
              flex: 1,
              borderColor: "black",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Ionicons name="ios-barcode" size={150} color={colors.logoColor} />
            <Text style={{ fontSize: 50, fontWeight: "100", color: "white" }}>
              Alza Procurement
            </Text>
            <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>
              Log In As
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center"
            }}
          >
            <CustomActionButton
              style={{
                width: 200,
                backgroundColor: "transparent",
                borderWidth: 0.5,
                borderColor: colors.bgPrimary,
                marginBottom: 10
              }}
              title="Worker"
              onPress={() => this.switchUser("worker")}
            >
              <Text style={{ fontWeight: "100", color: "white" }}>Worker</Text>
            </CustomActionButton>
            <CustomActionButton
              style={{
                width: 200,
                backgroundColor: "transparent",
                borderWidth: 0.5,
                borderColor: colors.bgPrimary,
                marginBottom: 10
              }}
              title="Worker"
              onPress={() => this.switchUser("supplier")}
            >
              <Text style={{ fontWeight: "100", color: "white" }}>
                Supplier
              </Text>
            </CustomActionButton>
            <CustomActionButton
              style={{
                width: 200,
                backgroundColor: "transparent",
                borderWidth: 0.5,
                borderColor: colors.bgPrimary,
                marginBottom: 10
              }}
              title="Worker"
              onPress={() => this.switchUser("delivery")}
            >
              <Text style={{ fontWeight: "100", color: "white" }}>
                Delivery
              </Text>
            </CustomActionButton>
          </View>
        </View>
      );
    } else if (this.state.userType === "worker") {
      return <AppContainer />;
    } else if (this.state.userType === "supplier") {
      return <SupplierContainer />;
    } else if (this.state.userType === "delivery") {
      return <DeliveryContainer />;
    }
  }
}

const LoginNavigator = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
        header: null
      }
    },
    LoginScreen
  },
  {
    mode: "modal",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.bgMain
      }
    }
  }
);
const HomeTabNavigator = createBottomTabNavigator(
  {
    Homescreen: {
      screen: Homescreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-reorder" size={30} color={tintColor} />
        ),
        tabBarLabel: "Items"
      }
    },
    OngoingOrdersScreen: {
      screen: OngoingOrdersScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-analytics" size={20} color={tintColor} />
        ),
        tabBarLabel: "Ongoing"
      }
    },
    OrderHistory: {
      screen: OrderHistory,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-aperture" size={20} color={tintColor} />
        ),
        tabBarLabel: "History"
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: colors.bgMain,
        height: 70,
        borderTopWidth: 1
      },
      tabStyle: {
        padding: 0,
        margin: 0 //Padding 0 here
      },
      labelStyle: {
        fontSize: 16,
        marginBottom: 10
      },
      activeTintColor: "red",
      inactiveTintColor: colors.bgTextInput
    }
  }
);

HomeTabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  switch (routeName) {
    case "Homescreen":
      return {
        headerTitle: "Items"
      };
    case "OngoingOrdersScreen":
      return {
        headerTitle: "Ongoing"
      };
    case "OrderHistory":
      return {
        headerTitle: "History"
      };
    default:
      return {
        headerTitle: "Alza Procurnment"
      };
  }
};

const HomeStackNavigator = createStackNavigator(
  {
    HomeTabNavigator: {
      screen: HomeTabNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Ionicons
              name="ios-menu"
              size={30}
              color="black"
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 10 }}
            />
          )
        };
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "white"
      },
      headerTintColor: colors.txtWhite
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    HomeStackNavigator: {
      screen: HomeStackNavigator,
      navigationOptions: {
        title: "Home",
        drawerIcon: () => <Ionicons name="ios-home" size={24} />
      }
    },
    SettingScreen: {
      screen: SettingScreen,
      navigationOptions: {
        title: "Settings",
        drawerIcon: () => <Ionicons name="ios-settings" size={24} />
      }
    }
  },
  {
    contentComponent: CustomDrawerComponent
  }
);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen,
  LoginNavigator,
  AppDrawerNavigator
});

const AppContainer = createAppContainer(AppSwitchNavigator);

// supplier

const SupplierLoginNavigator = createStackNavigator(
  {
    SupplierWelcomeScreen: {
      screen: SupplierWelcomeScreen,
      navigationOptions: {
        header: null
      }
    },
    SupplierLoginScreen
  },
  {
    mode: "modal",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.bgMain
      }
    }
  }
);

const SupplierHomeTabNavigator = createBottomTabNavigator(
  {
    SupplierScreen: {
      screen: SupplierScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-reorder" size={30} color={tintColor} />
        ),
        tabBarLabel: "Orders"
      }
    },
    SupplierOngoingScreen: {
      screen: SupplierOngoingScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-analytics" size={20} color={tintColor} />
        ),
        tabBarLabel: "Cancelled"
      }
    },
    SupplierHistoryScreen: {
      screen: SupplierHistoryScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-aperture" size={20} color={tintColor} />
        ),
        tabBarLabel: "Completed"
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: colors.bgMain,
        height: 70,
        borderTopWidth: 1
      },
      tabStyle: {
        padding: 0,
        margin: 0 //Padding 0 here
      },
      labelStyle: {
        fontSize: 16,
        marginBottom: 10
      },
      activeTintColor: "red",
      inactiveTintColor: colors.bgTextInput
    }
  }
);

SupplierHomeTabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  switch (routeName) {
    case "SupplierScreen":
      return {
        headerTitle: "Ongoing"
      };
    case "SupplierOngoingScreen":
      return {
        headerTitle: "Cancelled"
      };
    case "SupplierHistoryScreen":
      return {
        headerTitle: "Completed"
      };
    default:
      return {
        headerTitle: "Alza Procurnment"
      };
  }
};

const SupplierHomeStackNavigator = createStackNavigator(
  {
    SupplierHomeTabNavigator: {
      screen: SupplierHomeTabNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Ionicons
              name="ios-menu"
              size={30}
              color="black"
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 10 }}
            />
          )
        };
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "white"
      },
      headerTintColor: colors.txtWhite
    }
  }
);

const SupplierAppDrawerNavigator = createDrawerNavigator(
  {
    SupplierHomeStackNavigator: {
      screen: SupplierHomeStackNavigator,
      navigationOptions: {
        title: "Home",
        drawerIcon: () => <Ionicons name="ios-home" size={24} />
      }
    },
    SettingScreen: {
      screen: SettingScreen,
      navigationOptions: {
        title: "Settings",
        drawerIcon: () => <Ionicons name="ios-settings" size={24} />
      }
    }
  },
  {
    contentComponent: CustomDrawerComponent
  }
);

const SupplierAppSwitchNavigator = createSwitchNavigator({
  SupplierLoadingScreen,
  SupplierLoginNavigator,
  SupplierAppDrawerNavigator
});

const SupplierContainer = createAppContainer(SupplierAppSwitchNavigator);

// delivery

const DeliveryLoginNavigator = createStackNavigator(
  {
    DeliveryWelcomeScreen: {
      screen: DeliveryWelcomeScreen,
      navigationOptions: {
        header: null
      }
    },
    DeliveryLoginScreen
  },
  {
    mode: "modal",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.bgMain
      }
    }
  }
);

const DeliveryHomeTabNavigator = createBottomTabNavigator(
  {
    DeliveryScreen: {
      screen: DeliveryScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-reorder" size={30} color={tintColor} />
        ),
        tabBarLabel: "Delivery"
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: colors.bgMain,
        height: 70,
        borderTopWidth: 1
      },
      tabStyle: {
        padding: 0,
        margin: 0 //Padding 0 here
      },
      labelStyle: {
        fontSize: 16,
        marginBottom: 10
      },
      activeTintColor: "red",
      inactiveTintColor: colors.bgTextInput
    }
  }
);

DeliveryHomeTabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  switch (routeName) {
    case "DeliveryScreen":
      return {
        headerTitle: "Ongoing"
      };
    default:
      return {
        headerTitle: "Alza Procurnment"
      };
  }
};

const DeliveryHomeStackNavigator = createStackNavigator(
  {
    DeliveryHomeTabNavigator: {
      screen: DeliveryHomeTabNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Ionicons
              name="ios-menu"
              size={30}
              color="black"
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 10 }}
            />
          )
        };
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "white"
      },
      headerTintColor: colors.txtWhite
    }
  }
);

const DeliveryAppDrawerNavigator = createDrawerNavigator(
  {
    SupplierHomeStackNavigator: {
      screen: DeliveryHomeStackNavigator,
      navigationOptions: {
        title: "Home",
        drawerIcon: () => <Ionicons name="ios-home" size={24} />
      }
    },
    SettingScreen: {
      screen: SettingScreen,
      navigationOptions: {
        title: "Settings",
        drawerIcon: () => <Ionicons name="ios-settings" size={24} />
      }
    }
  },
  {
    contentComponent: CustomDrawerComponent
  }
);

const DeliveryAppSwitchNavigator = createSwitchNavigator({
  DeliveryLoadingScreen,
  DeliveryLoginNavigator,
  DeliveryAppDrawerNavigator
});

const DeliveryContainer = createAppContainer(DeliveryAppSwitchNavigator);
