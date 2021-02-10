const { AuthorizeStatus } = require('./utils/enums');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


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


const stationIO = io.of("/station");

stationIO.use(async (socket, next) => {
    const authHeader = socket.handshake.headers["authorization"].split(' ')[1];


    const cred = authHeader.split(':');
    const userName = cred[0];
    const password = decodeURIComponent(escape(cred[1]));


    if (stations[userName]) {

        if (stations[userName].password === password) {
            socket.userName = userName;

            next();
        } else {
            socket.emit('AuthFailed', 'Incorrect password')
        }
    } else {
        socket.emit('AuthFailed', 'No Such Station Exist');
    }

});



stationIO.on('connection', function (socket) {

    console.log('Station connected ' + socket.userName);



    socket.on('disconnect', function () {
        console.log('Station disconnected ' + socket.userName);
    });





    socket.on('AuthorizeRequest', async function (data) {

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

    });

});




http.listen(4001, function () {
    console.log('listening on *:4001');
});

