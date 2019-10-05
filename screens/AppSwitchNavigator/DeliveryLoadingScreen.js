import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import * as firebase from "firebase/app";
import "firebase/auth";
import colors from "../../assets/colors";
class DeliveryLoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //navigate to home screen
        this.props.navigation.navigate("DeliveryScreen", { user });
      } else {
        //login screen
        this.props.navigation.navigate("DeliveryLoginNavigator");
      }
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.logoColor} />
      </View>
    );
  }
}
export default DeliveryLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgMain
  }
});
