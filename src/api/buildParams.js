export const buildParams = (paramsObj = {}) => {
  const params = new URLSearchParams();

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  return params.toString();
};
