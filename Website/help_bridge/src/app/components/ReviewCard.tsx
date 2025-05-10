import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { User as UserModel } from "@/app/models/User";
import "./ReviewCard.css"; // Import your CSS file for styling
import { fetchUserById } from "../utils";

interface ReviewCardProps {
  U_id: number;
  rating: number;
  description: string;
  date: Date;
}

const ReviewCard = ({ U_id, rating, description, date }: ReviewCardProps) => {
  // Fetch reviews
  const [user, setUser] = useState<UserModel | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchUserById(U_id);
      console.log(userData);
      setUser(userData);
    };
    fetchUser();
  }, [U_id]);

  console.log(date);
  return (
    <div className="review-card mb-4 p-3 rounded shadow-sm border bg-white">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 fw-semibold">{user?.getFullName()}</h6>
        <small className="text-muted">
          {date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour12: false, // 24-hour format
          })}
        </small>
      </div>
      <StarRating rating={rating} editable={false} />
      <p className="mt-2 mb-0">{description}</p>
    </div>
  );
};

export default ReviewCard;
