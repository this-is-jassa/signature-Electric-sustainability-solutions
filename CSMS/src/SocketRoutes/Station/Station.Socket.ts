import { Socket, Namespace } from 'socket.io';

import SocketNameSpace from '../../Type/Abstract/SocketNamespace';




const stations = {
    '1A': {
        password: 'sqwe&*DSUAASg89&YWSYt786asxASLaswsw'
    }
}

const Groups = {
    Org: new Set(['121212', '322131', '989898']),
    Emergency: new Set(['0000'])
}


const stationsDetails = {
    '1A': {
        evseIdList: {
            'EVSE1': {
                idTokenList: new Set(['121212', '322131', '989898'])
            },
            'EVSE2': {
                idTokenList: new Set(['123456'])
            }
        }
    }
}


const session = [];






export class StationSocket extends SocketNameSpace {

    constructor(_socket: Socket) {
        super(_socket);
    }

    public setUp(): void {

        // Authenticate
        super._socket.use(this.authenticate);

        // Connection
        super._socket.on('connection', async (socket: Socket) => {
            console.log("Client Connected " + socket.id);



            socket.on('AuthorizeRequest', )



            socket.on('disconnect', async () => {
                console.log("Client Disconnected " + socket.id);
            });

        });
    }




    public async authenticate(socket: any, next: any): Promise<void> {

        const authHeader = socket.handshake.headers.authorization.split(' ')[1];

        const cred = authHeader.split(':');
        const userName = cred[0];
        const password = decodeURIComponent(escape(cred[1]));

        // TODO confirm the username password

        if (true) {
            socket.emit('AuthFailed', 'Authorization Failed')
            return socket.disconnect()
        }

        next();
    }


    public async authorize(socket: Socket): Promise<void> {

        const keys = Object.keys(stationsDetails);
        const AuthResponseData = {
            idTokenInfo: {
                evseId: ['EVSE1'],
                status: AuthorizeStatus.Accepted
            }
        }


        let evseId = [];

        keys.forEach((value, index) => {

            const evseIdList = stationsDetails[value].evseIdList;
            for (const property in stationsDetails[socket.userName].evseIdList) {
                if (evseIdList[property].idTokenList.has(data.idToken.idToken)) {
                    evseId.push(property);
                }
            }
        });

        AuthResponseData.idTokenInfo.evseId = evseId;



        if (!stationsDetails['1A'].evseIdList[data.idToken.EVSE].idTokenList.has(data.idToken.idToken)) {
            AuthResponseData.idTokenInfo.status = AuthorizeStatus.NotAllowedTypeEVSE
        } else {
            session.push({ 'EVSE1': data.idToken.idToken })
        }

        for (const groupName in Groups) {
            if (Groups[groupName].has(data.idToken.idToken)) {
                AuthResponseData.idTokenInfo.GroupId = groupName;
                break;
            }
        }

        socket.emit('AuthorizeResponse', AuthResponseData);

    }



}
