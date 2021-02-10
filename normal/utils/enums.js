const idTokenType = {
    "Central": "Central",
    "eMAID": "eMAID",
    "ISO14443": "ISO14443",
    "ISO15693": "ISO15693",
    "KeyCode": "KeyCode",
    "Local": "Local",
    "MacAddress": "MacAddress",
    "NoAuthorization": "NoAuthorization"
}

const AuthorizeStatus = {
    "Accepted": "Accepted",
    "Blocked": "Blocked",
    "ConcurrentTx": "ConcurrentTx",
    "Expired": "Expired",
    "Invalid": "Invalid",
    "NoCredit": "NoCredit",
    "NotAllowedTypeEVSE": "NotAllowedTypeEVSE",
    "NotAtThisLocation": "NotAtThisLocation",
    "NotAtThisTime": "NotAtThisTime",
    "Unknown": "Unknown"
}

module.exports = { idTokenType, AuthorizeStatus }
