const searchUser = 
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
                getRepos(defaultUsername);

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

        //display all the repositories
        const getRepos = async (username) => {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const reposData = await response.json();
            console.log(reposData);
            
            const repositoriesContainer = document.getElementById('repositories');
            reposData.forEach(repository => {
                
                const repositoryElement = document.createElement('div');
                repositoryElement.classList.add('repository');
                repositoryElement.innerHTML = `<h3>${repository.name}</h3>`;
                repositoryElement.innerHTML += `<p class="description">${repository.description || 'No description available'}</p>`;
            
                const languages = async function(owner, repoName){
                    // console.log(owner);
                    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`);
                    const allLanguages = await response.json();
                    console.log(allLanguages)
                    repositoryElement.innerHTML += `<p class="lang">${Object.keys(allLanguages).join('</p><p class="lang">') || "Not Defined"}</p>`;
                }
                // console.log(repository.owner.login, repository.name);
                languages(repository.owner.login, repository.name);

                repositoriesContainer.appendChild(repositoryElement);
            });
        }
        
        
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