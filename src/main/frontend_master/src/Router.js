import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

//-----------------------------------------------------
//components
import Navs from './components/Nav/Navs';
import Footer from './components/Footer/Footer';

//Main
import Main from './pages/Main/Main';

//Search
import SearchKeyword from './pages/SearchKeyword/SearchKeyword';

//Login
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
import ChangePassword from './pages/Login/ChangePassword';
import FindIdPassword from './pages/Login/FindIdPassword';
import MyPage from "./pages/Login/Mypage/MyPage";

//Notice
import NoticeList from "./pages/Notice/NoticeList";
import NoticeView from "./pages/Notice/NoticeView";
import NoticeWrite from "./pages/Notice/NoticeWrite";
import MemberInfo from "./pages/Login/MemberInfo";

//Chart(보류)
import Chart from './pages/Chart/Chart';

//Movie
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Recommend from './pages/MovieDetail/Recommend';


//Admin
import AdminMovieList from './pages/Admin/AdminMovieList';
import AdminMovieUploadPage from "./pages/Admin/AdminMovieUploadPage";
import AdminMovieUploadModifyPage from "./pages/Admin/AdminMovieUploadModifyPage";
import AdminMovieUploadFilePage from './pages/Admin/AdminMovieUploadFilePage';
import AdminMovieUploadFileModifyPage from './pages/Admin/AdminMovieUploadFileModifyPage';
import AdminMemberList from './pages/Admin/AdminMemberList';
import AdminNoticeList from "./pages/Admin/AdminNoticeList";




//---------------------------Router
const Router = () => {
    return (<BrowserRouter>
            <Navs/>
        {/*Routes*/}
            <Routes>
                {/*메인*/}
                <Route index path="/" element={<Main/>}/>
                {/*<Route path="/users/login" element={<GoogleAPI />} />*/}

                {/*검색 결과*/}
                <Route path="/searchKeyword" element={<SearchKeyword/>}/>


                {/*로그인/회원가입*/}
                <Route path="/login" element={<Login/>}/>
                <Route path="/signUp" element={<SignUp/>}/>
                <Route path="/user/changePassword" element={<ChangePassword/>}/>
                <Route path="/findIdPassword" element={<FindIdPassword/>}/>
                {/*<Route path="/user/withdrawMember" element={<WithdrawMember/>}/>*/}


                {/*마이페이지 - 회원탈퇴/회원정보수정 */}
                <Route path='/user/mypage' element={<MyPage/>}/>
                <Route path='/user/memberinfo' element={<MemberInfo/>}/>


                {/*영화,추천*/}
                <Route path="/chart" element={<Chart/>}/>
                <Route path='/user/moviepage/:movieId' element={<MovieDetail/>}/>
                {/*<Route path='/chart/detail/:id' element={<MovieDetail/>}/>*/}
                <Route path="/user/recommend/:movieId" element={<Recommend/>}/>


                {/*공지사항*/}
                <Route path='/user/notice' element={<NoticeList/>}/>
                <Route path='/user/notice/:boardId' element={<NoticeView/>}/>
                <Route path='/admin/notice/write' element={<NoticeWrite/>}/>


                {/*관리자*/}
                {/*1.관리자- 공지사항 리스트*/}
                <Route path='/admin/AdminNoticeList' element={<AdminNoticeList/>}/>

                {/*2.관리자- 회원관리*/}
                <Route path="/admin/memberList" element={<AdminMemberList/>} />

                {/*3.관리자- *영화관리*/}
                <Route path="/admin/movieList" element={<AdminMovieList/>}/>

                {/*4.관리자- *영화관리 업로드 (css 필요)*/}
                <Route path="/admin/movieUpload" element={<AdminMovieUploadPage/>}/>

                {/*5.관리자- *영화관리 업로드/수정 (css 필요)*/}
                <Route path="/admin/movie/:movieId/modify" element={<AdminMovieUploadModifyPage/>}/>

                {/*6.관리자- 영화파일 업로드/수정 (css 필요)*/}
                <Route path="/admin/movieUploadFile" element={<AdminMovieUploadFilePage/>} />

                {/*7.관리자- 영화파일 업로드/수정 (css 필요)*/}
                <Route path="/admin/movie/:movieId/modify2" element={<AdminMovieUploadFileModifyPage/>} />


                {/*8.끝*/}
                <Route path="*" element={<div>찾으시는 창이 없네요</div>}/>
            </Routes>
        {/*/Routes*/}
            <Footer/>
        </BrowserRouter>);
};
export default Router;
