import React, { Component } from "react";

class MongoClient extends React.Component {
  getClient = () => {
    Stitch.initializeDefaultAppClient("procurnment_sw-thchk").then(client => {
      if (client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id });
        console.log("user: ", this.state.currentUserId);
        return client;
      }
    });
  };
}

export default MongoClient;
