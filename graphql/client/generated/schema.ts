// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Int: number,
    String: string,
    Boolean: boolean,
}

export interface MunicipalityItem {
    code: Scalars['Int']
    name: Scalars['String']
    nameAlpha: Scalars['String']
    nameKana: Scalars['String']
    prefectureCode: Scalars['Int']
    __typename: 'MunicipalityItem'
}

export interface PrefectureItem {
    code: Scalars['Int']
    municipalities: (MunicipalityItem[] | null)
    name: Scalars['String']
    nameAlpha: Scalars['String']
    nameKana: Scalars['String']
    __typename: 'PrefectureItem'
}

export interface Query {
    municipalites: (MunicipalityItem[] | null)
    municipality: (MunicipalityItem | null)
    prefecture: (PrefectureItem | null)
    prefectures: (PrefectureItem[] | null)
    __typename: 'Query'
}

export interface MunicipalityItemGenqlSelection{
    code?: boolean | number
    name?: boolean | number
    nameAlpha?: boolean | number
    nameKana?: boolean | number
    prefectureCode?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PrefectureItemGenqlSelection{
    code?: boolean | number
    municipalities?: MunicipalityItemGenqlSelection
    name?: boolean | number
    nameAlpha?: boolean | number
    nameKana?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    municipalites?: MunicipalityItemGenqlSelection
    municipality?: (MunicipalityItemGenqlSelection & { __args: {code: Scalars['Int']} })
    prefecture?: (PrefectureItemGenqlSelection & { __args: {code: Scalars['Int']} })
    prefectures?: PrefectureItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const MunicipalityItem_possibleTypes: string[] = ['MunicipalityItem']
    export const isMunicipalityItem = (obj?: { __typename?: any } | null): obj is MunicipalityItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMunicipalityItem"')
      return MunicipalityItem_possibleTypes.includes(obj.__typename)
    }
    


    const PrefectureItem_possibleTypes: string[] = ['PrefectureItem']
    export const isPrefectureItem = (obj?: { __typename?: any } | null): obj is PrefectureItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPrefectureItem"')
      return PrefectureItem_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    