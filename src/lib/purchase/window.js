import { Time } from "./time";

class PurchaseWindow {
    constructor(dayOfWeek, start, end, maxOrders, lastModified) {
        this.dayOfWeek = dayOfWeek;
        this.start = start;
        this.end = end;
        this.maxOrders = maxOrders;
        this.lastModified = lastModified || new Date();
    }

    get current() {
        const now = Time.now().toDate();
        return this.start.toDate() <= now && now <= this.end.toDate() && this.dayOfWeek === new Date().getDay();
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
                    maxOrders: purchaseWindow.maxOrders,
                    lastModified: timestampClass.fromDate(purchaseWindow.lastModified),
                };
            },
            fromFirestore: function (snapshot, options) {
                const data = snapshot.data(options);
                return new PurchaseWindow(data.dayOfWeek, Time.fromTimestamp(data.start), Time.fromTimestamp(data.end), data.maxOrders, data.lastModified.toDate());
            }
        };
    }
}

class CurrentPurchaseWindow extends PurchaseWindow {
    constructor(dayOfWeek, start, end, maxOrders, orders, lastModified) {
        super(dayOfWeek, start, end, maxOrders, lastModified);
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
                return new CurrentPurchaseWindow(data.dayOfWeek, Time.fromTimestamp(data.start), Time.fromTimestamp(data.end), data.maxOrders, data.orders, data.lastModified.toDate());
            }
        };
    }
}

export {
    PurchaseWindow,
    CurrentPurchaseWindow,
}
