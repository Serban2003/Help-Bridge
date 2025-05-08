"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./SearchPage.css";
import HelperCard from "../components/HelperCard"; // ajustează calea dacă e nevoie
import { Helper as HelperModel } from "@/app/models/Helper";
import { HelperCategory } from "@/app/models/HelperCategory";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { transformToHelper } from "@/app/models/Helper";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("helperCategoryId");
  const [helpers, setHelpers] = useState<HelperModel[]>([]);
  const [category, setCategory] = useState<HelperCategory>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/helpers?helperCategoryId=${categoryId}`
        );
        if (!response.ok) throw new Error("Failed to fetch helpers");

        const data = await response.json();
        const helpers = data.map((item: any) => transformToHelper(item));
        setHelpers(helpers);
      } catch (err) {
        setError("Unable to load helpers. Please try again later.");
        console.error("Error fetching helpers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchHelpers();
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/helper_categories?id=${categoryId}`
        );
        if (!response.ok) throw new Error("Failed to fetch category");

        const data = await response.json();
        setCategory(data);
      } catch (err) {
        setError("Unable to load category. Please try again later.");
        console.error("Error fetching category:", err);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  return (
    <div className="bg-secondary vh-100">
      <div className="container  pt-5">
        <div className="d-flex flex-column align-items-center justify-content-center">
        <img
          src="/images/helpers_page.svg"
          alt="Illustration"
          className="illustration"
        />

        <h1 className="fs-1 fw-bold">Find the Right Expert for You</h1>
        <h2 className="fs-2">Choose Your Helper</h2>
</div>
        

        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="container mt-4">
          <div className="row">
            {helpers.length > 0
              ? helpers.map((h) => (
                  <div className="col-md-6 mb-4 d-flex" key={h.H_id}>
                    <HelperCard
                      H_id={h.H_id}
                      name={h.getFullName()}
                      category={category?.Name}
                      experience={h.getFormatedExperience()}
                      imageId={h.I_id}
                    />
                  </div>
                ))
              : !loading && (
                  <div className="col-12">
                    <div className="card p-3 text-center">
                      No helpers found for this category.
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}
