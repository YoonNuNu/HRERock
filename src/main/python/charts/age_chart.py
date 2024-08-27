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
        return '10대'
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
    age_groups = ['10대', '20대', '30대', '40대', '50대', '60대 이상']

    # 나이대 별 리뷰 수
    age_group_counts = age_df['age_group'].value_counts().sort_index().reindex(age_groups, fill_value=0)

    # 그래프
    fig, ax = plt.subplots(figsize=(8, 8))

    ax.bar(age_group_counts.index, age_group_counts.values, color='skyblue')
    ax.set_xlabel('나이대')
    ax.set_ylabel('작성자 수')
    ax.set_xticks(range(len(age_group_counts.index)))
    ax.set_xticklabels(age_group_counts.index, rotation=45)

    plt.tight_layout()
    # plt.show()

    # 파일 경로 설정
    file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'age_chart_{movie_id}.png')
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # 파일로 저장
    fig.savefig(file_path)

    # 기존 파일 덮어쓰기
    plt.close()