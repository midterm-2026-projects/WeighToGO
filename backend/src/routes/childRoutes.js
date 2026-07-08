import { filterChildMasterlist } from "../service/childService.js";

export default async function childHandler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const barangay = url.searchParams.get("barangay") || "All";
    const ageGroup = url.searchParams.get("ageGroup") || "All";
    const status = url.searchParams.get("status") || "All";

    const dataSubset = await filterChildMasterlist(barangay, ageGroup, status);

    return res.status(200).json({
      success: true,
      totalCount: dataSubset.length,
      records: dataSubset
    });

  } catch (error) {
    if (
      error.message === "Invalid Barangay selection" ||
      error.message === "Invalid Nutritional Age Group selection" ||
      error.message === "Invalid Nutritional Status selection"
    ) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server registry parsing failure" });
  }
}