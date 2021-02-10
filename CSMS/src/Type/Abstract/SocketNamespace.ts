import { Socket } from "socket.io";


abstract class SocketNameSpace {
    _socket: Socket;

    constructor(_socket: Socket) {
        this._socket = _socket;
    }

    abstract setUp(): void;

}

export default SocketNameSpace;
