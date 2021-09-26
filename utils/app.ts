const genCode = ()=>{
    return `${Math.round(Math.random() * 1E9)}`   
}
const findOne = async (object) => {
    return await object[0] || {};
}
export {
    genCode,
    findOne
}