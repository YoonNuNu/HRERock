import React from 'react';
import Navs from './components/Nav/Navs'; // 네비게이션 바 임포트
import Footer from './components/Footer/Footer'; // 푸터 임포트

const Layout = ({ children }) => {
    return (
        <div>
            <Navs />
            {children}  {/* 페이지 별로 다른 내용이 렌더링 되는 부분 */}
            {/*<Footer />*/}
        </div>
    );
};

export default Layout;