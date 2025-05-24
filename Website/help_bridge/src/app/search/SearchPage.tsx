"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./SearchPage.css";
import HelperCard from "../components/HelperCard"; // ajustează calea dacă e nevoie
import { Helper as HelperModel } from "@/app/models/Helper";
import { HelperCategory } from "@/app/models/HelperCategory";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import {
  fetchHelperByCategoryId,
  fetchHelperCategoryById,
  fetchAllHelperCategories,
} from "../utils";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("helperCategoryId");
  const [allCategories, setAllCategories] = useState<HelperCategory[]>([]);
  const [helpersByCategory, setHelpersByCategory] = useState<
    Record<number, HelperModel[]>
  >({});

  const [helpers, setHelpers] = useState<HelperModel[]>([]);
  const [category, setCategory] = useState<HelperCategory>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAllCategoriesAndHelpers = async () => {
      try {
        const categoriesData = await fetchAllHelperCategories();
        if (!categoriesData) {
          setError("Failed to load categories.");
          return;
        }
        setAllCategories(categoriesData);

        const helpersByCat: Record<number, HelperModel[]> = {};
        for (const cat of categoriesData) {
          const helpersData = await fetchHelperByCategoryId(cat.HC_id);
          if (!helpersData) {
            setError("Failed to load helpers.");
            return;
          }
          helpersByCat[cat.HC_id] = helpersData;
        }
        setHelpersByCategory(helpersByCat);
      } catch {
        setError("Failed to load helpers.");
      } finally {
        setLoading(false);
      }
    };

    if (!categoryId) {
      fetchAllCategoriesAndHelpers();
    } else {
      const fetchHelpers = async () => {
        try {
          const helpersData = await fetchHelperByCategoryId(categoryId);
          if (helpersData) setHelpers(helpersData);
        } catch {
          setError("Failed to load helpers.");
        } finally {
          setLoading(false);
        }
      };

      const fetchCategory = async () => {
        try {
          const categoryData = await fetchHelperCategoryById(categoryId);
          if (categoryData) setCategory(categoryData);
        } catch {
          setError("Failed to load category.");
        } finally {
          setLoading(false);
        }
      };

      fetchHelpers();
      fetchCategory();
    }
  }, [categoryId]);

  return (
    <div className="bg-secondary">
      <div className="container  pt-5 pb-5">
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

        {!categoryId ? (
          allCategories.map((cat) => (
            <div key={cat.HC_id} className="mb-5">
              <h2 className="mb-3">{cat.Name}</h2>
              <div className="row">
                {helpersByCategory[cat.HC_id]?.length > 0 ? (
                  helpersByCategory[cat.HC_id].map((helper) => (
                    <div className="col-md-4 mb-3" key={helper.H_id}>
                      <HelperCard
                        H_id={helper.H_id}
                        name={helper.getFullName()}
                        category={cat.Name}
                        experience={helper.getFormatedExperience()}
                        imageId={helper.I_id}
                      />
                    </div>
                  ))
                ) : (
                  <p>No helpers in this category.</p>
                )}
              </div>
            </div>
          ))
        ) : helpers.length > 0 ? (
          <div className="row">
            {helpers.map((h) => (
              <div className="col-md-6 mt-4 d-flex" key={h.H_id}>
                <HelperCard
                  H_id={h.H_id}
                  name={h.getFullName()}
                  category={category?.Name}
                  experience={h.getFormatedExperience()}
                  imageId={h.I_id}
                />
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="col-12">
              <div className="card p-3 text-center">
                No helpers found for this category.
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
