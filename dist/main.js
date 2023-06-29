"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const EventHandlers_1 = require("./EventHandlers");
const crypto = __importStar(require("crypto"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http.createServer(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*'
}));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../.env") });
server.listen(process.env.PORT, () => {
    console.log(`Server runnning on port ${process.env.PORT}`);
});
const socket_server = new WebSocket.Server({ path: "/ws", server });
socket_server.on('connection', function () {
    console.log('connected');
});
exports.rooms = new Map();
// server.on('upgrade', function(req, socket, head) {
//     socket.on('error', (e) => console.log(e))
//     console.log("here")
//     socket_server.handleUpgrade(req, socket, head, function done(ws) {
//         socket_server.emit('connection', ws, req)
//     })  
// })
socket_server.on("connection", (webSocket) => {
    webSocket.on('message', function (incoming) {
        const message = JSON.parse(incoming.toString());
        console.log(message);
        const { data, event_type } = message;
        switch (event_type) {
            case 'join-room':
                console.log(data);
                (0, EventHandlers_1.handleJoinRoom)(data.id, webSocket);
                break;
        }
    });
    webSocket.send('connected');
});
app.get("/create-room", (req, res) => {
    var uid = crypto.randomUUID();
    let arr = new Array();
    exports.rooms.set(uid, arr);
    console.log(exports.rooms);
    return res.status(200).json({
        success: true,
        uid: uid
    });
});
