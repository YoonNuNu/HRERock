import sys

from charts.age_chart import plot_age_bar_chart
from charts.attraction_chart import plot_attraction_rader_chart
from charts.emotion_chart import plot_emotion_radar_chart
from charts.gender_chart import plot_gender_pie_charts
from data.data_processor import (fetch_gender_data, fetch_age_data, fetch_attraction_points_data,
                                 fetch_emotion_points_data)


def generate_charts(movie_id):
    gender_df = fetch_gender_data(movie_id)
    plot_gender_pie_charts(gender_df, movie_id)

    age_df = fetch_age_data(movie_id)
    plot_age_bar_chart(age_df, movie_id)

    attraction_points_df = fetch_attraction_points_data(movie_id)
    plot_attraction_rader_chart(attraction_points_df, movie_id)

    emotion_points_df = fetch_emotion_points_data(movie_id)
    plot_emotion_radar_chart(emotion_points_df, movie_id)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("오류: 영화 ID가 제공되지 않았습니다.")
        sys.exit(1)

    try:
        # Java에서 전달된 영화 ID를 정수로 변환
        movie_id = int(sys.argv[1])
        generate_charts(movie_id)

    except ValueError:
        print("오류: 제공된 영화 ID는 정수여야 합니다.")
        sys.exit(1)