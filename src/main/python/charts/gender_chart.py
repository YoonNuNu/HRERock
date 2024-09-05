import numpy as np
import matplotlib.pyplot as plt
import os
import matplotlib.font_manager as fm

# 한글 폰트 설정
font_path = 'C:/Windows/Fonts/malgun.ttf'  # 맑은 고딕 폰트 경로
font_name = fm.FontProperties(fname=font_path).get_name()
plt.rc('font', family=font_name)

def plot_gender_pie_charts(gender_df, movie_id):
    gender_counts = gender_df['mem_gender'].value_counts()

    # 그림 객체 생성
    fig, ax = plt.subplots(figsize=(8, 8))

    # 파이 차트 그리기
    wedges, texts, autotexts = ax.pie(
        gender_counts,
        labels=gender_counts.index,
        autopct='%1.1f%%',
        startangle=90,
        colors=['#64C7EE', '#E78BB5']
    )

    # 글자 크기 설정
    plt.setp(texts, size=24, weight='bold')
    plt.setp(autotexts, size=24, weight='bold')

    ax.axis('equal')

    # 파일 경로 설정
    file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'gender_chart_{movie_id}.png')
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # 파일로 저장
    fig.savefig(file_path)

    plt.close()