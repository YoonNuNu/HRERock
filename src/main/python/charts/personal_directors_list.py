import json

def process_personal_directors_data(personal_directors_df, mem_num):

    # 배우 카운트
    top_5_directors = personal_directors_df['director_name'].value_counts().head(5).index.to_list()

    # 배우 정보 필터링
    top_5_directors_info = personal_directors_df[personal_directors_df['director_name'].isin(top_5_directors)]

    # 결과 반환
    result = top_5_directors_info.to_dict('records')

    # JSON으로 저장
    with open(f'src/main/resources/static/json/personal_directors_{mem_num}.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)

    return result