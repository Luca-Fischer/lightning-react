import React, { useEffect, useState, ChangeEvent } from "react";
import Button from "@mui/material/Button";
import Axios from "axios";
import TextField from "@mui/material/TextField";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Channel {
  active: boolean;
  remote_pubkey: string;
  channel_point: string;
  chan_id: string;
  capacity: string;
  local_balance: string;
  remote_balance: string;
  commit_fee: string;
  commit_weight: string;
  fee_per_kw: string;
  unsettled_balance: string;
  total_satoshis_sent: string;
  total_satoshis_received: string;
  num_updates: string;
  pending_htlcs: HTLC[];
  csv_delay: number;
  private: boolean;
  initiator: boolean;
  chan_status_flags: string;
  local_chan_reserve_sat: string;
  remote_chan_reserve_sat: string;
  static_remote_key: boolean;
  commitment_type: CommitmentType;
  lifetime: string;
  uptime: string;
  close_address: string;
  push_amount_sat: string;
  thaw_height: number;
  local_constraints: ChannelConstraints;
  remote_constraints: ChannelConstraints;
  alias_scids: number[];
  zero_conf: boolean;
  zero_conf_confirmed_scid: string;
}

interface HTLC {
  incoming: boolean;
  amount: string;
  hash_lock: string;
  expiration_height: number;
  htlc_index: string;
  forwarding_channel: string;
  forwarding_htlc_index: string;
}

interface ChannelConstraints {
  csv_delay: number;
  chan_reserve_sat: string;
  dust_limit_sat: string;
  max_pending_amt_msat: string;
  min_htlc_msat: string;
  max_accepted_htlcs: number;
}

enum CommitmentType {
  UNKNOWN_COMMITMENT_TYPE = 0,
  LEGACY = 1,
  STATIC_REMOTE_KEY = 2,
  ANCHORS = 3,
  SCRIPT_ENFORCED_LEASE = 4,
}

