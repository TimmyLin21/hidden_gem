import { describe, expect, it } from 'vitest'
import { getPaginationList, getRestaurantsTypesString } from './utils'

describe('getPaginationList', () => {
    it('show only one page', () => {
        expect(getPaginationList(1, 1)).toEqual([1])
    })

    it('show current page is first page but have two pages in total', () => {
        expect(getPaginationList(1, 2)).toEqual([1, 2])
    })

    it('show current page is first page but have three pages in total', () => {
        expect(getPaginationList(1, 3)).toEqual([1, 2, -1])
    })

    it('show current page is second page and have three pages in total', () => {
        expect(getPaginationList(2, 3)).toEqual([1, 2, 3])
    })

    it('show current page is second page and have four pages in total', () => {
        expect(getPaginationList(2, 4)).toEqual([1, 2, 3, -1])
    })

    it('show current page is third page and have four pages in total', () => {
        expect(getPaginationList(3, 4)).toEqual([1, 2, 3, 4])
    })

    it('show current page is third page and have five pages in total', () => {
        expect(getPaginationList(3, 5)).toEqual([1, 2, 3, 4, -1])
    })

    it('show current page is fourth page and have five pages in total', () => {
        expect(getPaginationList(4, 5)).toEqual([1, -1, 3, 4, 5])
    })

    it('show current page is fourth page and have six pages in total', () => {
        expect(getPaginationList(4, 6)).toEqual([1, -1, 3, 4, 5, -1])
    })

    it('show current page is fifth page and have six pages in total', () => {
        expect(getPaginationList(5, 6)).toEqual([1, -1, 4, 5, 6])
    })

    it('show current page is fifth page and have seven pages in total', () => {
        expect(getPaginationList(5, 7)).toEqual([1, -1, 4, 5, 6, -1])
    })

    it('show current page is sixth page and have seven pages in total', () => {
        expect(getPaginationList(6, 7)).toEqual([1, -1, 5, 6, 7])
    })

    it('show current page is sixth page and have eight pages in total', () => {
        expect(getPaginationList(6, 8)).toEqual([1, -1, 5, 6, 7, -1])
    })
})

describe('getRestaurantsTypesString', () => {
    it('show empty string if no types', () => {
        expect(getRestaurantsTypesString([])).toEqual('')
    })

    it('remove "restaurant" and capitalize words', () => {
        expect(getRestaurantsTypesString(['italian_restaurant', 'fast_food'])).toEqual('Italian, Fast Food')
    })

    it('handle types with more than two words', () => {
        expect(getRestaurantsTypesString(['bar_and_grill', 'chicken_wings_restaurant'])).toEqual('Bar And Grill, Chicken Wings')
    })

    it('remove predefined types', () => {
        expect(getRestaurantsTypesString(["point_of_interest", "restaurant", "food", "establishment"])).toEqual('')
    })
})