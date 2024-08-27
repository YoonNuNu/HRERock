import numpy as np
import matplotlib.pyplot as plt
import os
import matplotlib.font_manager as fm

# 한글 폰트 설정
font_path = 'C:/Windows/Fonts/malgun.ttf'  # 맑은 고딕 폰트 경로
font_name = fm.FontProperties(fname=font_path).get_name()
plt.rc('font', family=font_name)

def byte_to_bool(b):
    return b != b'\x00'

def process_attraction_points_data(df):
    total_reviews = len(df)

    if total_reviews == 0:
        return {
            '감독 연출': 0,
            '배우 연기': 0,
            '영상미': 0,
            '스토리': 0,
            'OST': 0
        }

    attraction_ratios = {
        '감독 연출': df['directing_point'].apply(byte_to_bool).sum() / total_reviews,
        '배우 연기': df['acting_point'].apply(byte_to_bool).sum() / total_reviews,
        '영상미': df['visual_point'].apply(byte_to_bool).sum() / total_reviews,
        '스토리': df['story_point'].apply(byte_to_bool).sum() / total_reviews,
        'OST': df['ost_point'].apply(byte_to_bool).sum() / total_reviews
    }
    return attraction_ratios

def plot_attraction_rader_chart(attraction_points_df, movie_id):
    attraction_ratios = process_attraction_points_data(attraction_points_df)

    categories = list(attraction_ratios.keys())
    values = list(attraction_ratios.values())


    # 각도 계산 (5각형을 위해 5개의 각도)
    angles = np.linspace(0, 2*np.pi, len(categories), endpoint=False).tolist()

    # 첫번째 값을 마지막에 추가하여 폐곡선 만들기
    values += values[:1]
    angles += angles[:1]

    # 그래프 그리기
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(projection='polar'))

    # 각도 조정 (첫 번째 카테고리가 12시 방향에 오도록)
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)  # 시계 방향으로 설정

    # 5각형 배경 그리기
    for i in range(6):
        scaled_bg_values = [0.2 * i] * (len(categories) + 1)
        ax.plot(angles, scaled_bg_values, 'gray', linewidth=0.5)

    # 기본 그리드 제거
    ax.grid(False)

    # 외부 원 제거
    ax.spines['polar'].set_visible(False)

    # 데이터 플롯
    ax.plot(angles, values, 'o-', linewidth=2, color='skyblue')
    ax.fill(angles, values, alpha=0.25, color='skyblue')

    # 기본 그리드 제거
    ax.grid(False)

    # 카테고리 레이블 추가
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)

    # y축 범위 설정 (0부터 1까지)
    ax.set_ylim(0, 1)
    ax.set_yticks([])

    # 방사형 축 그리기
    for angle in angles[:-1]:
        ax.plot([angle, angle], [0, 1], 'gray', linewidth=0.5)

    plt.tight_layout()

    # # y축 범위 설정 (0부터 1까지)
    # ax.set_ylim(0, 1)

    # 파일 경로 설정
    file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'attraction_chart_{movie_id}.png')
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # 파일로 저장
    fig.savefig(file_path)

     # 기존 파일 덮어쓰기
    plt.close()
    # plt.show()