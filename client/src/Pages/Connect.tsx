import React, { useEffect, useState, ChangeEvent } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";
import TextField from "@mui/material/TextField";

interface Peer {
  address: string;
}

function Connect() {
  const [isLoading, setIsLoading] = useState(true);

  const [existingPeers, setExistingPeers] = useState([]);
  const [names, setNames] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [connectedPeers, setConnectedPeers] = useState<{ name: string }[]>([]);
  const [connectRemoteIdentityPubkey, setConnectRemoteIdentityPubkey] =
    useState("");
  const [remoteHostAddress, setRemoteHostAddress] = useState("");
  const [remotePort, setRemotePort] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    const filtered = names.filter((item: string) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredNames(filtered);
  };

  useEffect(() => {
    checkToken();
    reloadPeers();
    getUsers();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem("isLoggedIn");

    Axios.get("http://localhost:3002/api/accessResource", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (!response.data.success) {
        const responseData = "false";
        window.location.href = `http://localhost:3000/Login?responseData=${JSON.stringify(
          responseData
        )}`;
      } else {
        setIsLoading(false);
      }
    });
  };

  /*
    TODO:
    only peers from this app are visible on the application due to /getNames
    others can be seen in /listpeers 
    response is a field: features which contains name: https://api.lightning.community/api/lnd/lightning/list-peers/index.html#lnrpcfeature 
    to do in future: see if that is suited, to list a different connected peer with name. otherwise only listable with address ?
  */
  const reloadPeers = () => {
    Axios.post("http://localhost:3001/listpeers", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    })
      .then((response) => {
        console.log(response);
        setExistingPeers(response.data.peers);
        const addresses = response.data.peers.map((peer: Peer) => {
          const parts = peer.address.split(":");
          const port = parseInt(parts[1]) - 10000;
          return port;
        });
        // get names for each port
        return Axios.get("http://localhost:3002/api/getNames", {
          params: {
            ports: addresses,
          },
        });
      })
      .then((response) => {
        setConnectedPeers(response.data.names);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUsers = () => {
    Axios.get("http://localhost:3002/api/getUsers").then((response) => {
      setNames(response.data.names.map((item: any) => item.name));
    });
  };

  const connectPeerByList = (name: string) => {
    Axios.post("http://localhost:3002/api/getIdAndPubKey", {
      name: name,
    }).then((response) => {
      Axios.post("http://localhost:3001/connectpeer", {
        user_id_token: localStorage.getItem("isLoggedIn"),
        pub_key: response.data.users[0].pubkey,
        host: "localhost",
        port: response.data.users[0].id + 10000,
      }).then((response) => {
        console.log(response);
      });
    });
  };

  const connectPeer = () => {
    console.log(connectRemoteIdentityPubkey);
    console.log(remotePort);
    Axios.post("http://localhost:3001/connectpeer", {
      user_id_token: localStorage.getItem("isLoggedIn"),
      pub_key: connectRemoteIdentityPubkey,
      host: remoteHostAddress,
      port: remotePort,
    }).then((response) => {
      console.log(response);
    });
  };

  const openChannel = (name: string) => {
    console.log(name)
    Axios.post("http://localhost:3002/api/getIdAndPubKey", {
      name: name,
    }).then((response) => {
      console.log(response)
      const responseData = response.data;
      window.location.href = `http://localhost:3000/Channels?responseData=${JSON.stringify(responseData)}&name=${name}`
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "connectRemoteIdentityPubkey":
        setConnectRemoteIdentityPubkey(value);
        break;
      case "remoteHostAddress":
        setRemoteHostAddress(value);
        break;
      case "remotePort":
        setRemotePort(value);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <Grid container spacing={2}>
      <Grid xs={5}>
        <h3>Existing Connections to Peers</h3>
        {existingPeers.length === 0 ? (
          <p>No existing connections to peers</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {connectedPeers.map((item, index) => (
              <li key={index}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid>{item.name}</Grid>
                  <Grid>
                    <Button onClick={() => openChannel(item.name)}>
                      Open Channel
                    </Button>
                  </Grid>
                </Grid>
              </li>
            ))}
          </ul>
        )}
        <Button onClick={reloadPeers} variant="contained">
          Reload Peers
        </Button>
      </Grid>
      <Grid xs={6}>
        <h3>Connect to new Peers</h3>
        <TextField
          fullWidth
          label="Search"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <ul style={{ listStyleType: "none", padding: 20 }}>
          {filteredNames.map((name, index) => (
            <li key={index}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid>{name}</Grid>
                <Grid>
                  <Button onClick={() => connectPeerByList(name)}>
                    Connect
                  </Button>
                </Grid>
              </Grid>
            </li>
          ))}
        </ul>
      </Grid>
      <Grid xs={4}>
        <h3>Connect To Peers Manually</h3>
        <TextField
          fullWidth
          label="PubKey"
          name="connectRemoteIdentityPubkey"
          value={connectRemoteIdentityPubkey}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <TextField
          fullWidth
          label="Host Address"
          name="remoteHostAddress"
          value={remoteHostAddress}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <TextField
          fullWidth
          label="Port"
          name="remotePort"
          value={remotePort}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <Button onClick={connectPeer} variant="contained">
          Connect To Peer
        </Button>
      </Grid>
    </Grid>
  );
}

export default Connect;
