import pandas as pd
import os
import json
import logging
import numpy as np
import traceback
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity
from project_util import get_project_root

# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(message)s')

# 벡터 생성
def create_movie_feature_vectors(movie_df):
    # 중복 영화 ID 제거
    movie_df = movie_df.drop_duplicates(subset=['movie_id'])

    # 빈 데이터프레임 생성(고유 영화 ID)
    feature_df = pd.DataFrame(index=movie_df['movie_id'].unique())

    # 장르 원핫 인코더
    genre_encoder = OneHotEncoder(sparse_output=False)
    genre_features = genre_encoder.fit_transform(movie_df[['genre_id']])
    genre_df = pd.DataFrame(genre_features, index=movie_df['movie_id'].values, columns=genre_encoder.get_feature_names_out(['genre_id']))
    feature_df = pd.concat([feature_df, genre_df], axis=1)

    # 배우 원핫 인코더
    actor_encoder = OneHotEncoder(sparse_output=False)
    actor_features = actor_encoder.fit_transform(movie_df[['actor_id']])
    actor_df = pd.DataFrame(actor_features, index=movie_df['movie_id'].values, columns=actor_encoder.get_feature_names_out(['actor_id']))
    feature_df = pd.concat([feature_df, actor_df], axis=1)

    # 감독 원핫 인코더
    director_encoder = OneHotEncoder(sparse_output=False)
    director_features = director_encoder.fit_transform(movie_df[['director_id']])
    director_df = pd.DataFrame(director_features, index=movie_df['movie_id'].values, columns=director_encoder.get_feature_names_out(['director_id']))
    feature_df = pd.concat([feature_df, director_df], axis=1)

    return feature_df

# 영화정보 기반 협업 필터링
def process_movie_collab_recommend(user_movie_df, all_users_movie_df, mem_num, n=10):
    try:
        # logging.info(f"영화 협업 필터링 시작: 사용자 {mem_num}")
        # 데이터 타입 변환
        user_movie_df['movie_id'] = user_movie_df['movie_id'].astype(np.int64)
        all_users_movie_df['movie_id'] = all_users_movie_df['movie_id'].astype(np.int64)

        recommended_movies = []

        if not user_movie_df.empty and not all_users_movie_df.empty:
            # 영화 특성 벡터 생성
            all_movies_features = create_movie_feature_vectors(all_users_movie_df)

            # 사용자-영화 평점 피벗 테이블 생성
            user_movie_ratings = all_users_movie_df.pivot_table(
                values='review_rating',
                index='mem_num',
                columns='movie_id',
                fill_value=0
            )
            user_movie_ratings.index = user_movie_ratings.index.astype(str)

            if mem_num in user_movie_ratings.index:
                # 사용자 유사도 계산
                user_similarity = cosine_similarity(user_movie_ratings)

                current_user_index = user_movie_ratings.index.get_loc(mem_num)
                similar_users = user_similarity[current_user_index].argsort()[::-1][1:11]  # 상위 10명의 유사 사용자
                # logging.info(f"유사 사용자 수: {len(similar_users)}")

                # 추천 초기화
                recommendations = pd.Series(dtype=float)
                for i in similar_users:
                    similar_user_ratings = user_movie_ratings.iloc[i]
                    unwatched_movies = similar_user_ratings[~similar_user_ratings.index.isin(user_movie_df['movie_id'].astype(str))]

                    # 영화 특성 기반 점수 추가
                    for movie_id in unwatched_movies.index:
                        movie_features = all_movies_features.loc[movie_id]
                        score = movie_features.dot(user_movie_ratings.loc[mem_num])
                        recommendations.loc[movie_id] = score

                # 상위 n개 영화 선택
                recommended_movies = recommendations.nlargest(n).index.tolist()

        # 결과를 JSON 파일로 저장
        project_root = get_project_root()
        json_dir = os.path.join(project_root, 'src', 'main', 'resources', 'static', 'json')
        os.makedirs(json_dir, exist_ok=True)

        file_path = os.path.join(json_dir, f'movie_collab_recommend_{mem_num}.json')

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"recommendations": recommended_movies}, f, ensure_ascii=False, indent=4)

        # logging.info(f"영화 협업 필터링 완료: 사용자 {mem_num}")
        return recommended_movies

    except Exception as e:
        # 오류 발생 시 빈 추천 목록과 오류 메시지 저장
        project_root = get_project_root()
        json_dir = os.path.join(project_root, 'src', 'main', 'resources', 'static', 'json')
        os.makedirs(json_dir, exist_ok=True)
        file_path = os.path.join(json_dir, f'movie_collab_recommend_{mem_num}.json')

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"recommendations(Exception)": [], "error": str(e)}, f, ensure_ascii=False, indent=4)

        # logging.error(f"영화 협업 필터링 오류: 사용자 {mem_num}, {str(e)}")
        return []
