import json

def process_personal_actors_data(personal_actors_df, mem_num):

    # 결과 반환
    result = personal_actors_df.to_dict('records')

    # JSON으로 저장
    with open(f'src/main/resources/static/json/personal_actors_{mem_num}.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)

    return result