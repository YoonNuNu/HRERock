import sys
import json
import pandas as pd
import logging

from recommend.points_content_recommend import process_points_content_recommend
from recommend.movie_collab_recommend import process_movie_collab_recommend
from recommend.points_collab_recommend import process_points_collab_recommend
from data.recommend_processor import (
    get_movies_points_ratios_data,
    get_user_points_ratios_data,
    get_all_user_points_ratios_data,
    get_user_movie_data,
    get_all_user_movie_data,
    # get_user_points_data,
    # get_all_user_points_data,
    get_movie_details
)

def generate_recommendations(mem_num, n=10):
    try:
        # logging.info(f"Generating recommendations for user {mem_num}")

        # 데이터 불러오기
        movie_points_ratios_df = get_movies_points_ratios_data()
        user_points_ratios_df = get_user_points_ratios_data(mem_num)
        all_user_points_ratios_df = get_all_user_points_ratios_data(mem_num)
        user_movie_df = get_user_movie_data(mem_num)
        all_users_movie_df = get_all_user_movie_data(mem_num)

        # logging.info(f"user_points_ratios_df: {user_points_ratios_df}")
        # logging.info(f"all_user_points_ratios_df: {all_user_points_ratios_df}")


        # 추천 ID 생성
        points_content_ids = process_points_content_recommend(movie_points_ratios_df, user_points_ratios_df, mem_num, n)
        movie_collab_ids = process_movie_collab_recommend(user_movie_df, all_users_movie_df, mem_num, n)
        # points_collab_ids = process_points_collab_recommend(user_points_data, all_users_points_data, mem_num, n)
        points_collab_ids = process_points_collab_recommend(user_points_ratios_df, all_user_points_ratios_df, mem_num, n)

        # 영화 세부사항 불러오기
        points_content = get_movie_details(points_content_ids).to_dict('records')
        movie_collab = get_movie_details(movie_collab_ids).to_dict('records')
        points_collab = get_movie_details(points_collab_ids).to_dict('records')

        # JSON 응답 생성
        response = {
            "points_content_recommendations": points_content,
            "movie_collab_recommendations": movie_collab,
            "points_collab_recommendations": points_collab
        }
        return json.dumps(response, ensure_ascii=False, indent=2)  # JSON 포맷팅
    except Exception as e:
        logging.error(f"Error in generate_recommendations: {str(e)}")
        return json.dumps({"error": str(e)}, ensure_ascii=False)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python <script_name> <mem_num>"}))
        sys.exit(1)

    try:
        mem_num = int(sys.argv[1])
        recommendations = generate_recommendations(mem_num)
        print(recommendations)
    except ValueError:
        print(json.dumps({"error": "제공된 회원 번호는 정수여야 합니다."}))
        sys.exit(1)
# import sys
# import json
# import pandas as pd
# import logging
#
# from recommend.points_recommend import process_points_recommend
# from recommend.movie_collab_recommend import process_movie_collab_recommend
# from recommend.points_collab_recommend import process_points_collab_recommend
# from data.recommend_processor import (
#     get_movies_points_ratios_data,
#     get_user_points_ratios_data,
#     get_user_movie_data,
#     get_all_user_movie_data,
#     get_user_points_data,
#     get_all_user_points_data,
#     get_movie_details
# )
#
# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
#
# def generate_recommendations(mem_num, n=10):
#     try:
#         mem_num = str(mem_num)
#         logging.info(f"Generating recommendations for user {mem_num}")
#
#         # 데이터 불러오기
#         movie_points_ratios_df = get_movies_points_ratios_data()
#         user_points_ratios_df = get_user_points_ratios_data(mem_num)
#         user_data = get_user_movie_data(mem_num)
#         all_users_data = get_all_user_movie_data(mem_num)
#         user_points_data = get_user_points_data(mem_num)
#         all_users_points_data = get_all_user_points_data(mem_num)
#
#         # 추천 ID 생성
#         logging.info("Starting points_recommend")
#         points_content_ids = process_points_recommend(movie_points_ratios_df, user_points_ratios_df, mem_num, n)
#         logging.info("Completed points_recommend")
#
#         logging.info("Starting movie_collab_recommend")
#         movie_collab_ids = process_movie_collab_recommend(user_data, all_users_data, mem_num, n)
#         logging.info("Completed movie_collab_recommend")
#
#         logging.info("Starting points_collab_recommend")
#         points_collab_ids = process_points_collab_recommend(user_points_data, all_users_points_data, mem_num, n)
#         logging.info("Completed points_collab_recommend")
#
#         # 영화 세부사항 불러오기
#         points_content = get_movie_details(points_content_ids).to_dict('records')
#         movie_collab = get_movie_details(movie_collab_ids).to_dict('records')
#         points_collab = get_movie_details(points_collab_ids).to_dict('records')
#
#         # JSON 응답 생성
#         response = {
#             "points_content_recommendations": points_content,
#             "movie_collab_recommendations": movie_collab,
#             "points_collab_recommendations": points_collab
#         }
#         return json.dumps(response, ensure_ascii=False, indent=2)  # JSON 포맷팅
#     except Exception as e:
#         logging.error(f"Error in generate_recommendations: {str(e)}")
#         return json.dumps({"error": str(e)}, ensure_ascii=False)
#
# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         print(json.dumps({"error": "Usage: python <script_name> <mem_num>"}))
#         sys.exit(1)
#
#     try:
#         mem_num = int(sys.argv[1])
#         recommendations = generate_recommendations(mem_num)
#         print(recommendations)
#     except ValueError:
#         print(json.dumps({"error": "제공된 회원 번호는 정수여야 합니다."}))
#         sys.exit(1)