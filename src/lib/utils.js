function navigateBack(e) {
    if (e) {
        e.preventDefault();
    }
    history.back();
}

function sleep(millis) {
    return new Promise((resolve, _) => setTimeout(resolve, millis));
}

export {
    navigateBack,
    sleep,
}
