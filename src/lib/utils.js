function navigateBack(e) {
    if (e) {
        e.preventDefault();
    }
    history.back();
}

export {
    navigateBack
}
