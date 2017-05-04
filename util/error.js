export const handleAuthResponse = (responseObject) => {
  if (responseObject.ok === false && responseObject.error === 'invalid_code') {
    throw true
  }
}