function Channels() {
  const [existingChannels, setExistingChannels] = useState<Channel[]>([]);
  const [identityPubkey, setIdentityPubkey] = useState("");
  const [remoteIdentityPubkey, setRemoteIdentityPubkey] = useState("");
  const [channelAmount, setChannelAmount] = useState("");
  const [channelAmountToSmall, setChannelAmountToSmall] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const location = useLocation();

  const [result, setResult] = useState<
    { id: string; name: string; pubkey: string }[]
  >([]);

  const errorResponse = {
    error: {
      code: 1,
      message: "Wait for block confirmation!",
      details: [],
    },
  };

  const message = `${encodeURIComponent(JSON.stringify(errorResponse))}`;

  useEffect(() => {
    loadChannels();
    getInfo();
    const searchParams = new URLSearchParams(location.search);
    const responseDataString = searchParams.get("responseData");
    const responseData = responseDataString && JSON.parse(responseDataString);

    if (responseData) {
      setName(searchParams.get("name"));
      setRemoteIdentityPubkey(responseData.users[0].pubkey);
    }
  }, [location]);

  const loadChannels = () => {
    const remotePubkeys: string[] = [];

    Axios.post("http://localhost:3001/listchannels", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    })
      .then((response) => {
        setExistingChannels(response.data.channels);
        response.data.channels.forEach((item: { remote_pubkey: string }) => {
          const remotePubkey = item.remote_pubkey;
          if (!remotePubkeys.includes(remotePubkey)) {
            remotePubkeys.push(remotePubkey);
          }
        });

        return Axios.get("http://localhost:3002/api/getByPubkey", {
          params: {
            pubkey: remotePubkeys,
          },
        });
      })
      .then((response) => {
        setResult(response.data.result);
        console.log(response.data.result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getInfo = () => {
    Axios.post("http://localhost:3001/getinfo", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    }).then((response) => {
      setIdentityPubkey(response.data.identity_pubkey);
    });
  };

  const openChannel = () => {
    console.log(remoteIdentityPubkey);
    console.log(channelAmount);
    if (Number(channelAmount) >= 20000) {
      Axios.post("http://localhost:3001/openchannel", {
        user_id_token: localStorage.getItem("isLoggedIn"),
        identity_pub_key: remoteIdentityPubkey,
        amount: channelAmount,
      }).then((response) => {
        console.log(response.data);
      });
    } else {
      setChannelAmountToSmall(true);
    }
  };

  const handleChangeOpenChannel = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    switch (field) {
      case "remoteIdentityPubkey":
        setRemoteIdentityPubkey(event.target.value);
        break;
      case "channelAmount":
        setChannelAmount(event.target.value);
        break;
      default:
        break;
    }
  };

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const expand =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      {!name ? (
        <div>
          <h3>Existing Channels</h3>
          {existingChannels.length === 0 ? (
            <p>No existing channels</p>
          ) : (
            <div>
              {existingChannels.map((item, index) => {
                const matchingResult = result.find(
                  (r) => r.pubkey === item.remote_pubkey
                );

                return (
                  <Accordion
                    expanded={expanded === `panel${index + 1}`}
                    onChange={expand(`panel${index + 1}`)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel4bh-content"
                      id="panel4bh-header"
                    >
                      <Typography sx={{ width: "33%", flexShrink: 0 }}>
                        {matchingResult ? matchingResult.name : "Name"}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div>{item.remote_pubkey}</div>
                        <div>Item Capacity: {item.capacity}</div>
                        <div>Local Balance: {item.local_balance}</div>
                        <div>Remote Balance: {item.remote_balance}</div>
                        <div>
                          Total Satoshis Sent: {item.total_satoshis_sent}
                        </div>
                        <div>
                          Total Satoshis Received:{" "}
                          {item.total_satoshis_received}
                        </div>
                        <br></br>
                        <Link
                          to={{
                            pathname: "/payment",
                            search: `?responseData=${
                              matchingResult ? `${matchingResult.id}-sep-${matchingResult.name}` : ""
                            }`,
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <Button variant="contained">Make Payment</Button>
                        </Link>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          )}
          <br></br>
          <Button onClick={loadChannels} variant="contained">
            Reload Data
          </Button>

          <h3 style={{ marginTop: "100px" }}>Open Channels Manually</h3>
          <p>Your Identity Pubkey: {identityPubkey}</p>
          <TextField
            fullWidth
            label="Partners' Identity PubKey"
            value={remoteIdentityPubkey}
            onChange={(event) =>
              handleChangeOpenChannel(event, "remoteIdentityPubkey")
            }
          />
          <br></br>
          <br></br>
          {!channelAmountToSmall ? (
            <TextField
              fullWidth
              label="Channel Amount"
              value={channelAmount}
              onChange={(event) =>
                handleChangeOpenChannel(event, "channelAmount")
              }
            />
          ) : (
            <TextField
              error
              fullWidth
              label="ChannelAmount"
              helperText="Minimum 20000 SAT"
              value={channelAmount}
              onChange={(event) =>
                handleChangeOpenChannel(event, "channelAmount")
              }
            />
          )}
          <br></br>
          <br></br>
          <Link
            to={{ pathname: "/handling", search: `?responseData=${message}` }}
            style={{ textDecoration: "none" }}
          >
            <Button onClick={openChannel} variant="contained">
              Open Channel
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          {" "}
          <h3 style={{ marginTop: "100px" }}>Open Channel with {name}</h3>
          <p>Only Channel Amount is required!</p>
          <TextField
            fullWidth
            label="Partners' Identity PubKey"
            value={remoteIdentityPubkey}
            onChange={(event) =>
              handleChangeOpenChannel(event, "remoteIdentityPubkey")
            }
          />
          <br></br>
          <br></br>
          {!channelAmountToSmall ? (
            <TextField
              fullWidth
              label="Channel Amount"
              value={channelAmount}
              onChange={(event) =>
                handleChangeOpenChannel(event, "channelAmount")
              }
            />
          ) : (
            <TextField
              error
              fullWidth
              label="ChannelAmount"
              helperText="Minimum 20000 SAT"
              value={channelAmount}
              onChange={(event) =>
                handleChangeOpenChannel(event, "channelAmount")
              }
            />
          )}
          <br></br>
          <br></br>
          <Link
            to={{ pathname: "/handling", search: `?responseData=${message}` }}
            style={{ textDecoration: "none" }}
          >
            <Button onClick={openChannel} variant="contained">
              Open Channel
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Channels;
