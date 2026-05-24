// src/api/salesApi.js

const API_BASE =
  "http://192.250.228.179:9088/api/v1";

export async function getProductStats(
  params = {}
) {
  try {
    const query = new URLSearchParams();

    // ================= FILTER MAP =================
    if (params.company?.length) {
      query.append(
        "companyCode",
        params.company.join(",")
      );
    }

    if (params.branch?.length) {
      query.append(
        "branchCode",
        params.branch.join(",")
      );
    }

    if (params.customer?.length) {
      query.append(
        "customer",
        params.customer.join(",")
      );
    }

    if (params.salesperson?.length) {
      query.append(
        "salesPerson",
        params.salesperson.join(",")
      );
    }

    if (params.product?.length) {
      query.append(
        "itemCode",
        params.product.join(",")
      );
    }

    if (params.packingType?.length) {
      query.append(
        "packingType",
        params.packingType.join(",")
      );
    }

    if (params.selectedQuarters?.length) {
      query.append(
        "quarter",
        params.selectedQuarters.join(",")
      );
    }

    if (params.selectedMonths?.length) {
      query.append(
        "monthName",
        params.selectedMonths.join(",")
      );
    }

    // Financial Year
    if (params.selectedYears?.length) {

      // if API expects code instead of label,
      // map properly here later

      query.append(
        "finYearCode",
        params.selectedYears.join(",")
      );
    }

    // Optional Dates
    if (params.dateFrom) {
      query.append(
        "dateFrom",
        params.dateFrom
      );
    }

    if (params.dateUpto) {
      query.append(
        "dateUpto",
        params.dateUpto
      );
    }

    const response = await fetch(
      `${API_BASE}/MA_ProductOrderStats?${query.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch Product Order Stats"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Product Order Stats API Error:",
      error
    );

    return [];
  }
}

export async function getCustomerStats(
  params = {}
) {

  try {

    const query = new URLSearchParams();

    // ================= FILTER MAP =================

    if (params.company?.length) {
      query.append(
        "companyCode",
        params.company.join(",")
      );
    }

    if (params.branch?.length) {
      query.append(
        "branchCode",
        params.branch.join(",")
      );
    }

    if (params.customer?.length) {
      query.append(
        "customer",
        params.customer.join(",")
      );
    }

    if (params.salesperson?.length) {
      query.append(
        "salesPerson",
        params.salesperson.join(",")
      );
    }

    if (params.product?.length) {
      query.append(
        "itemCode",
        params.product.join(",")
      );
    }

    if (params.packingType?.length) {
      query.append(
        "packingType",
        params.packingType.join(",")
      );
    }

    if (params.selectedQuarters?.length) {
      query.append(
        "quarter",
        params.selectedQuarters.join(",")
      );
    }

    if (params.selectedMonths?.length) {
      query.append(
        "monthName",
        params.selectedMonths.join(",")
      );
    }

    if (params.selectedYears?.length) {
      query.append(
        "finYearCode",
        params.selectedYears.join(",")
      );
    }

    if (params.dateFrom) {
      query.append(
        "dateFrom",
        params.dateFrom
      );
    }

    if (params.dateUpto) {
      query.append(
        "dateUpto",
        params.dateUpto
      );
    }

    const response = await fetch(
      `${API_BASE}/MA_CustomerOrderStats?${query.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch Customer Order Stats"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Customer Order Stats API Error:",
      error
    );

    return [];
  }
}