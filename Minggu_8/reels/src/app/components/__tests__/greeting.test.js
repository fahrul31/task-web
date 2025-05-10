import { render, screen } from '@testing-library/react';
import Greeting from '../Greeting';

describe('Greeting Component', () => {
    it('renders the greeting message', () => {
        render(<Greeting name="John" />);
        expect(screen.getByText('Hello, John!')).toBeInTheDocument();
    });
});
