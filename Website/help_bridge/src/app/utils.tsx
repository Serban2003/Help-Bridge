import { User, transformToUser } from "./models/User";
import { Helper, transformToHelper } from "./models/Helper";
import { HelperCategory, transformToCategory } from "./models/HelperCategory";
import { Review, transformToReview } from "./models/Review";
import { ProfileImage, transformToProfileImage } from "./models/ProfileImage";
import { Availability, transformToAvailability } from "./models/Availability";
import { Appointment } from "./models/Appointment";

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

export const updateUserById = async (
  userId: string | number,
  updatedUserData: Partial<User>
): Promise<User | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/users?id=${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      }
    );

    if (!response.ok) throw new Error("Failed to update user");

    const data = await response.json();
    console.log(data);
    return transformToUser(data[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const deleteUser = async (userId: string | number): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/users?id=${userId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

export const changeUserPassword = async (
  U_id: number | string,
  current: string,
  newPass: string
) => {
  const res = await fetch(`http://localhost:5000/api/users/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      U_id,
      currentPassword: current,
      newPassword: newPass,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Password change failed");
  }

  return await res.json();
};

// HELPERS
export const fetchAllHelpers = async (): Promise<Helper[] | null> => {
  try {
    const response = await fetch("http://localhost:5000/api/helpers");
    if (!response.ok) throw new Error("Failed to fetch helpers");

    const data = await response.json();
    return data.map((item: any) => transformToHelper(item));
  } catch (error) {
    console.error("Error fetching helpers:", error);
    return null;
  }
};

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

export const deleteHelper = async (
  helperId: string | number
): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/helpers?id=${helperId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete helper");
    }

    return true;
  } catch (error) {
    console.error("Error deleting helper:", error);
    return false;
  }
};

export const updateHelperById = async (
  helperId: string | number,
  updateHelperData: Partial<Helper>
): Promise<Helper | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/helpers?id=${helperId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateHelperData),
      }
    );

    if (!response.ok) throw new Error("Failed to update helper");

    const data = await response.json();
    return transformToHelper(data);
  } catch (error) {
    console.error("Error updating helper:", error);
    return null;
  }
};

export const changeHelperPassword = async (
  H_id: number | string,
  current: string,
  newPass: string
) => {
  const res = await fetch("http://localhost:5000/api/helpers/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      H_id,
      currentPassword: current,
      newPassword: newPass,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Password change failed");
  }

  return await res.json();
};

// HELP CATEGORIES
export const fetchAllHelperCategories = async (): Promise<
  HelperCategory[] | null
> => {
  try {
    const response = await fetch("http://localhost:5000/api/helper_categories");
    if (!response.ok) throw new Error("Failed to fetch categories");

    const data = await response.json();
    return data.map((item: any) => transformToCategory(item));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

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
    if (data.message == "Reviews not found") return null;

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
export const createProfileImage = async (
  profileImage: File
): Promise<number> => {
  const imageFormData = new FormData();
  imageFormData.append("image", profileImage);

  const imageResponse = await fetch("http://localhost:5000/api/images", {
    method: "POST",
    body: imageFormData,
  });

  if (!imageResponse.ok) throw new Error("Image upload failed.");
  const imageData = await imageResponse.json();
  return imageData.I_id;
};

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

// AVAILABILITY
export const addHelperAvailability = async (
  helperId: number | string,
  date: string,
  hours: string[]
): Promise<any | null> => {
  try {
    const response = await fetch("http://localhost:5000/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        H_id: helperId,
        date: date,
        hours: hours,
      }),
    });

    if (!response.ok) throw new Error("Failed to set availability");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error setting availability:", error);
    return null;
  }
}

export const deleteHelperAvailability = async (
  availabilityIds: (number | string)[]
): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:5000/api/availability", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: availabilityIds }),
    });

    if (!response.ok) throw new Error("Failed to delete availability");

    return true;
  } catch (error) {
    console.error("Error deleting availability:", error);
    return false;
  }
};

export const fetchAvailabilityByHelperId = async (
  helperId: number | string
): Promise<Availability[] | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/availability?helperId=${helperId}`
    );
    if (!response.ok) throw new Error("Failed to fetch availability");

    const data = await response.json();
    if (data.message == "Availability not found") return null;

    return data.map((availability: any) =>
      transformToAvailability(availability)
    );
  } catch (error) {
    console.error("Error fetching availability:", error);
    return null;
  }
};

export const updateAvailability = async (
  AV_id: number | string,
  A_id: number | string,
  IsBooked: boolean
): Promise<any | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/availability?id=${AV_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IsBooked: IsBooked,
          A_id: A_id, // assuming you actually need A_id sent
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update availability");
    }

    const result = await response.json();
    console.log("Availability update result:", result);
    return result;
  } catch (error) {
    console.error("Error updating availability:", error);
    return null;
  }
};

// Appointments
export const createAppointment = async (
  appointment: Appointment
): Promise<number | null> => {
  try {
    const response = await fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        H_id: appointment.H_id,
        Title: appointment.Title,
        Message: appointment.Message,
        Date: appointment.Date.toISOString(),
        U_id: appointment.U_id,
      }),
    });

    if (!response.ok) throw new Error("Failed to create appointment");

    const data = await response.json();
    return data.A_id; // Assuming A_id is the appointment ID
  } catch (error) {
    console.error("Error creating appointment:", error);
    return null;
  }
};

export const fetchAppointmentsByUserId = async (
  userId: number | string
): Promise<any[] | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/appointments?userId=${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch appointments");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return null;
  }
};
export const fetchAppointmentsByHelperId = async (
  helperId: number | string
): Promise<any[] | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/appointments?helperId=${helperId}`
    );
    if (!response.ok) throw new Error("Failed to fetch appointments");

    const data = await response.json();
    console.log("Fetched appointments:", data);
   
    return data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
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

export function getFormattedDate(
  date: Date,
  type: "yyyy-mm-dd" | "dd-mm-yyyy"
) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");

  if (type === "yyyy-mm-dd") {
    return `${yyyy}-${mm}-${dd}`;
  } else if (type === "dd-mm-yyyy") {
    return `${dd}-${mm}-${yyyy}`;
  } else {
    throw new Error(`Invalid date format type: ${type}`);
  }
}
