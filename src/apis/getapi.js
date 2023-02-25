import { API_URL } from "../utils/constants";
import Cookies from 'universal-cookie';


export async function getApi(url_param) {
    const cookies = new Cookies();
    var token = await cookies.get('user_id');
    AbortSignal.timeout ??= function timeout(ms) {
        const ctrl = new AbortController()
        setTimeout(() => {
            ctrl.close()
            // console.log('reached');
        }, ms)
        return ctrl.signal
    }

    let url = API_URL + url_param;
    let h = {}
    if (token !== "")
        h = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    else {
        h = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + payload.token
        }
    }
    // h = {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     // 'Authorization': 'Bearer ' + token
    // }
    let resp = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        method: 'GET',
        headers: h,
        // credentials: "include",
        // body: JSON.stringify(data)
    });
    let res = await resp.json();

    return res;

}