document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    if (query) {
        searchCrypto(query);
    }
});

const searchCrypto = (query) => {
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${query}&vs_currencies=usd`)
        .then(response => {
            if (!response.ok) throw new Error('Cryptocurrency not found');
            return response.json();
        })
        .then(data => displayCrypto(data, query))
        .catch(error => alert(error.message));
};

const displayCrypto = (data, query) => {
    const container = document.getElementById('crypto-container');
    container.innerHTML = ''; // Clear previous results

    const cryptoItem = document.createElement('div');
    cryptoItem.className = 'crypto-item';
    cryptoItem.innerHTML = `
        <h2>${query.toUpperCase()}</h2>
        <p>Price: $${data[query].usd}</p>
        <button onclick="addToWatchlist('${query}')">Add to Watchlist</button>
    `;
    container.appendChild(cryptoItem);
};

const addToWatchlist = (crypto) => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.includes(crypto)) {
        watchlist.push(crypto);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        updateWatchlist();
    }
};

const updateWatchlist = () => {
    const watchlistContainer = document.getElementById('watchlist-container');
    watchlistContainer.innerHTML = '';

    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.forEach(crypto => {
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`)
            .then(response => response.json())
            .then(data => {
                const cryptoItem = document.createElement('div');
                cryptoItem.className = 'crypto-item';
                cryptoItem.innerHTML = `
                    <h2>${crypto.toUpperCase()}</h2>
                    <p>Price: $${data[crypto].usd}</p>
                `;
                watchlistContainer.appendChild(cryptoItem);
            });
    });
};

// Initialize watchlist on page load
document.addEventListener('DOMContentLoaded', updateWatchlist);

// Disclaimer Popup Logic
document.addEventListener('DOMContentLoaded', () => {
    const disclaimerPopup = document.getElementById('disclaimer-popup');
    const closePopupButton = document.getElementById('close-popup');

    // Show the popup
    disclaimerPopup.style.display = 'flex';

    // Close the popup when the button is clicked
    closePopupButton.addEventListener('click', () => {
        disclaimerPopup.style.display = 'none';
    });
});
