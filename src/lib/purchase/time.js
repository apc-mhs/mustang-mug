import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

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

    toString() {
        return `${this.hours}:${this.minutes}:${this.seconds}.${this.milliseconds}`;
    }

    subtract(other) {
        if (other.toDate) {
            return this.toDate() - other.toDate();
        }
        return null;
    }

    /** @param timestamp {firebase.firestore.Timestamp} */
    static fromTimestamp(timestamp) {
        return Time.fromDate(timestamp.toDate());
    }

    /** @param date {Date} */
    static fromDate(date) {
        return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

    /** @param pickUpTime {string} */
    static fromPickUpTimeString(pickUpTime) {
        const parsedTime = dayjs(pickUpTime, 'h:mm A', true);
        if (!parsedTime.isValid()) {
            throw new Error('Pick up time failed to parse', pickUpTime);
        }
        return Time.fromDate(parsedTime.toDate());
    }
}

export {
    Time
};

