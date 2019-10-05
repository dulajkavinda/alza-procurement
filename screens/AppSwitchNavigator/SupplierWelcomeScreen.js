import React from "react";
import { View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/colors";
import CustomActionButton from "../../components/CustomActionButton";
export default class SupplierWelcomeScreen extends React.Component {
  render() {
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
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
            [- Supplier -]
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
            title="Login in"
            onPress={() =>
              this.props.navigation.navigate("SupplierLoginScreen")
            }
          >
            <Text style={{ fontWeight: "100", color: "white" }}>Login</Text>
          </CustomActionButton>
        </View>
      </View>
    );
  }
}
