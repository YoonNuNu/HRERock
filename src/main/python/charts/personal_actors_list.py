import json

def process_personal_actors_data(personal_actors_df, mem_num):

    # 배우 카운트
    top_5_actors = personal_actors_df['actor_name'].value_counts().head(5).index.to_list()

    # 배우 정보 필터링
    top_5_actors_info = personal_actors_df[personal_actors_df['actor_name'].isin(top_5_actors)]

    # 결과 반환
    result = top_5_actors_info.to_dict('records')

    # JSON으로 저장
    with open(f'src/main/resources/static/json/personal_actors_{mem_num}.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)

    return result