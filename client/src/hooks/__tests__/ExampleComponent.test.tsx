import { render, fireEvent, screen } from '@testing-library/react';

import { useGlobalStore } from '@/store/useGlobalStore';
import ExampleComponent from './ExampleComponent';

describe('ExampleComponent with useGlobalStore', () => {
  beforeEach(() => {
    // Reset Zustand state before each test
    useGlobalStore.setState({
      isSideBarOpen: false,
      isLoading: false,
      dictionary: {},
    });
  });

  it('should toggle sidebar state on button click', () => {
    render(<ExampleComponent />);

    expect(screen.getByTestId('sidebar')).toHaveTextContent('Sidebar is CLOSED');

    fireEvent.click(screen.getByText('Toggle Sidebar'));

    expect(screen.getByTestId('sidebar')).toHaveTextContent('Sidebar is OPEN');
  });

  it('should show loading indicator when loading is set', () => {
    render(<ExampleComponent />);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Start Loading'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
