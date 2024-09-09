import axios from "axios";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CharmingGraph = ({ movieId, updateTrigger }) => {
    const [error, setError] = useState(null);
    const [chartImages, setChartImages] = useState({
        gender: null,
        age: null,
        attraction: null,
        emotion: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchMovieChartImages();
            } catch (e) {
                setError('차트 이미지를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                axios.post(`/user/movies/${movieId}/delete-image`, {
                    fileNames: [
                        `age_chart_${movieId}.webp`,
                        `attraction_chart_${movieId}.webp`,
                        `emotion_chart_${movieId}.webp`,
                        `gender_chart_${movieId}.webp`
                    ]
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(response => {
                        console.log('Images deleted:', response.data);
                    })
                    .catch(error => {
                        console.error('Error deleting images:', error);
                    });
            }
        };
    }, [movieId, updateTrigger]);

    const fetchMovieChartImages = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error("로그인 토큰이 없습니다.");

        const chartTypes = ['gender', 'age', 'attraction', 'emotion'];

        const requests = chartTypes.map(type =>
            axios.get(`/user/movies/${movieId}/${type}-chart`, {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }).then(response => {
                if (response.status === 404) {
                    throw new Error(`차트 데이터(${type})를 찾을 수 없습니다.`);
                }
                console.log(`Received data for ${type}:`, response.data);
                const blob = new Blob([response.data], { type: 'image/webp' });
                const url = URL.createObjectURL(blob);
                console.log(`Generated URL for ${type}:`, url);
                return { type, url };
            }).catch(error => {
                console.error(`Error fetching ${type} chart:`, error.message);
                throw error; // 에러를 상위로 전달하여 로딩 상태 업데이트
            })
        );

        try {
            const results = await Promise.all(requests);
            const images = results.reduce((acc, { type, url }) => {
                acc[type] = url;
                return acc;
            }, {});
            setChartImages(images);
        } catch (error) {
            console.error('Error in fetchMovieChartImages:', error.message);
            setError('차트 이미지를 불러오는 데 실패했습니다.');
        }
    };

    const graphIndex = ["‍🧑 성별 분포", "🎓 연령별 분포", "❤️ 매력 포인트", "😳 감정 포인트"];

    return (
        <GraphContainer>
            {loading ? (
                <LoadingMessage>로딩 중...</LoadingMessage>
            ) : (
                <>
                    {Object.keys(chartImages).map((type, idx) => (
                        chartImages[type] ? (
                            <ScoreGraph key={type}>
                                <GraphTitle>{graphIndex[idx]}</GraphTitle>
                                <GraphImage>
                                    <ChartDiv>
                                        <ReviewChartImg src={chartImages[type]} alt={`${graphIndex[idx]} 차트`} />
                                    </ChartDiv>
                                </GraphImage>
                            </ScoreGraph>
                        ) : null
                    ))}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </>
            )}
        </GraphContainer>
    );
};

// Style components
//로딩 문구
const LoadingMessage = styled.div`
    font-size: 20px;
    text-align: center;
    color: #000;
    font-weight: 600;
    padding: 20px;
    margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
    font-size: 20px;
    text-align: center;
    color: red;
    font-weight: 600;
    padding: 20px;
`;

const GraphTitle = styled.div`
    font-size: 20px;
    text-align: center;
    color: #000;
    font-weight: 600;
    display: flex;
    justify-content: center;
    border-bottom: 5px solid #f4f4f4;
    margin: 0 auto;
    padding-top: 10px;
    margin-bottom: 25px;
    padding-bottom: 12px;
`;

const GraphImage = styled.div`
    display: flex;
`;

const ScoreGraph = styled.div`
    height: 400px;
    margin-right: 10px;
`;

const GraphContainer = styled.div`
    display: flex;
    justify-content: space-around;
`;

const ReviewChartImg = styled.img`
    width: 280px;
`;

const ChartDiv = styled.div`
    width: 100%;
`;

export default CharmingGraph;
