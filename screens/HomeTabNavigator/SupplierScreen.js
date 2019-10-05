import React from "react";
import { View, FlatList, StyleSheet, Image } from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  List,
  ListItem
} from "native-base";
import {
  Stitch,
  RemoteMongoClient,
  BSON
} from "mongodb-stitch-react-native-sdk";

import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

// images
const imageNames = {
  cement: require("../../assets/cement.jpg"),
  brick: require("../../assets/bricks.jpg"),
  sand: require("../../assets/sand.jpg")
};

class SupplierScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seed: 1,
      page: 1,
      orders: [],
      supplierOrders: [],
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
      type: "",
      orderid: "",
      currentStock: 0,
      orderstate: ""
    };
    console.log("test 1");
    if (Stitch.hasAppClient("procurnment_sw-thchk")) {
      console.log("test 2");
    } else {
      Stitch.initializeDefaultAppClient("procurnment_sw-thchk");
    }

    this.handleRefresh();
  }

  toggleModal = item => {
    this.getCurrentStock(item.itemName);
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
      type: item.type,
      orderid: item.orderid,
      orderstate: item.orderstate
    });
  };

  toggleModalWait = () => {
    this.setState({
      isModalSuccessVisible: !this.state.isModalSuccessVisible
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

    // query to get supplier orders
    const query_sup = {
      supplierid: { $eq: "5d8f6cba1c9d440000f7ef85" },
      orderstate: { $in: ["pending", "waiting"] }
    };
    let suplierOrders = mongoClient.db("alzaproc").collection("supplierorders");
    suplierOrders
      .find(query_sup)
      .toArray()
      .then(items => {
        this.setState({
          orders: page === 1 ? items : [...orders, ...items],
          itemName: items.itemName,
          isRefreshing: false
        });
        items.forEach(console.log);
        //console.log(items[0].item_name);
        return items;
      })
      .catch(err => console.error(`Failed to find documents: ${err}`));
    this.getCurrentStock();
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

  getCurrentStock = name => {
    this.setState({ isLoading: true });

    const StitchClient = Stitch.getAppClient("procurnment_sw-thchk");
    let mongoClient = StitchClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );

    // query to get supplier orders
    const query_sup = {
      supplierid: { $eq: "5d8f6cba1c9d440000f7ef85" },
      itemName: { $eq: name }
    };
    let stock = mongoClient.db("alzaproc").collection("stock");

    stock
      .findOne(query_sup)
      .then(result => {
        if (result) {
          console.log(`Successfully found document: ${result.qty}.`);
          this.setState({ currentStock: result.qty });
        } else {
          console.log("No document matches the provided query.");
        }
      })
      .catch(err => console.error(`Failed to find document: ${err}`));
  };

  updateStock(name) {
    // update the stock after completing the order
    const StitchClient = Stitch.getAppClient("procurnment_sw-thchk");
    let mongoClient = StitchClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );

    // query to get supplier orders
    const query_sup = {
      supplierid: { $eq: "5d8f6cba1c9d440000f7ef85" },
      itemName: { $eq: name }
    };

    const update = {
      $set: {
        qty: this.state.currentStock - this.state.qty
      }
    };

    let stock = mongoClient.db("alzaproc").collection("stock");

    stock
      .updateOne(query_sup, update)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if (matchedCount && modifiedCount) {
          console.log(`Successfully updated the item.`);
        }
      })
      .catch(err => console.error(`Failed to update the item: ${err}`));
    this.toggleModalWait();
    this.orderWait("completed");
  }

  cancelOrder = () => {
    const StitchClient = Stitch.getAppClient("procurnment_sw-thchk");
    let mongoClient = StitchClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );

    // query to get supplier orders
    const query_sup = {
      supplierid: { $eq: "5d8f6cba1c9d440000f7ef85" },
      orderid: { $eq: this.state.orderid }
    };

    const update = {
      $set: {
        orderstate: "cancelled"
      }
    };

    let suplierOrders = mongoClient.db("alzaproc").collection("supplierorders");

    suplierOrders
      .updateOne(query_sup, update)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if (matchedCount && modifiedCount) {
          console.log(`Successfully updated the item.`);
        }
      })
      .catch(err => console.error(`Failed to update the item: ${err}`));
  };

  orderWait = state => {
    const StitchClient = Stitch.getAppClient("procurnment_sw-thchk");
    let mongoClient = StitchClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );

    // query to get supplier orders
    const query_sup = {
      supplierid: { $eq: "5d8f6cba1c9d440000f7ef85" },
      orderid: { $eq: this.state.orderid }
    };

    const update = {
      $set: {
        orderstate: state
      }
    };

    let suplierOrders = mongoClient.db("alzaproc").collection("supplierorders");

    suplierOrders
      .updateOne(query_sup, update)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if (matchedCount && modifiedCount) {
          console.log(`Successfully updated the item.`);
        }
      })
      .catch(err => console.error(`Failed to update the item: ${err}`));
    this.toggleModalWait();
  };

  render() {
    const { isRefreshing } = this.state;
    return (
      <List style={style.scene}>
        <FlatList
          data={this.state.orders}
          renderItem={({ item }) => (
            <ListItem>
              <Card style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={imageNames[item.itemName]}
                    style={{
                      height: 150,
                      width: 100,
                      flex: 1,
                      marginLeft: 18,
                      marginTop: 18
                    }}
                  />
                  <View style={{ flex: 1, marginLeft: 30, marginTop: 18 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 25,
                        marginBottom: 10
                      }}
                    >
                      {item.itemName}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>{item.qty}</Text>{" "}
                      {item.type}
                    </Text>
                    <Text>for {item.category}</Text>
                    <Text>Site - {item.site}</Text>
                    <Button
                      bordered
                      warning
                      style={{ width: 100, height: 40, marginTop: 10 }}
                    >
                      <Text>{item.orderstate}</Text>
                    </Button>
                  </View>
                </View>

                <CardItem>
                  <Left>
                    <Button
                      style={
                        ([styles.buttonStyles],
                        { width: 150, justifyContent: "center" })
                      }
                      success
                      onPress={(onPress = () => this.toggleModal(item))}
                    >
                      <Text> View </Text>
                    </Button>
                  </Left>

                  <Right>
                    <Button
                      style={
                        ([styles.buttonStyles],
                        { width: 150, justifyContent: "center" })
                      }
                      danger
                      onPress={(onPress = () => this.orderWait("cancelled"))}
                    >
                      <Text> Cancel </Text>
                    </Button>
                  </Right>
                </CardItem>
              </Card>
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
                marginTop: 10,
                alignItems: "center"
              }}
            >
              <Ionicons name="ios-paper" size={70} color={"brows"} />
              <Text style={{ fontSize: 18, fontWeight: "300" }}>
                Order :{" "}
                <Text style={{ fontWeight: "bold" }}>{this.state.orderid}</Text>
              </Text>
            </View>
            <View style={{ marginBottom: 1 }}>
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

            {this.state.qty < this.state.currentStock ? (
              <Button
                style={{ margin: 30, justifyContent: "center" }}
                onPress={
                  (onPress = () => this.updateStock(this.state.itemName))
                }
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
            ) : (
              <Button
                style={{ margin: 30, justifyContent: "center" }}
                onPress={this.toggleModal}
                success
                disabled
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white"
                  }}
                >
                  {" "}
                  Stock Not Available{" "}
                </Text>
              </Button>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 20
              }}
            >
              {this.state.orderstate === "waiting" ? (
                <Button
                  style={{ margin: 10, flex: 1, justifyContent: "center" }}
                  warning
                  disabled
                >
                  <Text> Waiting </Text>
                </Button>
              ) : (
                <Button
                  style={{ margin: 10, flex: 1, justifyContent: "center" }}
                  onPress={(onPress = () => this.orderWait("waiting"))}
                  warning
                >
                  <Text> Wait </Text>
                </Button>
              )}

              <Button
                style={{ margin: 10, flex: 1, justifyContent: "center" }}
                onPress={(onPress = () => this.orderWait("cancelled"))}
                danger
              >
                <Text> Decline </Text>
              </Button>
              <Button
                style={{ margin: 10, flex: 1, justifyContent: "center" }}
                onPress={this.toggleModal}
                primary
              >
                <Text> Back </Text>
              </Button>
            </View>
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

const styles = {
  buttonStyles: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 100
  },
  modalStyle: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5
  },
  header: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E9E9E9",
    justifyContent: "center",
    alignItems: "center"
  },
  itemStyle: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5
  }
};

export default SupplierScreen;
