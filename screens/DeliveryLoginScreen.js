import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";

import colors from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";
import {
  Header,
  Body,
  Title,
  FooterTab,
  Icon,
  Button,
  Footer
} from "native-base";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

class DeliveryLoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoading: false,
      userType: "worker"
    };
  }
  onSignIn = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);
        if (response) {
          this.setState({ isLoading: false });
          this.props.navigation.navigate("DeliveryLoadingScreen");
        }
      } catch (error) {
        this.setState({ isLoading: false });
        switch (error.code) {
          case "auth/user-not-found":
            alert("A user with that email does not exist. Try signing Up");
            break;
          case "auth/invalid-email":
            alert("Please enter an email address");
        }
      }
    } else {
      alert("Please enter  email or password");
    }
  };

  onSignUp = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );
        if (response) {
          this.setState({ isLoading: false });

          const user = await firebase
            .database()
            .ref("users/")
            .child(response.user.uid)
            .set({
              email: response.user.email,
              uid: response.user.uid,
              site: 1
            });

          this.props.navigation.navigate("LoadingScreen");
        }
      } catch (error) {
        this.setState({ isLoading: false });
        if (error.code == "auth/email-already-in-use") {
          alert("User already exists.Try loggin in");
        }
        console.log(error);
      }
    } else {
      alert("Please enter email and password");
    }
  };

  switchUser(index) {
    this.setState({ userType: index });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header>
          <Body>
            <Title>Login</Title>
          </Body>
        </Header>
        {this.state.isLoading ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                elevation: 1000
              }
            ]}
          >
            <ActivityIndicator size="large" color={colors.bgMain} />
          </View>
        ) : null}
        <View style={{ flex: 1, justifyContent: "center", marginTop: 30 }}>
          <TextInput
            style={styles.textInput}
            placeholder={"abc@example.com"}
            placeholderTextColor={colors.bgTextInputDark}
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
          />
          <TextInput
            style={styles.textInput}
            placeholder="enter password"
            placeholderTextColor={colors.bgTextInputDark}
            secureTextEntry
            onChangeText={password => this.setState({ password })}
          />
          <View style={{ alignItems: "center" }}>
            <Footer
              backgroundColor="gray"
              style={{ width: 200, borderRadius: 20 }}
            >
              {/* <FooterTab style={{ backgroundColor: "gray", borderRadius: 20 }}>
                <Button
                  onPress={() => this.switchUser("worker")}
                  style={{ borderRadius: 18 }}
                  active={this.state.userType === "worker"}
                >
                  <Text>Worker</Text>
                </Button>
                <Button
                  onPress={() => this.switchUser("supplier")}
                  style={{ borderRadius: 18 }}
                  active={this.state.userType == "supplier"}
                >
                  <Text>Supplier</Text>
                </Button>

                <Button
                  onPress={() => this.switchUser("delivery")}
                  style={{ borderRadius: 18 }}
                  active={this.state.userType == "delivery"}
                >
                  <Text>Delivery</Text>
                </Button>
              </FooterTab> */}
            </Footer>
          </View>
          <View style={{ alignItems: "center" }}>
            <CustomActionButton
              onPress={this.onSignIn}
              style={[styles.loginButtons, { borderColor: colors.bgPrimary }]}
            >
              <Text style={{ color: "black" }}>Login</Text>
            </CustomActionButton>
            <CustomActionButton
              onPress={this.onSignUp}
              style={[styles.loginButtons, { borderColor: colors.bgError }]}
            >
              <Text style={{ color: "black" }}>Sign Up</Text>
            </CustomActionButton>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  }
}
export default DeliveryLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  textInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "black",
    marginHorizontal: 40,
    marginBottom: 10,
    color: "black",
    paddingHorizontal: 10
  },
  loginButtons: {
    borderWidth: 0.5,
    backgroundColor: "transparent",
    marginTop: 10,
    width: 200
  }
});
