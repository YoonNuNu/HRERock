import pandas as pd
from sqlalchemy import create_engine


def get_database_engine():
    engine = create_engine('mysql+pymysql://rock_developer:0000@localhost/rock_db')
    return engine


# 영화별 리뷰 성별 차트 데이터
def fetch_gender_data(movie_id):
    engine = get_database_engine()
    query = """
    SELECT m.mem_gender 
      FROM reviews r
      JOIN `member` m 
        ON r.mem_num = m.mem_num
     WHERE r.movie_id = %s;
    """
    gender_df = pd.read_sql_query(query, engine, params=(movie_id,))

    return gender_df


# 영화별 리뷰 나이대 차트 데이터
def fetch_age_data(movie_id):
    engine = get_database_engine()
    query = """
    SELECT m.mem_birth
      FROM reviews r
      JOIN `member` m
        ON r.mem_num = m.mem_num
     WHERE r.movie_id = %s;
    """

    age_df = pd.read_sql_query(query, engine, params=(movie_id,))

    return age_df


# 영화별 리뷰 매력 포인트 차트 데이터
def fetch_attraction_points_data(movie_id):
    engine = get_database_engine()
    query = """
    SELECT ap.*
      FROM reviews r
      JOIN review_attraction_points ap
        ON r.review_id = ap.review_id
     WHERE r.movie_id = %s;
    """

    attraction_points_df = pd.read_sql_query(query, engine, params=(movie_id,))

    return attraction_points_df

# 영화별 리뷰 감정 포인트 차트 데이터
def fetch_emotion_points_data(movie_id):
    engine = get_database_engine()
    query = """
    SELECT ep.*
      FROM reviews r
      JOIN review_emotion_points ep
        ON r.review_id = ep.review_id
     WHERE r.movie_id = %s;
    """

    emotion_points_df = pd.read_sql_query(query, engine, params=(movie_id,))

    return emotion_points_df


# 회원 영화 추천을 위한 누적 장르 차트 데이터(리뷰 기준)
def fetch_personal_genres_data(mem_num):
    engine = get_database_engine()
    query = """
    SELECT g.genre_id, g.genre_name
      FROM movie_genres mg
      JOIN reviews r
        ON mg.movie_id = r.movie_id
      JOIN genres g
        ON mg.genre_id = g.genre_id
     WHERE r.mem_num = %s;
    """

    personal_genre_df = pd.read_sql_query(query, engine, params=(mem_num,))

    return personal_genre_df

    # 회원 영화 추천을 위한 누적 매력 포인트 차트 데이터(리뷰 기준)


def fetch_personal_attraction_points_data(mem_num):
    engine = get_database_engine()
    query = """
    SELECT ap.*
      FROM review_attraction_points ap
      JOIN reviews r
        ON ap.review_id = r.review_id
     WHERE r.mem_num = %s;
    """

    personal_attraction_points_df = pd.read_sql_query(query, engine, params=(mem_num,))

    return personal_attraction_points_df


# 회원 영화 추천을 위한 누적 감정 포인트 차트 데이터(리뷰 기준)
def fetch_personal_emotion_points_data(mem_num):
    engine = get_database_engine()
    query = """
    SELECT ep.*
      FROM review_emotion_points ep
      JOIN reviews r
        ON ep.review_id = r.review_id
     WHERE r.mem_num = %s;
    """

    personal_emotion_points_df = pd.read_sql_query(query, engine, params=(mem_num,))

    return personal_emotion_points_df


# # 회원 영화 추천을 위한 누적 배우 차트 데이터(리뷰 기준)
def get_top_personal_actors(mem_num):
    engine = get_database_engine()
    query = """
    SELECT a.actor_name, p.photo_url, COUNT(*) as appearance_count
      FROM movie_actors ma  
      JOIN reviews r 
        ON r.movie_id = ma.movie_id 
      JOIN actors a 
        ON a.actor_id = ma.actor_id
      JOIN actors_photos ap 
        ON ap.actor_id = a.actor_id 
      JOIN photos p 
        ON p.photo_id = ap.photo_id
     WHERE r.mem_num = %s
     GROUP BY a.actor_id, a.actor_name, p.photo_url
     ORDER BY appearance_count DESC
     LIMIT 5;
    """

    personal_actors_df = pd.read_sql_query(query, engine, params=(mem_num,))

    return personal_actors_df


# # 회원 영화 추천을 위한 누적 감독 차트 데이터(리뷰 기준)
def get_top_personal_directors(mem_num):
    engine = get_database_engine()
    query = """
    SELECT d.director_name, p.photo_url, COUNT(*) as appearance_count 
      FROM movie_directors md  
      JOIN reviews r 
        ON r.movie_id = md.movie_id 
      JOIN directors d  
        ON d.director_id  = md.director_id 
      JOIN directors_photos dp 
        ON dp.director_id = d.director_id 
      JOIN photos p 
        ON p.photo_id = dp.photo_id
     WHERE r.mem_num = %s
     GROUP BY d.director_id, d.director_name, p.photo_url
     ORDER BY appearance_count DESC
     LIMIT 5;
    """

    personal_directors_df = pd.read_sql_query(query, engine, params=(mem_num,))

    return personal_directors_df
