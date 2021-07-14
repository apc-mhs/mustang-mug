<script>
import { Time } from '$lib/purchase/time';

import Input from './Input.svelte';

export let time;
export let placeholder = '';
export let label = '';
export let pattern = /(\d{1,2}):(\d{2}) (AM|PM)/;

let timeComponents = {
    hour: time.hours % 12,
    minute: time.minutes,
    period: time.hours >= 12 ? 'PM' : 'AM',
    formatter: new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }),
    toTime() {
        return new Time(
            this.hour + (this.period === 'PM' ? 12 : 0),
            this.minute
        );
    },
    toString() {
        return this.formatter.format(this.toTime().toDate());
    },
    empty() {
        return {
            ...this,
            hour: undefined,
            minute: undefined,
            period: undefined,
        };
    },
};

let input;
let rawValue = timeComponents.toString();

$: if (rawValue) {
    makeTimeComponents(rawValue);
}

$: time = timeComponents.toTime();

function makeTimeComponents(rawValue) {
    const match = rawValue.match(pattern);
    if (!match) {
        return;
    }

    const [_, hour, minute, period] = match;
    timeComponents = {
        ...timeComponents,
        hour: parseInt(hour) % 12,
        minute: parseInt(minute),
        period,
    };
}

function handleKeydown(e) {
    if (e.key !== 'Tab') {
        return;
    }
    e.preventDefault();
    
    const match = rawValue.match(pattern);
    if (!match) {
        return;
    }

    const cursorPosition = e.target.selectionStart;
    const [_, ...matches] = match;
    let lastMatchIndex = 0;
    for (let match of matches) {
        const matchIndex = rawValue.indexOf(match, lastMatchIndex);
        if (matchIndex > cursorPosition) {
            e.target.setSelectionRange(matchIndex, matchIndex + match.length);
            return;
        }
        lastMatchIndex = matchIndex;
    }

    e.target.setSelectionRange(rawValue.indexOf(matches[0]), matches[0].length);
}

function handleFocus(e) {
    if (!input) {
        return;
    }

    const colonIndex = rawValue.indexOf(':');
    input.setSelectionRange(0, colonIndex);
}
</script>

<Input
    type="text"
    pattern={pattern.source}
    {placeholder}
    {label}
    bind:input={input}
    bind:value={rawValue}
    on:focus={handleFocus}
    on:keydown={handleKeydown} />
