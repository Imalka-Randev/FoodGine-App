import * as FileSystem from 'expo-file-system/legacy';

export const cacheImageLocally = async (imageUrl, recipeId) => {
  if (!imageUrl) return null;
  if (typeof imageUrl !== 'string') return imageUrl; // It's a local require()

  try {
    // Extract the file extension (e.g., .jpg, .png)
    const extension = imageUrl.split('.').pop().split('?')[0]; 
    // Define where to save it on the device
    const localUri = `${FileSystem.documentDirectory}${recipeId}.${extension}`;

    // Check if we already downloaded it
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      return localUri; // Return local path if already exists
    }

    // Otherwise, download the image to the device
    const downloadResult = await FileSystem.downloadAsync(imageUrl, localUri);
    return downloadResult.uri;
  } catch (error) {
    console.error("Error caching image: ", error);
    return imageUrl; // Fallback to web URL if download fails
  }
};