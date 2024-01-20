//JavaScript will start loading and displaying once html dom is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    const defaultUsername = 'johnpapa';

    //fetching all the details
    const getUserInfo = async(username) => {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        return data;
    }
  
    //display all the required user information
    getUserInfo(defaultUsername)
        .then(data => {
            const displayInfo = () => {
                console.log(data);
                const userInfoContainer = document.getElementById('user-info');
                userInfoContainer.innerHTML = `
                    <img src="${data.avatar_url}" alt="Profile Picture">
                    <h2>${data.name || data.login}</h2>
                    <p>${data.bio || 'No bio available'}</p>
                    <p>Location: ${data.location || 'Not specified'}</p>
                    <p>GitHub: <a href="${data.html_url}" target="_blank">${data.login}</a></p>
                    ${renderSocialLinks(data)}
                `;

                //hidding loader once process is done
                const loaderElement = document.querySelector('.loader-container');
                if (loaderElement) {
                    loaderElement.style.display = 'none';
                }
            };

            //social links
            function renderSocialLinks(data) {
                const socialLinks = [];
                if (data.twitter_username) {
                    socialLinks.push(`<a href="https://twitter.com/${data.twitter_username}" target="_blank">Twitter</a>`);
                }
                if (data.blog) {
                    socialLinks.push(`<a href="${data.blog}" target="_blank">Blog</a>`);
                }
                return socialLinks.join(' | ');
                    
            }
            showLoader();
            displayInfo();
        })
        .catch(error => console.error('Error:', error));

        //display all the
        
        //display loader while processing
        function showLoader() {
            const repositoriesContainer = document.getElementById('repositories');
            repositoriesContainer.innerHTML = ''; // Clear existing content
        
            const loaderContainer = document.createElement('div');
            loaderContainer.classList.add('loader-container');
            loaderContainer.innerHTML = '<div class="loader"></div>';
            repositoriesContainer.appendChild(loaderContainer);
        }
});