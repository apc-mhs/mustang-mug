import Button from '$lib/components/input/Button.svelte';
import { render } from '@testing-library/svelte';

describe('Button', () => {
    it('renders correctly', () => {
        const tree = render(Button).container;
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly when disabled', () => {
        const tree = render(Button, {
            disabled: true
        }).container;
        expect(tree).toMatchSnapshot();
    });
});
