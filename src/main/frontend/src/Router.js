// Router.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout'; // Layout 컴포넌트 임포트
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
// import GoogleAPI from './pages/Login//users/login';
// import WithdrawMember from './pages/Login/WithdrawMember';

import ChangePassword from './pages/Login/ChangePassword';
import FindIdPassword from './pages/Login/FindIdPassword';

import NoticeList from "./pages/Notice/NoticeList";
import NoticeView from "./pages/Notice/NoticeView";
import NoticeWrite from "./pages/Notice/NoticeWrite";
import MemberInfo from "./pages/Login/MemberInfo";
import Mypage from "./pages/Login/Mypage/MyPage";
import MovieSearch from './pages/SearchKeyword/MovieSearch';

import AdminMovieList from './pages/Admin/AdminMovieList';
import AdminNoticeListPage from './pages/Admin/AdminNoticeListPage';
import AdminMemberListPage from './pages/Admin/AdminMemberListPage';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import MoviePlay from './pages/MovieDetail/MoviePlay';
import AdminMovieUploadModifyPage from './pages/Admin/AdminMovieUploadModifyPage';
import AdminMovieUploadFileModifyPage from './pages/Admin/AdminMovieUploadFileModifyPage';
import AdminMovieUploadFilePage from './pages/Admin/AdminMovieUploadFilePage';
import AdminMovieUploadPage from './pages/Admin/AdminMovieUploadPage';
import Recommend from './pages/MovieDetail/Recommend';
import NoPage from './pages/NoPage';
import Footer from './components/Footer/Footer';
import AdminNoticeEdit from './pages/Admin/AdminNoticeEdit';


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 로그인/회원가입 페이지 (네비게이션 바 없음) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/findIdPassword" element={<FindIdPassword />} />

                {/* 네비게이션 바가 포함된 페이지 */}
                <Route path="/" element={<Layout><Main /></Layout>} />
                {/* 나머지 경로에 대해서도 동일하게 설정 */}

                <Route path="/user/MovieSearch" element={<Layout><MovieSearch /></Layout>} />
                <Route path="/user/ChangePassword" element={<Layout><ChangePassword /></Layout>} />
                <Route path='/user/Mypage' element={<Layout><Mypage /></Layout>} />
                <Route path='/user/Memberinfo' element={<Layout><MemberInfo /></Layout>} />
                <Route path="/user/Recommend" element={<Layout><Recommend /></Layout>} />
                <Route path='/user/moviepage/:movieId' element={<Layout><MovieDetail /></Layout>} />
                <Route path="/user/movieplay/:movieId" element={<Layout><MoviePlay /></Layout>} />
                <Route path='/user/boardList' element={<Layout><NoticeList /></Layout>} />
                <Route path='/user/boardList/:boardId' element={<Layout><NoticeView /></Layout>} />
                <Route path='/admin/boardList/write' element={<Layout><NoticeWrite /></Layout>} />
                <Route path="/admin/MovieList" element={<Layout><AdminMovieList /></Layout>} />
                <Route path="/admin/MovieUpload" element={<Layout><AdminMovieUploadPage /></Layout>} />
                <Route path="/admin/Movie/:movieId/modify" element={<Layout><AdminMovieUploadModifyPage /></Layout>} />
                <Route path="/admin/MovieUploadFile" element={<Layout><AdminMovieUploadFilePage /></Layout>} />
                <Route path="/admin/Movie/:movieId/modify2" element={<Layout><AdminMovieUploadFileModifyPage /></Layout>} />
                <Route path="/admin/MemberList" element={<Layout><AdminMemberListPage /></Layout>} />
                <Route path="/admin/boardList" element={<Layout><AdminNoticeListPage /></Layout>} />
                <Route path="/admin/boardList/:boardId" element={<Layout><AdminNoticeEdit /></Layout>} />
                {/* 404 페이지 */}
                <Route path="*" element={<Layout><NoPage /></Layout>} /></Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default Router;

