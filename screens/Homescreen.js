import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";

// imports
import FooterItem from "../components/footer/FooterItem";
import Items from "../components/Items";

export default class Homescreen extends React.Component {
  constructor() {
    super();
    this.state = {
      itemsCount: 0,
      ongoingCount: 0,
      historyCount: 0,
      items: [],
      currentOrders: [],
      pastOrders: []
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />

        {/* <View style={styles.header}>
          <Text style={{ fontSize: 24 }}>Procurement System</Text>
        </View> */}

        <View style={styles.body}>
          <ScrollView>
            <Items imageName="cement" type="bags" />
            <Items imageName="brick" type="pcs" />
            <Items imageName="sand" type="kg" />
          </ScrollView>
        </View>
        {/* 
        <View style={styles.footer}>
          <FooterItem title="Items" count={this.state.itemsCount} />
          <FooterItem title="Ongoing" count={this.state.ongoingCount} />
          <FooterItem title="History" count={this.state.historyCount} />
        </View> */}

        <SafeAreaView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E9E9E9",
    justifyContent: "center",
    alignItems: "center"
  },
  footer: {
    height: 70,
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#E9E9E9"
  },
  body: {
    flex: 1
  }
});
