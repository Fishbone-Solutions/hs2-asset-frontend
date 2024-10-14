import serviceProvider from "./serviceProvider";

export const Get = (path, headers) =>
  serviceProvider.get(path, { ...(headers && { headers }) });

export const PostWithMultiPart = (
  path,
  params, // FormData object
  headers,
  onProgress // Optional callback for upload progress
) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      ...headers,
    },
    onUploadProgress: (data) => {
      if (onProgress) {
        // Update progress value to reflect the progress bar
        onProgress(Math.round((100 * data.loaded) / data.total));
      }
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
