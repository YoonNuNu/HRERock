
const postList = [
    {
        "no": 1,
        "title": "스타워즈 에피소드 4",
        "genre": "모험액션 SF",
        "director": "조지루카스",
        "createDate": 98
    },
    {
        "no": 1,
        "title": "스타워즈 에피소드 4",
        "genre": "모험액션 SF",
        "director": "조지루카스",
        "createDate": 98
    },
    {
        "no": 1,
        "title": "스타워즈 에피소드 4",
        "genre": "모험액션 SF",
        "director": "조지루카스",
        "createDate": 98
    },
    {
        "no": 1,
        "title": "스타워즈 에피소드 4",
        "genre": "모험액션 SF",
        "director": "조지루카스",
        "createDate": 98
    },
    {
        "no": 1,
        "title": "스타워즈 에피소드 4",
        "genre": "모험액션 SF",
        "director": "조지루카스",
        "createDate": 98
    },
];

const getPostByNo = no => {
    const array = postList.filter(x => x.no == no);
    if (array.length == 1) {
        return array[0];
    }
    return null;
}

export {
    postList,
    getPostByNo
};