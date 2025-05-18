export default {
    "scalars": [
        0,
        1,
        3,
        5,
        7,
        10,
        12,
        13,
        14,
        16,
        19
    ],
    "types": {
        "Date": {},
        "JSON": {},
        "Mutation": {
            "updatePrefecture": [
                3,
                {
                    "input": [
                        18,
                        "updatePrefectureInput!"
                    ]
                }
            ],
            "__typename": [
                16
            ]
        },
        "Boolean": {},
        "PrefectureTable_filter": {
            "field": [
                5
            ],
            "operator": [
                14
            ],
            "value": [
                13
            ],
            "__typename": [
                16
            ]
        },
        "PrefectureTable_filter_fields": {},
        "PrefectureTable_order": {
            "direction": [
                12
            ],
            "field": [
                7
            ],
            "__typename": [
                16
            ]
        },
        "PrefectureTable_order_fields": {},
        "PrefectureTable_query_node": {
            "code": [
                1
            ],
            "name": [
                1
            ],
            "nameAlpha": [
                1
            ],
            "nameKana": [
                1
            ],
            "__typename": [
                16
            ]
        },
        "PrefectureTable_query_result": {
            "nodes": [
                8
            ],
            "totalCount": [
                10
            ],
            "__typename": [
                16
            ]
        },
        "Int": {},
        "Query": {
            "PrefectureTable": [
                9,
                {
                    "filterBy": [
                        4,
                        "[PrefectureTable_filter!]"
                    ],
                    "first": [
                        10,
                        "Int!"
                    ],
                    "offset": [
                        10,
                        "Int!"
                    ],
                    "orderBy": [
                        6,
                        "[PrefectureTable_order!]"
                    ]
                }
            ],
            "municipalities": [
                15
            ],
            "municipality": [
                15,
                {
                    "code": [
                        10,
                        "Int!"
                    ]
                }
            ],
            "prefecture": [
                17,
                {
                    "code": [
                        10,
                        "Int!"
                    ]
                }
            ],
            "prefectures": [
                17
            ],
            "__typename": [
                16
            ]
        },
        "SlickgridDirection": {},
        "SlickgridFilterValue": {},
        "SlickgridOperator": {},
        "municipality": {
            "code": [
                10
            ],
            "name": [
                16
            ],
            "nameAlpha": [
                16
            ],
            "nameKana": [
                16
            ],
            "prefectureCode": [
                10
            ],
            "__typename": [
                16
            ]
        },
        "String": {},
        "prefecture": {
            "code": [
                10
            ],
            "municipalitis": [
                15
            ],
            "name": [
                16
            ],
            "nameAlpha": [
                16
            ],
            "nameKana": [
                16
            ],
            "__typename": [
                16
            ]
        },
        "updatePrefectureInput": {
            "code": [
                19
            ],
            "name": [
                16
            ],
            "nameAlpha": [
                16
            ],
            "nameKana": [
                16
            ],
            "__typename": [
                16
            ]
        },
        "Float": {}
    }
}