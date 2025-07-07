import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const usePagination = (fetchFunction, initialSearch = "", initialPage = 1, limit = 10) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const fetchData = useCallback(async () => {
  //   setLoading(true);
  //   setError("");

  //   try {
     
  //     let response;
  //     if (typeof fetchFunction === "string") {
       
  //       response = await axios.get(fetchFunction, {
  //         params: { search, page, limit },
  //       });
  //     } else if (typeof fetchFunction === "function") {
       
  //       response = await fetchFunction(page, search, limit);
        
  //     } else {
  //       throw new Error("Invalid fetch function or endpoint");
  //     }
  //    console.log(response.data)
  //     setData(response.data?.data || []);
  //     setTotalPages(response.data?.totalPages || 1);
  //   } catch (err) {
  //     console.error("API Error:", err);
  //     setError(err.response?.data?.message || "Failed to load data");
  //   }

  //   setLoading(false);
  // }, [fetchFunction, search, page, limit]);


 const fetchData = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    let response;
    if (typeof fetchFunction === "string") {
      response = await axios.get(fetchFunction, {
        params: { search, page, limit },
      });
    } else if (typeof fetchFunction === "function") {
      response = await fetchFunction(page, search, limit);
    } else {
      throw new Error("Invalid fetch function or endpoint");
    }

    const res = response.data;

    if (Array.isArray(res)) {
      setData(res);               // ✅ FIX: Your case
      setTotalPages(1);
    } else if (res.data && Array.isArray(res.data)) {
      setData(res.data);
      setTotalPages(res.totalPages || 1);
    } else {
      setData([]);                // fallback
    }
  } catch (err) {
    console.error("API Error:", err);
    setError(err.response?.data?.message || "Failed to load data");
  }

  setLoading(false);
}, [fetchFunction, search, page, limit]);



  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    loading,
    error,
    refetch,
  };
};

export default usePagination;
