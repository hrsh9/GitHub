document.addEventListener('DOMContentLoaded', function () {
    const defaultUsername = 'johnpapa';
    const githubToken = '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';

    let currentPage = 1;
    let repositoriesPerPage = 10;

    async function fetchUserInfo(username) {
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
            },
        });

        const data = await response.json();
        return data;
    }

    function renderUserInfo(user) {
        const userInfoContainer = document.getElementById('user-info');
        userInfoContainer.innerHTML = `
            <img src="${user.avatar_url}" alt="Profile Picture">
            <h2>${user.name || user.login}</h2>
            <p>${user.bio || 'No bio available'}</p>
            <p>Location: ${user.location || 'Not specified'}</p>
            <p>GitHub: <a href="${user.html_url}" target="_blank">${user.login}</a></p>
            ${renderSocialLinks(user)}
        `;
    }

    function renderSocialLinks(user) {
        const socialLinks = [];
        if (user.twitter_username) {
            socialLinks.push(`<a href="https://twitter.com/${user.twitter_username}" target="_blank">Twitter</a>`);
        }
        if (user.blog) {
            socialLinks.push(`<a href="${user.blog}" target="_blank">Blog</a>`);
        }
        // Add more social links as needed
        return socialLinks.join(' | ');
    }
    showLoader();
    async function fetchRepositories(username, page) {
        const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${repositoriesPerPage}`, {
           
        });

        const data = await response.json();
        return data;

    }

    function renderRepositories(repositories) {
        const repositoriesContainer = document.getElementById('repositories');
        repositoriesContainer.innerHTML = '';
        const ns = "Not Specified";

        repositories.forEach(repository => {
            const repositoryElement = document.createElement('div');
            repositoryElement.classList.add('repository');
            repositoryElement.innerHTML = `<h3>${repository.name}</h3>`;
            repositoryElement.innerHTML += `<p class="description">${repository.description || 'No description available'}</p>`;
            // repositoryElement.innerHTML += `<p class="lang">${repository.language || ns}</p>`;
            // repositoryElement.innerHTML += `<button onclick="showRepositoryLanguages('${repository.owner.login}', '${repository.name}')">Show Languages</button>`;
            
            window.showRepositoryLanguages = async function (owner, repoName) {
                const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`, {
                    headers: {
                      Authorization: `Bearer ${githubToken}`,
                    },
                });

                const data = await response.json();
                // console.log(`Languages used in ${repoName}: ${Object.keys(data).join(', ')}`);
                repositoryElement.innerHTML += `<p class="lang">${Object.keys(data).join('</p><p class="lang">') || ns}</p>`
            };

            showRepositoryLanguages(repository.owner.login, repository.name);
            
            repositoriesContainer.appendChild(repositoryElement);
           


        });
    }

    function showLoader() {
        const repositoriesContainer = document.getElementById('repositories');
        repositoriesContainer.innerHTML = ''; // Clear existing content

        const loaderContainer = document.createElement('div');
        loaderContainer.classList.add('loader-container');
        loaderContainer.innerHTML = '<div class="loader"></div>';
        repositoriesContainer.appendChild(loaderContainer);
    }

    window.searchRepositories = async function () {
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim() || defaultUsername;

        const perPageSelect = document.getElementById('perPage');
        repositoriesPerPage = parseInt(perPageSelect.value, 10);

        showLoader();

        const [userInfo, repositories] = await Promise.all([
            fetchUserInfo(username),
            fetchRepositories(username, currentPage),
        ]);

        renderUserInfo(userInfo);
        renderRepositories(repositories);
        renderPagination();
    };

    function renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = `
            <label for="perPage">Repositories per page:</label>
            <select id="perPage" onchange="searchRepositories()">
                <option value="10" ${repositoriesPerPage === 10 ? 'selected' : ''}>10</option>
                <option value="30" ${repositoriesPerPage === 30 ? 'selected' : ''}>30</option>
                <option value="50" ${repositoriesPerPage === 50 ? 'selected' : ''}>50</option>
                <option value="100" ${repositoriesPerPage === 100 ? 'selected' : ''}>100</option>
            </select>
            <button onclick="changePage(-1)">Previous</button>
            <button onclick="changePage(1)">Next</button>
        `;
    }

    window.changePage = function (delta) {
        currentPage += delta;
        searchRepositories();
    };

    
    searchRepositories();
});