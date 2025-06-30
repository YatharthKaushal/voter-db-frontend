import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { storeVoters, getAllVoters } from "../utils/indexDB"; // Adjust path as necessary

const VoterContextOffline = createContext();

export const useVoters = () => {
  const context = useContext(VoterContextOffline);
  if (!context) {
    throw new Error("useVoters must be used within a VoterProvider");
  }
  return context;
};

export const VoterProviderOffline = ({ children }) => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);
  const [offlineData, setOfflineData] = useState([]);

  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://voter-backend-y6hw.onrender.com";

  const fetchVoters = async (page = 1, limit = 25, filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();

      const response = await axios.get(
        `${BASE_URL}/api/voters/all?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDAxOGFkYzY3ZjI5Y2NjMzU0ZDQ3MyIsImlhdCI6MTc0OTAzMTA5MywiZXhwIjoxNzQ5MDc0MjkzfQ.4y2FO2IrA2P7Aampgmttmb3Bz3gGi9tPgx9iveNC8zw`,
          },
        }
      );

      const data = response.data.data;
      setVoters(data);
      setTotalPageCount(response.data.totalPages);
      setTotalRecordsCount(response.data.total);

      // Store in IndexedDB in background
      storeVoters(data).catch((err) =>
        console.error("IndexedDB store error:", err)
      );
    } catch (err) {
      console.error("Error fetching voters:", err);
      setError("Failed to fetch voters");

      // Offline fallback
      const localData = await getAllVoters();
      setVoters(localData);
      setOfflineData(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const addVoter = async (voterData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/voters/create`,
        voterData
      );
      setVoters((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error adding voter:", err);
      setError("Failed to add voter");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVoter = async (id, voterData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/voters/update/${id}`,
        voterData
      );
      setVoters((prev) =>
        prev.map((voter) => (voter._id === id ? response.data : voter))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating voter:", err);
      setError("Failed to update voter");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVoter = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/voters/delete/${id}`);
      setVoters((prev) => prev.filter((voter) => voter._id !== id));
    } catch (err) {
      console.error("Error deleting voter:", err);
      setError("Failed to delete voter");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const importVoters = async (newVoters) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/voters/import`,
        newVoters
      );
      return response.data;
    } catch (err) {
      console.error("Error importing voters:", err);
      setError("Failed to import voters");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    voters,
    loading,
    error,
    totalPageCount,
    totalRecordsCount,
    fetchVoters,
    addVoter,
    updateVoter,
    deleteVoter,
    importVoters,
    setOfflineData,
    offlineData,
  };

  return (
    <VoterProviderOffline.Provider value={value}>
      {children}
    </VoterProviderOffline.Provider>
  );
};

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { mockVoters } from "../data/mockData";
// import axios from "axios";

// const VoterContextOffline = createContext();

// export const useVoters = () => {
//   const context = useContext(VoterContextOffline);
//   if (!context) {
//     throw new Error("useVoters must be used within a VoterProviderOffline");
//   }
//   return context;
// };

// export const VoterProviderOffline = ({ children }) => {
//   const [voters, setVoters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalPageCount, setTotalPageCount] = useState();
//   const [totalRecordsCount, setTotalRecordsCount] = useState();

//   const BASE_URL =
//     import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

//   useEffect(() => {
//     setLoading(true);
//     // axios fetch data
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/voters?page=1&limit=50`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDAxOGFkYzY3ZjI5Y2NjMzU0ZDQ3MyIsImlhdCI6MTc0OTAzMTA5MywiZXhwIjoxNzQ5MDc0MjkzfQ.4y2FO2IrA2P7Aampgmttmb3Bz3gGi9tPgx9iveNC8zw`,
//             // Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         setVoters(response.data.data);
//         setTotalPageCount(response.data.totalPages);
//         setTotalRecordsCount(response.data.total);
//         console.log("> response.data: ", response.data);
//       } catch (err) {
//         console.error("Error fetching voters:", err);
//         setError("Failed to fetch voters");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const addVoter = async (voterData) => {
//     setLoading(true);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const newVoter = {
//           ...voterData,
//           id: Date.now(),
//         };
//         setVoters((prev) => [...prev, newVoter]);
//         setLoading(false);
//         resolve(newVoter);
//       }, 500);
//     });
//   };

//   const updateVoter = async (id, voterData) => {
//     setLoading(true);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         setVoters((prev) =>
//           prev.map((voter) =>
//             voter.id === id ? { ...voter, ...voterData } : voter
//           )
//         );
//         setLoading(false);
//         resolve(voterData);
//       }, 500);
//     });
//   };

//   const deleteVoter = async (id) => {
//     setLoading(true);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         setVoters((prev) => prev.filter((voter) => voter.id !== id));
//         setLoading(false);
//         resolve();
//       }, 500);
//     });
//   };

//   const importVoters = async (newVoters) => {
//     setLoading(true);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         setVoters((prev) => [...prev, ...newVoters]);
//         setLoading(false);
//         resolve(newVoters);
//       }, 1000);
//     });
//   };

//   const value = {
//     voters,
//     loading,
//     addVoter,
//     updateVoter,
//     deleteVoter,
//     importVoters,
//     totalPageCount,
//     totalRecordsCount,
//   };

//   return (
//     <VoterContextOffline.Provider value={value}>{children}</VoterContextOffline.Provider>
//   );
// };
