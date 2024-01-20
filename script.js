
//JavaScript will start loading and displaying once html dom is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("fetch starting...");

    const defaultUsername = 'johnpapa';

    const getUserInfo = async(username) => {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        console.log(data);
        return data;
    }
    getUserInfo(defaultUsername);
});