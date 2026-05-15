import Sidebar from './Sidebar';

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {children}
      </div>
    </main>
  </div>
);

export default Layout;
