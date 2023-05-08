;(async () => {
  // const _ = await chrome.cookies.set({
  //   name: 'success',
  //   value: 'true',
  //   url: 'http://localhost:5173',
  // })
  // no host permissions for given url
  // I don't think there are cookies inside the background sandbox?
  // const cookies = await chrome.cookies.getAll({})
  // console.log('these are the cookies', cookies)
  chrome.identity.getProfileUserInfo(userInfo => {
    chrome.storage.local.set({identity: userInfo.email})
  })
})()
