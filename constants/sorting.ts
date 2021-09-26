const SORT = {
    DESC: `DESC`,
    ASC: `ASC`
}
const RESTAURANT_SORT = {
    CREATEDAT: "restaurants.createdAt"
}

const ORDERBY = (SORT_SET, SORT_BY, SORTING) => {
    if (!SORT_SET[SORT_BY]) SORT_BY = SORT_SET.CREATED_AT
    else SORT_BY = SORT_SET[SORT_BY]

    if (!SORT[SORTING]) SORTING = SORT.ASC
    else SORTING = SORT[SORTING]
    return { SORT_BY, SORT: SORTING }
}
export {
    ORDERBY,
    SORT,
    RESTAURANT_SORT
}