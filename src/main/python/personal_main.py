import sys

from charts.personal_genres_chart import plot_personal_genres_wordcloud
from charts.personal_attraction_points_chart import plot_personal_attraction_radar_chart
from charts.personal_emotion_points_chart import plot_personal_emotion_radar_chart
from charts.personal_actors_list import process_personal_actors_data
from charts.personal_directors_list import process_personal_directors_data
from data.data_processor import (fetch_personal_genres_data, fetch_personal_attraction_points_data,
                                 fetch_personal_emotion_points_data, get_top_personal_actors, get_top_personal_directors)

def generate_personal_charts(mem_num):
    personal_genres_df = fetch_personal_genres_data(mem_num)
    plot_personal_genres_wordcloud(personal_genres_df, mem_num)

    personal_attraction_df = fetch_personal_attraction_points_data(mem_num)
    plot_personal_attraction_radar_chart(personal_attraction_df, mem_num)

    personal_emotion_df = fetch_personal_emotion_points_data(mem_num)
    plot_personal_emotion_radar_chart(personal_emotion_df, mem_num)

    personal_actors_df = get_top_personal_actors(mem_num)
    process_personal_actors_data(personal_actors_df, mem_num)

    personal_directors_df = get_top_personal_directors(mem_num)
    process_personal_directors_data(personal_directors_df, mem_num)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("오류: 회원 정보가 제공되지 않았습니다.")
        sys.exit(1)

    try:
        # Java에서 전달된 영화 ID를 정수로 변환
        mem_num = int(sys.argv[1])
        generate_personal_charts(mem_num)

    except ValueError:
        print("오류: 제공된 영화 ID는 정수여야 합니다.")
        sys.exit(1)