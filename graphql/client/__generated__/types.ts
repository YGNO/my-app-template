export default {
    "scalars": [
        1,
        2,
        5
    ],
    "types": {
        "MunicipalityItem": {
            "code": [
                1
            ],
            "name": [
                2
            ],
            "nameAlpha": [
                2
            ],
            "nameKana": [
                2
            ],
            "prefectureCode": [
                1
            ],
            "__typename": [
                2
            ]
        },
        "Int": {},
        "String": {},
        "PrefectureItem": {
            "code": [
                1
            ],
            "municipalities": [
                0
            ],
            "name": [
                2
            ],
            "nameAlpha": [
                2
            ],
            "nameKana": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Query": {
            "municipalites": [
                0
            ],
            "municipality": [
                0,
                {
                    "code": [
                        1,
                        "Int!"
                    ]
                }
            ],
            "prefecture": [
                3,
                {
                    "code": [
                        1,
                        "Int!"
                    ]
                }
            ],
            "prefectures": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "Boolean": {}
    }
}