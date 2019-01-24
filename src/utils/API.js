

const host = `https://api.staging.brokercloud.io/v1`;
const client_id = `844b0a54-c0af-11e7-abc4-cec278b6b50a`;


export const signIn = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('client_id', client_id);
  formData.append('username', email);
  formData.append('password', password);
  return fetch (`${host}/oauth/token`,
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
      body: formData.toString(),
    json: true,
  }
).then((res) => res.json());
};


export const getUserInfo = (accessToken) => {
  return fetch(`${host}/users/me`, {
    headers: {
    'Authorization': `Bearer ${accessToken}`,
  }
  }).then((res) => res.json());
}

export const searchMarkets = (userId, accessToken) => {
  return fetch(`${host}/users/${userId}/markets-search`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  }).then((res) => res.json());
}

export const getFavorites = (accountId, accessToken) => {
  return fetch(`${host}/accounts/${accountId}/watchlist`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
  }
}).then((res) => res.json());
}

export const addRemoveFromWatchlist = (accountId, marketId, accessToken, isFollowing) => {

  return fetch (`${host}/accounts/${accountId}/watchlist/${marketId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        "Content-Type": "application/json",
    },
    body: JSON.stringify({'following': isFollowing })
  }
).then((res) => res.json());
}
