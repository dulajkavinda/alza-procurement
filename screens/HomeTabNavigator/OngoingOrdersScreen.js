import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { List, ListItem, Body, Right, Button } from "native-base";

import {
  Stitch,
  RemoteMongoClient,
  BSON
} from "mongodb-stitch-react-native-sdk";

import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

class OngoingOrdersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seed: 1,
      page: 1,
      orders: [],
      isRefreshing: false,
      isLoading: false,
      isModalSuccessVisible: false,
      itemName: "",
      qty: 0,
      itemDes: "",
      category: "",
      total: 0,
      person: "",
      site: "",
      state: "pending",
      urgent: false,
      type: ""
    };

    if (Stitch.hasAppClient("procurnment_sw-thchk")) {
      console.log("hello");
    } else {
      Stitch.initializeDefaultAppClient("procurnment_sw-thchk");
    }

    this.handleRefresh();
  }

  toggleModal = item => {
    this.setState({
      isModalSuccessVisible: !this.state.isModalSuccessVisible,
      itemName: item.itemName,
      qty: item.qty,
      itemDes: item.itemDes,
      category: item.category,
      total: item.total,
      person: item.person,
      site: item.site,
      state: item.state,
      urgent: item.urgent,
      type: item.type
    });
  };

  handleRefresh = () => {
    this.setState(
      {
        seed: this.state.seed + 1,
        isRefreshing: true
      },
      () => {
        this.loadOrders();
      }
    );
  };

  componentDidMount() {
    this.loadOrders();
  }

  loadOrders = () => {
    const { orders, seed, page } = this.state;
    this.setState({ isLoading: true });

    const StitchClient = Stitch.getAppClient("procurnment_sw-thchk");
    let mongoClient = StitchClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const query = { state: { $ne: "approved" } };
    let itemsCollection = mongoClient.db("alzaproc").collection("orders");

    itemsCollection
      .find(query)
      .toArray()
      .then(items => {
        console.log(`Successfully found ${items.length} documents.`);

        this.setState({
          orders: page === 1 ? items : [...orders, ...items],
          isRefreshing: false
        });
        //items.forEach(console.log);
        console.log(items[0].item_name);
        return items;
      })
      .catch(err => console.error(`Failed to find documents: ${err}`));
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.loadOrders();
      }
    );
  };

  render() {
    const { isRefreshing } = this.state;
    return (
      <List style={style.scene}>
        <FlatList
          data={this.state.orders}
          renderItem={({ item }) => (
            <ListItem>
              <Body>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {item.itemName}
                </Text>
                <Text>
                  Quantity : {item.qty} {item.type} | Site : {item.site}
                </Text>
                <Button
                  style={{
                    width: 107,
                    height: 28,
                    backgroundColor: "#07797a",
                    paddingLeft: 2.5
                  }}
                >
                  <Text style={{ color: "white" }}>
                    State :{" "}
                    <Text style={{ fontWeight: "bold" }}>{item.state}</Text>
                  </Text>
                </Button>
              </Body>

              {item.urgent ? (
                <Right>
                  <Ionicons name="ios-warning" size={29} color={"red"} />
                </Right>
              ) : null}
              <Right>
                <Button
                  transparent
                  onPress={(onPress = () => this.toggleModal(item))}
                >
                  <Ionicons name="ios-eye" size={30} color={"gray"} />
                </Button>
              </Right>
            </ListItem>
          )}
          refreshing={isRefreshing}
          onRefresh={this.handleRefresh}
          //onEndReached={this.handleLoadMore}
          onEndThreshold={0}
        />
        <Modal isVisible={this.state.isModalSuccessVisible}>
          <View style={style.modalStyle}>
            <View
              style={{
                flex: 1,
                marginTop: 30,
                alignItems: "center"
              }}
            >
              <Ionicons name="ios-paper" size={70} color={"brows"} />
              <Text style={{ fontSize: 25, fontWeight: "300" }}>
                State : {this.state.state}
              </Text>
            </View>
            <View style={{ marginBottom: 50 }}>
              <List>
                <ListItem>
                  <Text>Item : </Text>
                  <Text style={{ fontSize: 14 }}>{this.state.itemName}</Text>
                </ListItem>
                <ListItem>
                  <Text>Quantity :</Text>
                  <Text style={{ fontSize: 14, marginRight: 3 }}>
                    {this.state.qty}
                  </Text>
                  <Text>{this.state.type}</Text>
                </ListItem>
                <ListItem>
                  <Text>Note :</Text>
                  <Text style={{ fontSize: 14 }}>{this.state.itemDes}</Text>
                </ListItem>
                <ListItem>
                  <Text>Category : </Text>
                  <Text style={{ fontSize: 14 }}>{this.state.category}</Text>
                </ListItem>
                <ListItem>
                  <Text>Total : </Text>
                  <Text style={{ marginRight: 80, fontSize: 14 }}>
                    {this.state.total}
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>Ordered by :</Text>
                  <Text style={{ marginRight: 80, fontSize: 14 }}>
                    {this.state.person}
                  </Text>
                </ListItem>
              </List>
            </View>
            <Button
              style={{ margin: 30, justifyContent: "center" }}
              onPress={this.toggleModal}
              success
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white"
                }}
              >
                {" "}
                OK{" "}
              </Text>
            </Button>
          </View>
        </Modal>
      </List>
    );
  }
}

const style = StyleSheet.create({
  scene: {
    flex: 1,
    paddingTop: 25
  },
  user: {
    width: "100%",
    backgroundColor: "#333",
    marginBottom: 10,
    paddingLeft: 25
  },
  userName: {
    fontSize: 17,
    paddingVertical: 20,
    color: "#fff"
  },
  modalStyle: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5
  }
});

export default OngoingOrdersScreen;
