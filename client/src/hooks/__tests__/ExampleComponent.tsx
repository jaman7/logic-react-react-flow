import { useGlobalStore } from '@/store/useGlobalStore';

const ExampleComponent = () => {
  const { isSideBarOpen, isLoading, setIsSideBarOpen, setIsLoading } = useGlobalStore();

  return (
    <div>
      <button onClick={setIsSideBarOpen}>Toggle Sidebar</button>
      <button onClick={() => setIsLoading(true)}>Start Loading</button>
      <div data-testid="sidebar">{isSideBarOpen ? 'Sidebar is OPEN' : 'Sidebar is CLOSED'}</div>
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default ExampleComponent;
