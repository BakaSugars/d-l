export const wsServerUrl = 'ws://0.0.0.0:8989';
export const PlayerMessageType = {
    UPDATE: 0,
    CREATE_BULLET: 1
}

export const WorldMessageType = {
    UPDATE: 0,
}

function IsPC(userAgentInfo: string) {
    try {
        return !/Android|SymbianOS|Windows Phone|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(userAgentInfo);
    } catch (e) {
        return true;
    }
}

export const isPc = IsPC(navigator.userAgent);