"use client";
import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Review } from "@/app/models/Review";
import StarRating from "./StarRating";
import "./HelperCard.css";
import { useRouter } from "next/navigation";
import { ProfileImage } from "@/app/models/ProfileImage";

import {
  fetchProfileImageById,
  fetchReviewsByHelperId,
  getAverageRating,
} from "../utils";

interface HelperCardProps {
  H_id: number;
  name: string;
  category: string | undefined;
  experience: string;
  imageId?: number | null;
}

const HelperCard = ({
  H_id,
  name,
  category,
  experience,
  imageId,
}: HelperCardProps) => {
  const [imageUrl, setImageUrl] = useState<string>(
    "/images/default-avatar.jpg"
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/helper?helperId=${H_id}`); // Navigate to the helper details page
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!imageId) {
        setLoading(false);
        return;
      }

      try {
        const imageData = await fetchProfileImageById(imageId);

        if (imageData) {
          setImageUrl(
            ProfileImage.fromByteArrayToImageUrl(imageData.Data.data)
          );
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!H_id) {
        setLoading(false);
        return;
      }
      const reviewsData = await fetchReviewsByHelperId(H_id);
      if (reviewsData) {
        setReviews(reviewsData);
        // Calculate average rating
        if (reviewsData.length > 0) {
          setAverageRating(getAverageRating(reviewsData));
        } else {
          setAverageRating(0);
        }
      }
    };

    fetchReviews();
  }, [H_id]);

  return (
    <div className="helper-card rounded shadow flex-fill" onClick={handleClick}>
      <div className="helper-avatar">
        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${name}'s profile`}
            onError={() => setImageUrl("/images/default_avatar.svg")}
            className="profile-img"
          />
        )}
      </div>
      <div className="helper-info">
        <h4 className="helper-name">{name}</h4>
        <p className="helper-category">{category ? category : "No category"}</p>
        <p className="helper-experience">Experience: {experience}</p>
        <StarRating rating={averageRating} />
      </div>
    </div>
  );
};

export default HelperCard;
