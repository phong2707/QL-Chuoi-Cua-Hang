// ...existing code...
import { Sidebar } from '../components/Sidebar';

const SIDEBAR_WIDTH = '260px';  

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <main style={{ 
        marginLeft: SIDEBAR_WIDTH, // Use the constant for margin to match sidebar width
        flex: 1, 
        padding: '30px' 
      }}>
        {children}
      </main>
    </div>
  );
};