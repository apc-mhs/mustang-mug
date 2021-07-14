import { Time } from '$lib/purchase/time';

const validTimes = [
    {
        pickUpTimeString: '4:00 AM',
        time: new Time(4),
    },
    {
        pickUpTimeString: '5:00 PM',
        time: new Time(17),
    },
    {
        pickUpTimeString: '10:00 PM',
        time: new Time(22),
    },
    {
        pickUpTimeString: '7:05 AM',
        time: new Time(7, 5),
    },
];

describe.each(validTimes)('A pick up time', ({ pickUpTimeString, time }) => {
    it(`which is represented by ${pickUpTimeString} should equal ${time.toString()}`, () => {
        const actualTime = Time.fromPickUpTimeString(pickUpTimeString);
        const actualTimeMillis = actualTime.toDate().getTime();
        expect(actualTimeMillis).toBe(time.toDate().getTime());
    });
});

const invalidTimes = [
    'eoiehdoe',
    '-1:05 AM',
    '43:100 AM',
    '16:00 AM',
];

describe.each(invalidTimes)('An invalid pick up time', (pickUpTimeString) => {
    it (`which is represented by ${pickUpTimeString} should error`, () => {
        const expectedErrorMessage = `Pick up time ${pickUpTimeString} failed to parse`;
        expect(() => Time.fromPickUpTimeString(pickUpTimeString)).toThrow(expectedErrorMessage);
    });
});
