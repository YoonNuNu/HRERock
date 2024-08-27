import sys
import numpy as np
import os
import json
import logging
from sklearn.metrics.pairwise import cosine_similarity
from project_util import get_project_root

# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(message)s')

# 포인트기반 콘텐츠 필터링
def process_points_content_recommend(movie_points_ratios_df, user_points_ratios_df, mem_num, n=10):

    try:
        # logging.info(f"포인트 콘텐츠 기반 추천 시작: 사용자 {mem_num}")
        recommended_movies = []

        # 데이터프레임이 비어있지 않은지 확인
        if not user_points_ratios_df.empty and not movie_points_ratios_df.empty:
            # 사용자 시청 영화 집합
            user_watched_movies = set(user_points_ratios_df['movie_id'])

            # 시청하지 않은 영화 필터링
            unwatched_movies = movie_points_ratios_df[~movie_points_ratios_df['movie_id'].isin(user_watched_movies)]

            if not unwatched_movies.empty:
                # 사용자와 영화의 특성 벡터 생성
                user_features = user_points_ratios_df.drop(columns=['mem_num', 'movie_id'])
                movie_features = unwatched_movies.drop(columns=['movie_id'])

                # 공통 컬럼만 사용
                common_columns = list(set(user_features.columns) & set(movie_features.columns))
                user_features = user_features[common_columns]
                movie_features = movie_features[common_columns]

                # 사용자의 평균 포인트 계산
                user_avg_points = user_features.mean().values.reshape(1, -1)

                # 코사인 유사도 계산
                similarities = cosine_similarity(user_avg_points, movie_features)

                # 유사도 높은 순으로 정렬
                similar_indices = similarities[0].argsort()[::-1]

                # 상위 n개의 영화를 추천 리스트에 추가
                recommended_movies = unwatched_movies.iloc[similar_indices[:n]]['movie_id'].tolist()

        # JSON 파일로 저장
        project_root = get_project_root()
        json_dir = os.path.join(project_root, 'src', 'main', 'resources', 'static', 'json')
        os.makedirs(json_dir, exist_ok=True)

        file_path = os.path.join(json_dir, f'points_content_recommend_{mem_num}.json')

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"recommendations": recommended_movies}, f, ensure_ascii=False, indent=4)

        # logging.info(f"포인트 콘텐츠 기반 추천 완료: 사용자 {mem_num}")
        return recommended_movies

    except Exception as e:
        # 오류 발생 시, 빈 추천 결과와 오류 메시지를 JSON 파일로 저장
        project_root = get_project_root()
        json_dir = os.path.join(project_root, 'src', 'main', 'resources', 'static', 'json')
        os.makedirs(json_dir, exist_ok=True)
        file_path = os.path.join(json_dir, f'points_content_recommend_{mem_num}.json')

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"recommendations(Exception)": [], "error": str(e)}, f, ensure_ascii=False, indent=4)

        # logging.error(f"포인트 콘텐츠 기반 추천 오류: 사용자 {mem_num}, {str(e)}")
        return []
