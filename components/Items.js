import React, { Component } from "react";
import { Image } from "react-native";
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
  View
} from "native-base";
import Modal from "react-native-modal";
import { Input, Form, Label, Item, Textarea, Switch } from "native-base";

import {
  Stitch,
  RemoteMongoClient,
  BSON
} from "mongodb-stitch-react-native-sdk";

// images
const imageNames = {
  cement: require("../assets/cement.jpg"),
  brick: require("../assets/bricks.jpg"),
  sand: require("../assets/sand.jpg")
};

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class Items extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUserId: null,
      client: null,
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
      isModalSuccessVisible: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    console.log(Stitch.hasAppClient("procurnment_sw-thchk"));
    if (Stitch.hasAppClient("procurnment_sw-thchk")) {
      console.log("hello");
    } else {
      Stitch.initializeDefaultAppClient("procurnment_sw-thchk");
    }

    this.getUser();
    this._addOrders = this._addOrders.bind(this);
    console.log(this.state.person);
  }
  _addOrders = (name, type_) => {
    this.toggleModal();

    const StitchClient = Stitch.getAppClient("procurnment_sw-thchk");
    let mongoClient = StitchClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );

    let itemsCollection = mongoClient.db("alzaproc").collection("orders");

    const order = {
      itemName: name,
      qty: this.state.qty,
      category: "Building",
      total: 0,
      person: this.state.person,
      site: this.state.site,
      state: "pending",
      urgent: false,
      itemDes: this.state.itemDes,
      type: type_,
      urgent: this.state.urgent
    };

    itemsCollection
      .insertOne(order)
      .then(result =>
        console.log(`Successfully inserted item with _id: ${result.insertedId}`)
      )
      .catch(err => console.error(`Failed to insert item: ${err}`));
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  getUser = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.uid);
        firebase
          .database()
          .ref("users/" + user.uid)
          .once("value")
          .then(snapshot => {
            let email = JSON.stringify(snapshot.val().email);
            let site = JSON.stringify(snapshot.val().site);
            this.setState({ person: email, site: site }, () => {
              console.log(this.state.person);
            });
          });
      }
    });
  };

  urgentSwitch = () => {
    this.setState({ urgent: !this.state.urgent });
  };

  render() {
    return (
      <Card>
        <CardItem cardBody>
          <Image
            source={imageNames[this.props.imageName]}
            style={{ height: 190, width: null, flex: 1 }}
          />
        </CardItem>
        <CardItem>
          <Left>
            <Button
              style={styles.buttonStyles}
              success
              onPress={this.toggleModal}
            >
              <Text> Order </Text>
            </Button>
          </Left>
          <Button style={styles.buttonStyles} warning>
            <Text> Info </Text>
          </Button>
        </CardItem>

        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalStyle}>
            <View style={styles.header}>
              <Text style={{ fontSize: 25 }}>Place Order</Text>
            </View>

            <Container>
              <Content>
                <Image
                  source={imageNames[this.props.imageName]}
                  style={{ height: 200, width: null, flex: 1 }}
                />
                <Form>
                  <Item regular style={styles.itemStyle}>
                    <Input
                      keyboardType="numeric"
                      placeholder="Quantity"
                      onChangeText={qty => this.setState({ qty })}
                    />
                    <Right>
                      <Text style={{ marginRight: 20, color: "gray" }}>
                        {this.props.type}
                      </Text>
                    </Right>
                  </Item>

                  <Textarea
                    onChangeText={itemDes => this.setState({ itemDes })}
                    style={styles.itemStyle}
                    rowSpan={5}
                    bordered
                    placeholder="Note.."
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      marginTop: 20,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={{ marginRight: 20, fontWeight: "bold" }}>
                      Urgent
                    </Text>
                    <Switch
                      style={{
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      value={this.state.urgent}
                      onValueChange={this.urgentSwitch}
                    />
                  </View>
                </Form>
              </Content>
            </Container>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                margin: 10
              }}
            >
              <Button
                style={{ margin: 10 }}
                onPress={
                  (onPress = () =>
                    this._addOrders(this.props.imageName, this.props.type))
                }
                success
              >
                <Text> Place Order </Text>
              </Button>
              <Button style={{ margin: 10 }} onPress={this.toggleModal} danger>
                <Text> Cancel </Text>
              </Button>
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.isModalSuccessVisible}>
          <View style={styles.modalStyle}>
            <Image source={require("../assets/success.gif")} />
          </View>
        </Modal>
      </Card>
    );
  }
}

const styles = {
  buttonStyles: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5
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
