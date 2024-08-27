import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
import json
import logging
from project_util import get_project_root

# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(message)s')

# 포인트 기반 협업 필터링
def process_points_collab_recommend(user_points_ratios_df, all_user_points_ratios_df, mem_num, n=10):
    try:
        # logging.info(f"포인트 협업 필터링 시작: 사용자 {mem_num}")
        # 현재 사용자의 데이터
        user_data = user_points_ratios_df[user_points_ratios_df['mem_num'] == mem_num]

        if user_data.empty:
            return []

        # 포인트 컬럼
        point_columns = ['directing_point', 'acting_point', 'visual_point', 'story_point', 'ost_point',
                         'immersion_point', 'reality_point', 'scary_point', 'stress_relief_point', 'tension_point']

        # 사용자별 평균 포인트 계산
        user_avg_points = user_data[point_columns].mean().values.reshape(1, -1)
        all_user_avg_points = all_user_points_ratios_df.groupby('mem_num')[point_columns].mean()

        # 유사도 계산
        similarities = cosine_similarity(user_avg_points, all_user_avg_points)

        # 유사한 사용자 10명 찾기 (자기 자신 제외)
        similar_users = all_user_avg_points.index[similarities.argsort()[0][::-1][1:11]]
        # logging.info(f"유사 사용자 수: {len(similar_users)}")

        # 유사한 사용자들의 영화 평점 가져오기
        similar_users_ratings = all_user_points_ratios_df[all_user_points_ratios_df['mem_num'].isin(similar_users)]

        # 현재 사용자가 보지 않은 영화 중 유사한 사용자들이 높은 평점을 준 영화 추천
        user_watched_movies = set(user_data['movie_id'])
        recommendations = similar_users_ratings[~similar_users_ratings['movie_id'].isin(user_watched_movies)]

        # 영화별 평균 평점 계산 및 정렬
        top_recommendations = recommendations.groupby('movie_id')[point_columns].mean().mean(axis=1).sort_values(ascending=False).head(n)

        recommended_movies = top_recommendations.index.tolist()

        # JSON 파일로 저장
        project_root = get_project_root()
        json_dir = os.path.join(project_root, 'src', 'main', 'resources', 'static', 'json')
        os.makedirs(json_dir, exist_ok=True)

        file_path = os.path.join(json_dir, f'points_collab_recommend_{mem_num}.json')

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"recommendations": recommended_movies}, f, ensure_ascii=False, indent=4)

        # logging.info(f"포인트 협업 필터링 완료: 사용자 {mem_num}")
        return recommended_movies

    except Exception as e:
        # 오류 발생 시 빈 추천 목록과 오류 메시지 저장
        project_root = get_project_root()
        json_dir = os.path.join(project_root, 'src', 'main', 'resources', 'static', 'json')
        os.makedirs(json_dir, exist_ok=True)
        file_path = os.path.join(json_dir, f'points_collab_recommend_{mem_num}.json')

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"recommendations(Exception)": [], "error": str(e)}, f, ensure_ascii=False, indent=4)

        # logging.error(f"포인트 협업 필터링 오류: 사용자 {mem_num}, {str(e)}")
        return []