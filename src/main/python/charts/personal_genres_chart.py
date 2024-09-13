import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from wordcloud import WordCloud
import os
import logging
import sys
import traceback
import pandas as pd

# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

def plot_personal_genres_wordcloud(personal_genres_df, mem_num):

    genre_counts = personal_genres_df['genre_name'].value_counts()

    # 워드클라우드 생성 및 저장
    font_path = 'C:/Windows/Fonts/malgun.ttf'
    masking_image_path = os.path.join('src', 'main', 'resources', 'static', 'wordcloud', 'film.png')

    mask_image = Image.open(masking_image_path).convert('L')
    mask = np.array(mask_image)

    wc = WordCloud(width=800, height=800, font_path=font_path, mask=mask,
                   max_words=20, background_color=None, mode='RGBA', colormap='Set2')
    wc.generate_from_frequencies(genre_counts)

    file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'personal_genres_{mem_num}.png')
    wc.to_file(file_path)
