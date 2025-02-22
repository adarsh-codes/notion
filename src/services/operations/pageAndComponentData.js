import { setProgress } from "../../slices/loadingBarSlice";
import { apiConnector } from '../apiConnector';
import { catalogData } from '../apis';

export const getCatalogaPageData = async (categoryId, dispatch) => {
  console.log("Category ID received:", categoryId);

  if (!categoryId) {
    console.error("Invalid categoryId:", categoryId);
    return { success: false, message: "Invalid category ID" };
  }

  dispatch(setProgress(50));
  let result = [];
  try {
    // Send categoryId as a query parameter
    const response = await apiConnector(
      "GET",
      `${catalogData.CATALOGPAGEDATA_API}?categoryId=${categoryId}`
    );
    console.log("CATALOG PAGE DATA API RESPONSE....", response);

    if (response?.data?.success) {
      result = response.data;
    } else {
      console.error("Unexpected response format:", response);
      result = { success: false, message: "Could not fetch category page data" };
    }
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);

    if (error.response) {
      console.error("API Response Error:", error.response.data);
      result = error.response.data;
    } else if (error.request) {
      console.error("No response received from API:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    result = { success: false, message: "Failed to fetch category page data" };
  }

  dispatch(setProgress(100));
  return result;
};


