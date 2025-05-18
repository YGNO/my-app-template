// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Date: any,
    JSON: any,
    Boolean: boolean,
    Int: number,
    SlickgridFilterValue: any,
    String: string,
    Float: number,
}

export interface Mutation {
    updatePrefecture: (Scalars['Boolean'] | null)
    __typename: 'Mutation'
}

export type PrefectureTable_filter_fields = 'code' | 'name' | 'nameAlpha' | 'nameKana'

export type PrefectureTable_order_fields = 'code' | 'name' | 'nameAlpha' | 'nameKana'

export interface PrefectureTable_query_node {
    code: (Scalars['JSON'] | null)
    name: (Scalars['JSON'] | null)
    nameAlpha: (Scalars['JSON'] | null)
    nameKana: (Scalars['JSON'] | null)
    __typename: 'PrefectureTable_query_node'
}

export interface PrefectureTable_query_result {
    nodes: (PrefectureTable_query_node[] | null)
    totalCount: (Scalars['Int'] | null)
    __typename: 'PrefectureTable_query_result'
}

export interface Query {
    PrefectureTable: (PrefectureTable_query_result | null)
    municipalities: (municipality[] | null)
    municipality: (municipality | null)
    prefecture: (prefecture | null)
    prefectures: (prefecture[] | null)
    __typename: 'Query'
}

export type SlickgridDirection = 'ASC' | 'DESC' | 'asc' | 'desc'

export type SlickgridOperator = 'Contains' | 'EQ' | 'EndsWith' | 'GE' | 'GT' | 'IN' | 'LE' | 'LT' | 'NE' | 'NOT_IN' | 'Not_Contains' | 'StartsWith'

export interface municipality {
    code: Scalars['Int']
    name: Scalars['String']
    nameAlpha: Scalars['String']
    nameKana: Scalars['String']
    prefectureCode: Scalars['Int']
    __typename: 'municipality'
}

export interface prefecture {
    code: Scalars['Int']
    municipalitis: (municipality[] | null)
    name: Scalars['String']
    nameAlpha: Scalars['String']
    nameKana: Scalars['String']
    __typename: 'prefecture'
}

export interface MutationGenqlSelection{
    updatePrefecture?: { __args: {input: updatePrefectureInput} }
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PrefectureTable_filter {field: PrefectureTable_filter_fields,operator: SlickgridOperator,value: Scalars['SlickgridFilterValue']}

export interface PrefectureTable_order {direction: SlickgridDirection,field: PrefectureTable_order_fields}

export interface PrefectureTable_query_nodeGenqlSelection{
    code?: boolean | number
    name?: boolean | number
    nameAlpha?: boolean | number
    nameKana?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PrefectureTable_query_resultGenqlSelection{
    nodes?: PrefectureTable_query_nodeGenqlSelection
    totalCount?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    PrefectureTable?: (PrefectureTable_query_resultGenqlSelection & { __args: {filterBy?: (PrefectureTable_filter[] | null), first: Scalars['Int'], offset: Scalars['Int'], orderBy?: (PrefectureTable_order[] | null)} })
    municipalities?: municipalityGenqlSelection
    municipality?: (municipalityGenqlSelection & { __args: {code: Scalars['Int']} })
    prefecture?: (prefectureGenqlSelection & { __args: {code: Scalars['Int']} })
    prefectures?: prefectureGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface municipalityGenqlSelection{
    code?: boolean | number
    name?: boolean | number
    nameAlpha?: boolean | number
    nameKana?: boolean | number
    prefectureCode?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface prefectureGenqlSelection{
    code?: boolean | number
    municipalitis?: municipalityGenqlSelection
    name?: boolean | number
    nameAlpha?: boolean | number
    nameKana?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface updatePrefectureInput {code: Scalars['Float'],name: Scalars['String'],nameAlpha: Scalars['String'],nameKana: Scalars['String']}


    const Mutation_possibleTypes: string[] = ['Mutation']
    export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
      return Mutation_possibleTypes.includes(obj.__typename)
    }
    


    const PrefectureTable_query_node_possibleTypes: string[] = ['PrefectureTable_query_node']
    export const isPrefectureTable_query_node = (obj?: { __typename?: any } | null): obj is PrefectureTable_query_node => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPrefectureTable_query_node"')
      return PrefectureTable_query_node_possibleTypes.includes(obj.__typename)
    }
    


    const PrefectureTable_query_result_possibleTypes: string[] = ['PrefectureTable_query_result']
    export const isPrefectureTable_query_result = (obj?: { __typename?: any } | null): obj is PrefectureTable_query_result => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPrefectureTable_query_result"')
      return PrefectureTable_query_result_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const municipality_possibleTypes: string[] = ['municipality']
    export const ismunicipality = (obj?: { __typename?: any } | null): obj is municipality => {
      if (!obj?.__typename) throw new Error('__typename is missing in "ismunicipality"')
      return municipality_possibleTypes.includes(obj.__typename)
    }
    


    const prefecture_possibleTypes: string[] = ['prefecture']
    export const isprefecture = (obj?: { __typename?: any } | null): obj is prefecture => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isprefecture"')
      return prefecture_possibleTypes.includes(obj.__typename)
    }
    

export const enumPrefectureTableFilterFields = {
   code: 'code' as const,
   name: 'name' as const,
   nameAlpha: 'nameAlpha' as const,
   nameKana: 'nameKana' as const
}

export const enumPrefectureTableOrderFields = {
   code: 'code' as const,
   name: 'name' as const,
   nameAlpha: 'nameAlpha' as const,
   nameKana: 'nameKana' as const
}

export const enumSlickgridDirection = {
   ASC: 'ASC' as const,
   DESC: 'DESC' as const,
   asc: 'asc' as const,
   desc: 'desc' as const
}

export const enumSlickgridOperator = {
   Contains: 'Contains' as const,
   EQ: 'EQ' as const,
   EndsWith: 'EndsWith' as const,
   GE: 'GE' as const,
   GT: 'GT' as const,
   IN: 'IN' as const,
   LE: 'LE' as const,
   LT: 'LT' as const,
   NE: 'NE' as const,
   NOT_IN: 'NOT_IN' as const,
   Not_Contains: 'Not_Contains' as const,
   StartsWith: 'StartsWith' as const
}
