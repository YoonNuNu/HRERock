import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from wordcloud import WordCloud
import os


def plot_personal_genres_wordcloud(personal_genres_df, mem_num):
    genre_counts = personal_genres_df['genre_name'].value_counts()

    # 한글 폰트 설정 (Windows 예시)
    font_path = 'C:/Windows/Fonts/malgun.ttf'  # 맑은 고딕 폰트 경로
    if not os.path.exists(font_path):  # 폰트 경로가 존재하는지 확인
        raise FileNotFoundError(f"Font not found: {font_path}")

    # wordcloud 생성 이미지
    masking_image = np.array(Image.open(os.path.join(".", "src", "main", "resources", "static", "wordcloud", "film.png")))

    # base_path = os.path.join(".", "src", "main", "resources", "static", "wordcloud")
    # file_path = os.path.join(base_path, "film.png")
    # masking_image = np.array(Image.open(file_path))

    # wordcloud 생성
    wordcloud = WordCloud(width=800,
                          height=400,
                          font_path=font_path,
                          mask = masking_image,
                          background_color='white').generate_from_frequencies(genre_counts)

    # 그림객체 생성
    fig, ax = plt.subplots(figsize=(8, 8))

    ax.imshow(wordcloud, interpolation='bilinear')
    ax.axis('off')

    # 파일 경로 설정
    file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'personal_genres_{mem_num}.png')
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # 파일로 저장
    fig.savefig(file_path)

    # 기존 파일 덮어쓰기
    plt.close()