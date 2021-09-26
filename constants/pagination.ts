/** PAGINATION */
const PER_PAGE = 10
const LIMIT_PAGE = 100

const PAGINATION = (page, pageLimit): { STARTPAGE, PERPAGE } => {
    const PAGE = page ? page : 1
    const PERPAGE = !pageLimit ? PER_PAGE : (pageLimit > LIMIT_PAGE ? LIMIT_PAGE : parseInt(pageLimit, 10))
    const STARTPAGE = (PAGE - 1) * PERPAGE
    return { STARTPAGE, PERPAGE }
}
export {
    PAGINATION,
    PER_PAGE,
    LIMIT_PAGE
}