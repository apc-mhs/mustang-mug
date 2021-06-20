class PurchaseWindow {
    constructor(dayOfWeek, start, end, maxOrders) {
        this.dayOfWeek = dayOfWeek;
        this.start = start;
        this.end = end;
        this.maxOrders = maxOrders;
    }

    get current() {
        const now = new Date();
        return this.start <= now && now <= this.end && this.dayOfWeek === now.getDay();
    }

    get duration() {
        return this.end.toDate() - this.start.toDate();
    }

    toCurrent() {
        return new CurrentPurchaseWindow(this.dayOfWeek, this.start, this.end, this.maxOrders, 0);
    }

    isEqual(other) {
        if (Object.keys(this).length !== Object.keys(other).length) return false;

        for (let prop in this) {
            if (!this[prop] === other[prop]) {
                return false;
            }
        }

        return true;
    }

    /** @param {typeof import("firebase/app").default.firestore.Timestamp} timestampClass */
    static converter(timestampClass) {
        return {
            /** @returns {import("firebase/app").default.firestore.DocumentData} */
            toFirestore: function (purchaseWindow) {
                return {
                    dayOfWeek: purchaseWindow.dayOfWeek,
                    start: purchaseWindow.start.toTimestamp(timestampClass),
                    end: purchaseWindow.end.toTimestamp(timestampClass),
                    maxOrders: purchaseWindow.maxOrders
                };
            },
            fromFirestore: function (snapshot, options) {
                const data = snapshot.data(options);
                return new PurchaseWindow(data.dayOfWeek, Time.fromTimestamp(data.start), Time.fromTimestamp(data.end), data.maxOrders);
            }
        };
    }
}

class CurrentPurchaseWindow extends PurchaseWindow {
    constructor(dayOfWeek, start, end, maxOrders, orders) {
        super(dayOfWeek, start, end, maxOrders);
        this.orders = orders;
    }

    get exhausted() {
        return this.orders >= this.maxOrders;
    }

    /** @param {typeof import("firebase/app").default.firestore.Timestamp} timestampClass */
    static converter(timestampClass) {
        return {
            toFirestore: function (currentPurchaseWindow) {
                return {
                    ...PurchaseWindow.converter(timestampClass).toFirestore(currentPurchaseWindow),
                    orders: currentPurchaseWindow.orders
                };
            },
            fromFirestore: function (snapshot, options) {
                const data = snapshot.data(options);
                return new CurrentPurchaseWindow(data.dayOfWeek, Time.fromTimestamp(data.start), Time.fromTimestamp(data.end), data.maxOrders, data.orders);
            }
        };
    }
}

class Time {
    constructor(hours, minutes, seconds, milliseconds) {
        this.hours = hours || 0;
        this.minutes = minutes || 0;
        this.seconds = seconds || 0;
        this.milliseconds = milliseconds || 0;
    }

    /** @param {typeof import("firebase/app").default.firestore.Timestamp} timestampClass */
    toTimestamp(timestampClass) {
        return timestampClass.fromDate(this.toDate());
    }

    toDate() {
        return new Date(
            2021,
            0,
            1,
            this.hours,
            this.minutes,
            this.seconds,
            this.milliseconds
        );
    }

    subtract(other) {
        if (other.toDate) {
            return this.toDate() - other.toDate();
        }
        return null;
    }

    /** @param timestamp {firebase.firestore.Timestamp} */
    static fromTimestamp(timestamp) {
        const date = timestamp.toDate();
        return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }
}

export {
    PurchaseWindow,
    CurrentPurchaseWindow,
    Time,
}
