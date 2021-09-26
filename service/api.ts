import axios from "axios"
const getMethod = async (url, token?: any) => {
    try {
        const result = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return result
    } catch (error) {
        console.log(error.message);
        return false
    }
}

export {
    getMethod
}