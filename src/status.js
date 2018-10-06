let status = true;

function start() {
    status = true;
    return status;
}

function stop() {
    status = false;
    return status;
}

function getStatus() {
    return status;
}

module.exports = {
    getStatus,
    start,
    stop
}