import serviceProvider from "./serviceProvider";

export const Get = (path, headers) =>
  serviceProvider.get(path, { ...(headers && { headers }) });

export const PostWithMultiPart = (
  path,
  params, // Changed to FormData type
  headers
) => {
  // Ensure headers contain 'Content-Type': 'multipart/form-data'
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  };

  return serviceProvider.post(path, params, config);
};

export const Post = (
  path,
  params, // Changed to FormData type
  headers
) => {
  return serviceProvider.post(path, params, { ...(headers && { headers }) });
};

export const UpdateWithPost = (path, params, headers) =>
  serviceProvider.post(path, params, { ...(headers && { headers }) });

export const Put = (path, params, headers) =>
  serviceProvider.put(path, params, { ...(headers && { headers }) });

export const Patch = (path, params, headers) =>
  serviceProvider.patch(path, params, { ...(headers && { headers }) });

export const Delete = (path, params, headers) =>
  serviceProvider.delete(path, { ...(headers && { headers }) });
