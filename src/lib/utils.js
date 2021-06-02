function navigateBack(e) {
    if (e) {
        e.preventDefault();
    }
    history.back();
}

function sleep(millis) {
    return new Promise((resolve, _) => setTimeout(resolve, millis));
}

const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export { navigateBack, sleep, numberFormatter };
