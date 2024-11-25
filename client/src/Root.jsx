import { Outlet } from 'react-router-dom';
import Navbar from './widgets/Navbar/Navbar';

export default function Root({ user, setUser }) {
  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div style={{ marginTop: '70px' }}>
        <Outlet />
      </div>
    </>
  );
}
