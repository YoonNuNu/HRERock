import pandas as pd
from sqlalchemy import create_engine

def get_database_engine():
    return create_engine('mysql+pymysql://rock_developer:0000@localhost/rock_db')

def execute_query(query, params=None):
    engine = get_database_engine()
    df = pd.read_sql_query(query, engine, params=params)
    df.fillna(0, inplace=True)
    return df

def get_user_movie_data(mem_num):
    query = """
    SELECT r.mem_num, m.movie_id, r.review_rating, a.actor_id, d.director_id, g.genre_id
    FROM reviews r
    JOIN movies m ON r.movie_id = m.movie_id
    JOIN movie_actors ma ON ma.movie_id = m.movie_id
    JOIN actors a ON a.actor_id = ma.actor_id
    JOIN movie_directors md ON md.movie_id = m.movie_id
    JOIN directors d ON d.director_id = md.director_id
    JOIN movie_genres mg ON mg.movie_id = m.movie_id
    JOIN genres g ON g.genre_id = mg.genre_id
    WHERE r.mem_num = %s;
    """
    return execute_query(query, (mem_num,))

def get_all_user_movie_data(mem_num):
    query = """
    SELECT r.mem_num, m.movie_id, r.review_rating, a.actor_id, d.director_id, g.genre_id
      FROM reviews r
      JOIN movies m ON r.movie_id = m.movie_id
      JOIN movie_actors ma ON ma.movie_id = m.movie_id
      JOIN actors a ON a.actor_id = ma.actor_id
      JOIN movie_directors md ON md.movie_id = m.movie_id
      JOIN directors d ON d.director_id = md.director_id
      JOIN movie_genres mg ON mg.movie_id = m.movie_id
      JOIN genres g ON g.genre_id = mg.genre_id
     WHERE r.mem_num != %s;
    """
    return execute_query(query, (mem_num,))

def get_user_points_ratios_data(mem_num):
    query = """
    SELECT r.mem_num, r.movie_id,
           AVG(ap.directing_point) as directing_point,
           AVG(ap.acting_point) as acting_point,
           AVG(ap.visual_point) as visual_point,
           AVG(ap.story_point) as story_point,
           AVG(ap.ost_point) as ost_point,
           AVG(ep.immersion_point) as immersion_point,
           AVG(ep.reality_point) as reality_point,
           AVG(ep.scary_point) as scary_point,
           AVG(ep.stress_relief_point) as stress_relief_point,
           AVG(ep.tension_point) as tension_point
      FROM reviews r 
      JOIN review_attraction_points ap ON ap.review_id = r.review_id 
      JOIN review_emotion_points ep ON ep.review_id = r.review_id 
     WHERE r.mem_num = %s
  GROUP BY r.mem_num, r.movie_id;
    """
    return execute_query(query, (mem_num,))

def get_all_user_points_ratios_data(mem_num):
    query = """
    SELECT r.mem_num, r.movie_id,
           AVG(ap.directing_point) as directing_point,
           AVG(ap.acting_point) as acting_point,
           AVG(ap.visual_point) as visual_point,
           AVG(ap.story_point) as story_point,
           AVG(ap.ost_point) as ost_point,
           AVG(ep.immersion_point) as immersion_point,
           AVG(ep.reality_point) as reality_point,
           AVG(ep.scary_point) as scary_point,
           AVG(ep.stress_relief_point) as stress_relief_point,
           AVG(ep.tension_point) as tension_point
      FROM reviews r 
      JOIN review_attraction_points ap ON ap.review_id = r.review_id 
      JOIN review_emotion_points ep ON ep.review_id = r.review_id 
     WHERE r.mem_num != %s
  GROUP BY r.mem_num, r.movie_id;
    """
    return execute_query(query, (mem_num,))

def get_movies_points_ratios_data():
    query = """
    SELECT m.movie_id,
           AVG(ap.directing_point) as directing_point,
           AVG(ap.acting_point) as acting_point,
           AVG(ap.visual_point) as visual_point,
           AVG(ap.story_point) as story_point,
           AVG(ap.ost_point) as ost_point,
           AVG(ep.immersion_point) as immersion_point,
           AVG(ep.reality_point) as reality_point,
           AVG(ep.scary_point) as scary_point,
           AVG(ep.stress_relief_point) as stress_relief_point,
           AVG(ep.tension_point) as tension_point
      FROM movies m
      JOIN reviews r ON m.movie_id = r.movie_id
      JOIN review_attraction_points ap ON ap.review_id = r.review_id
      JOIN review_emotion_points ep ON ep.review_id = r.review_id
  GROUP BY m.movie_id;
    """
    return execute_query(query)

def get_movie_details(movie_ids):
    if not movie_ids:
        return pd.DataFrame(columns=['movie_id', 'movie_title', 'main_poster'])
    placeholders = ','.join(['%s'] * len(movie_ids))
    query = f"""
       SELECT m.movie_id, m.movie_title, p.poster_url as main_poster
         FROM movies m
    LEFT JOIN movie_posters mp ON m.movie_id = mp.movie_id
    LEFT JOIN posters p ON mp.poster_id = p.poster_id AND p.main_poster = true
        WHERE m.movie_id IN ({placeholders})
    """
    return execute_query(query, tuple(movie_ids))