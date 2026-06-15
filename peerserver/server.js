// Minimal PeerJS signaling server for the RC Arena AR app.
// Only relays connection handshakes; car data goes peer-to-peer (WebRTC).
const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT || 9000;
const PEER_PATH = process.env.PEER_PATH || '/peer';

// health check / sanity route
app.get('/', (_req, res) => res.send('RC Arena PeerJS server: OK'));

const server = app.listen(PORT, () =>
  console.log(`PeerJS server listening on :${PORT}${PEER_PATH}`));

const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: false,   // don't expose the list of connected peers
});

app.use(PEER_PATH, peerServer);

peerServer.on('connection', (c) => console.log('connect   ', c.getId()));
peerServer.on('disconnect', (c) => console.log('disconnect', c.getId()));
