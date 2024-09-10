import json

def process_personal_directors_data(personal_directors_df, mem_num):

    # 결과 반환
    result = personal_directors_df.to_dict('records')

    # JSON으로 저장
    with open(f'src/main/resources/static/json/personal_directors_{mem_num}.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)

    return result