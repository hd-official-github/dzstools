/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
if (process.env.NODE_ENV == 'production') {
    var F = "https://cute-outfit-fly.cyclic.app/"
} else {
    var F = "http://localhost:8000/"
}
export const API_URL = F;