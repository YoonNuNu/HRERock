import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os
import matplotlib.font_manager as fm

# 한글 폰트 설정
font_path = 'C:/Windows/Fonts/malgun.ttf'  # 맑은 고딕 폰트 경로
font_name = fm.FontProperties(fname=font_path).get_name()
plt.rc('font', family=font_name)

# 나이계산
def age_calculator(mem_birth):
    today = datetime.today()
    mem_birth_year = mem_birth.year
    present_year = today.year

    mem_age = present_year - mem_birth_year

    return mem_age

def age_group(mem_age):
    if mem_age < 20:
        return '20대 미만'
    elif mem_age <30:
        return '20대'
    elif mem_age <40:
        return '30대'
    elif mem_age <50:
        return '40대'
    elif mem_age <60:
        return '50대'
    else:
        return '60대 이상'

def plot_age_bar_chart(age_df, movie_id):
    # 나이계산
    age_df['mem_birth'] = pd.to_datetime(age_df['mem_birth'])
    age_df['mem_age'] = age_df['mem_birth'].apply(age_calculator)

    # 나이대 구분
    age_df['age_group'] = age_df['mem_age'].apply(age_group)

    # 모든 나이대 범주 정의
    age_groups = ['20대 미만', '20대', '30대', '40대', '50대', '60대 이상']

    # 막대 색상
    colors = ['#4E8CC0', '#4DBBBD', '#EF767F', '#EBCB7E', '#EF767F', '#EBCB7E']

    # 나이대 별 리뷰 수
    age_group_counts = age_df['age_group'].value_counts().sort_index().reindex(age_groups, fill_value=0)

    fig, ax = plt.subplots(figsize=(9, 7.8))

    bars = ax.bar(age_group_counts.index, age_group_counts.values, color=colors)

    # 그래프 설정
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.tick_params(bottom=False, left=False)
    ax.set_xticklabels(age_group_counts.index, rotation=0, fontsize=24, fontweight='bold')
    ax.set_yticks([])

    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.0f}',
                ha='center', va='bottom', fontsize=24, fontweight='bold')

    plt.tight_layout()

    # 파일 경로 설정
    file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'age_chart_{movie_id}.png')
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # 파일로 저장
    fig.savefig(file_path)

    plt.close()