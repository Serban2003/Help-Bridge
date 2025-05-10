import { User, transformToUser } from "./models/User";
import { Helper, transformToHelper } from "./models/Helper";
import { HelperCategory, transformToCategory } from "./models/HelperCategory";
import { Review, transformToReview } from "./models/Review";
import { ProfileImage, transformToProfileImage } from "./models/ProfileImage";

// USERS
export const fetchUserById = async (
  userId: number | string
): Promise<User | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/users?id=${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch user");

    const data = await response.json();
    return transformToUser(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// HELPERS
export const fetchHelperById = async (
  helperId: number | string
): Promise<Helper | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/helpers?id=${helperId}`
    );
    if (!response.ok) throw new Error("Failed to fetch helper");

    const data = await response.json();
    return transformToHelper(data[0]);
  } catch (error) {
    console.error("Error fetching helper:", error);
    return null;
  }
};

export const fetchHelperByCategoryId = async (
  helperCategoryId: number | string
): Promise<Helper[] | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/helpers?helperCategoryId=${helperCategoryId}`
    );
    if (!response.ok) throw new Error("Failed to fetch helpers");

    const data = await response.json();
    return data.map((item: any) => transformToHelper(item));
  } catch (error) {
    console.error("Error fetching helpers:", error);
    return null;
  }
};

// HELP CATEGORIES
export const fetchHelperCategoryById = async (
  categoryId: number | string
): Promise<HelperCategory | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/helper_categories?id=${categoryId}`
    );
    if (!response.ok) throw new Error("Failed to fetch category");

    const data = await response.json();
    return transformToCategory(data);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

// REVIEWS
export const fetchReviewsByHelperId = async (
  helperId: number | string
): Promise<Review[] | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/reviews?helperId=${helperId}`
    );
    if (!response.ok) throw new Error("Failed to fetch reviews");

    const data = await response.json();
    if(data.message == "Reviews not found") return null;

    return data.map((review: any) => transformToReview(review));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
};

export const getAverageRating = (reviews: Review[]): number => {
  const avg =
    reviews.reduce((sum: number, review: Review) => sum + review.Rating, 0) /
    reviews.length;
  return Math.round(avg * 10) / 10;
};

// PROFILE IMAGES
export const fetchProfileImageById = async (
  imageId: number | string
): Promise<ProfileImage | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/images?id=${imageId}`
    );
    if (!response.ok) throw new Error("Failed to fetch profile image");

    const data = await response.json();
    return transformToProfileImage(data);
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return null;
  }
};

// MISC
export function bufferToDate(buffer: any): Date {
  // Extract the integer from the buffer
  const timestamp = buffer.data.reduce(
    (acc: number, byte: number, index: number) => {
      return acc + (byte << (8 * index));
    },
    0
  );

  // Convert UNIX timestamp to milliseconds and return Date object
  return new Date(timestamp * 1000);
}
