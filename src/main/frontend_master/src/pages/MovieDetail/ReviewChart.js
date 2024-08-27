// import React, { useEffect } from 'react';

// export default function ReviewChart(chartimg) {



//     // =================================================================
//     useEffect(() => {

//         const token = localStorage.getItem('accessToken');



//         if (token) {
//             fetchMovieChartImages();
//         }
//         // 컴포넌트가 언마운트될 때 실행될 cleanup 함수
//         return () => {
//             // 컴포넌트가 언마운트될 때 이미지 삭제 요청을 보냅니다.
//             const token = localStorage.getItem('accessToken');
//             if (token) {
//                 api.post(`/user/movies/${movieId}/delete-image`, {
//                     fileNames: [
//                         `age_chart_${movieId}.png`,
//                         `attraction_chart_${movieId}.png`,
//                         `emotion_chart_${movieId}.png`,
//                         `gender_chart_${movieId}.png`
//                     ]
//                 }, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 })
//                     .then(response => {
//                         console.log('Images deleted:', response.data);
//                     })
//                     .catch((error) => {
//                         console.error('Error deleting images:', error);
//                     });
//             }
//         }

//     })


//     // 차트 이미지 불러오기
//     const fetchMovieChartImages = async () => {
//         try {
//             const token = localStorage.getItem('accessToken');
//             if (!token) throw new Error("로그인 토큰이 없습니다.");

//             const chartTypes = ['gender', 'age', 'attraction', 'emotion'];
//             const requests = chartTypes.map(type =>
//                 api.get(`/user/movies/${movieId}/${type}-chart`, {
//                     responseType: 'arraybuffer',
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 }).then(response => {
//                     const blob = new Blob([response.data], { type: 'image/png' });
//                     const url = URL.createObjectURL(blob);
//                     return { type, url };
//                 })
//             );
//             const results = await Promise.all(requests);
//             const images = results.reduce((acc, { type, url }) => {
//                 acc[type] = url;
//                 return acc;
//             }, {});
//             setChartImages(images);
//         } catch (error) {
//             setError('차트 이미지를 불러오는 데 실패했습니다.');
//         }

//         return (
//             <>




//             </>
//         );
//     }