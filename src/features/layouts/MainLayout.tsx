import { Outlet } from 'react-router-dom';
import { MainContainer } from '../ui/MainContainer';
import Navbar from '../navbar/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <MainContainer>
        <Outlet />
      </MainContainer>
    </>
  );
};

export default MainLayout;
