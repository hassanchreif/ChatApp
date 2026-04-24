import * as signalR from "@microsoft/signalr";

export const createConnection = () => {
  const token = localStorage.getItem("token");

  return new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5135/chathub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
};