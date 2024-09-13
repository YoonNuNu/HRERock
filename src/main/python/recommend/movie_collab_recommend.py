import pandas as pd
import os
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from project_util import get_project_root

def calculate_similarity(user1, user2):
    # 공통 영화 찾기
    common_movies = set(user1['movie_id']) & set(user2['movie_id'])

    if not common_movies:
        return 0  # 공통 영화가 없으면 유사도 0

    # 공통 영화에 대한 평점만 추출
    user1_ratings = np.array([user1['review_rating'][list(user1['movie_id']).index(movie)] for movie in common_movies])
    user2_ratings = np.array([user2['review_rating'][list(user2['movie_id']).index(movie)] for movie in common_movies])

    rating_sim = cosine_similarity(user1_ratings.reshape(1, -1), user2_ratings.reshape(1, -1))[0][0]

    actor_sim = len(set(user1['actor_id']) & set(user2['actor_id'])) / len(set(user1['actor_id']) | set(user2['actor_id']))
    director_sim = len(set(user1['director_id']) & set(user2['director_id'])) / len(set(user1['director_id']) | set(user2['director_id']))
    genre_sim = len(set(user1['genre_id']) & set(user2['genre_id'])) / len(set(user1['genre_id']) | set(user2['genre_id']))

    return (rating_sim + actor_sim + director_sim + genre_sim) / 4

def process_movie_collab_recommend(user_movie_df, all_users_movie_df, mem_num, n=10):
    try:
        if user_movie_df.empty or all_users_movie_df.empty:
            return []

        target_user = user_movie_df.groupby('mem_num').agg({
            'movie_id': list,
            'actor_id': set,
            'director_id': set,
            'genre_id': set,
            'review_rating': list
        }).loc[mem_num]

        user_similarities = []
        for other_mem_num, other_user in all_users_movie_df.groupby('mem_num'):
            if other_mem_num == mem_num:
                continue
            other_user_agg = other_user.agg({
                'movie_id': list,
                'actor_id': set,
                'director_id': set,
                'genre_id': set,
                'review_rating': list
            })
            similarity = calculate_similarity(target_user, other_user_agg)
            user_similarities.append((other_mem_num, similarity))

        user_similarities.sort(key=lambda x: x[1], reverse=True)
        similar_users = user_similarities[:10]  # 상위 10명의 유사 사용자

        recommendations = {}
        for similar_user, similarity in similar_users:
            similar_user_movies = set(all_users_movie_df[all_users_movie_df['mem_num'] == similar_user]['movie_id'])
            unwatched_movies = similar_user_movies - set(user_movie_df['movie_id'])

            for movie_id in unwatched_movies:
                if movie_id not in recommendations:
                    recommendations[movie_id] = 0
                movie_rating = all_users_movie_df[(all_users_movie_df['mem_num'] == similar_user) &
                                                  (all_users_movie_df['movie_id'] == movie_id)]['review_rating'].values[0]
                recommendations[movie_id] += similarity * movie_rating

        recommended_movies = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:n]
        recommended_movie_ids = [movie[0] for movie in recommended_movies]

        project_root = get_project_root()
        json_dir = os.path.join(project_root, 'src', 'main', 'resources', 'static', 'json')
        os.makedirs(json_dir, exist_ok=True)

        file_path = os.path.join(json_dir, f'movie_collab_recommend_{mem_num}.json')

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"recommendations": recommended_movie_ids}, f, ensure_ascii=False, indent=4)

        return recommended_movie_ids

    except Exception as e:
        # import traceback
        # traceback.print_exc()
        project_root = get_project_root()
        json_dir = os.path.join(project_root, 'src', 'main', 'resources', 'static', 'json')
        os.makedirs(json_dir, exist_ok=True)
        file_path = os.path.join(json_dir, f'movie_collab_recommend_{mem_num}.json')

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"recommendations(Exception)": [], "error": str(e)}, f, ensure_ascii=False, indent=4)

        return []