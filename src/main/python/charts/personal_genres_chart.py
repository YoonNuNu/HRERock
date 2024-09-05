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
#     try:
#         # logger.info(f"Starting to plot wordcloud for member {mem_num}")
#         # logger.info(f"Current working directory: {os.getcwd()}")
#
#         if personal_genres_df.empty:
#             # logger.warning(f"No genre data for member {mem_num}")
#             return
#
#         genre_counts = personal_genres_df['genre_name'].value_counts()
#         # logger.info(f"Genre counts:\n{genre_counts.to_string()}")
#
#         # 워드클라우드 생성 및 저장
#         font_path = 'C:/Windows/Fonts/malgun.ttf'
#         masking_image_path = os.path.join('src', 'main', 'resources', 'static', 'wordcloud', 'film.png')
#
#         mask_image = Image.open(masking_image_path).convert('L')
#         mask = np.array(mask_image)
#
#         wc = WordCloud(width=800, height=800, font_path=font_path, mask=mask,
#                        max_words=20, background_color=None, mode='RGBA', colormap='Set2')
#         wc.generate_from_frequencies(genre_counts)
#
#         file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'personal_genres_{mem_num}.png')
#         wc.to_file(file_path)
#         # logger.info(f"Wordcloud saved at: {file_path}")
#
#         # if os.path.exists(file_path):
#         #     file_size = os.path.getsize(file_path)
#             # logger.info(f"File created successfully. Size: {file_size} bytes")
#         # else:
#         #     logger.error(f"Failed to create file at {file_path}")
#
#     except Exception as e:
#         logger.error(f"Error in plot_personal_genres_wordcloud: {str(e)}")
#         # logger.error(traceback.format_exc())
#
# # logger.info("plot_personal_genres_wordcloud function defined successfully")

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
